const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const crypto = require('node:crypto');
const fs = require('node:fs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://agtechsolutionofficial_db_user:hHBfw95dNjKekEmw@cluster0.5fcavy3.mongodb.net/shimanzu?appName=Cluster0";
const CLOUD_NAME = "p8vpwwcg";
const API_KEY = "377931843173741";
const API_SECRET = "KbuoEAP4ho7yGOfPQS00AUWGdjk";

async function uploadImageToCloudinary(base64Data, publicId) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "shimanzu_products";
  
  // Sort parameters alphabetically for Cloudinary signature
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const formData = new URLSearchParams();
  formData.append('file', base64Data);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (res.ok && data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error(data.error?.message || `Upload failed with status ${res.status}`);
  }
}

async function run() {
  console.log("==================================================");
  console.log("Starting Image Migration to Cloudinary (p8vpwwcg)");
  console.log("==================================================");

  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("✓ Connected to MongoDB Atlas (shimanzu)");
  const db = client.db("shimanzu");
  const collection = db.collection("products");

  const products = await collection.find({}).toArray();
  console.log(`Found ${products.length} products in MongoDB.`);

  let uploadedCount = 0;
  let alreadyCloudinaryCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const rawImg = p.img_src || '';

    if (rawImg.includes('cloudinary.com')) {
      alreadyCloudinaryCount++;
      continue;
    }

    if (rawImg.startsWith('data:image')) {
      const cleanSlug = (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
      const publicId = `${cleanSlug}_${(p.id || '').slice(0, 8)}`;

      try {
        console.log(`[${i + 1}/${products.length}] Uploading image for: ${p.name}...`);
        const secureUrl = await uploadImageToCloudinary(rawImg, publicId);

        // Update MongoDB document
        await collection.updateOne(
          { id: p.id },
          { $set: { img_src: secureUrl, updated_at: new Date().toISOString() } }
        );

        p.img_src = secureUrl;
        uploadedCount++;
        console.log(`  ✓ Uploaded: ${secureUrl}`);
      } catch (err) {
        errorCount++;
        console.error(`  ✗ Error uploading ${p.name}:`, err.message);
      }
    } else {
      console.log(`[${i + 1}/${products.length}] Skipping non-base64 image for: ${p.name}`);
    }
  }

  // Update local backup file with new Cloudinary URLs
  try {
    fs.writeFileSync(
      "c:/Users/HP/Downloads/shimanzu/products_for_mongo.json",
      JSON.stringify(products, null, 2),
      'utf8'
    );
    console.log("✓ Updated products_for_mongo.json with permanent Cloudinary URLs.");
  } catch (e) {
    console.warn("Local file sync error:", e.message);
  }

  console.log("==================================================");
  console.log("Cloudinary Image Migration Summary:");
  console.log(`Total Products: ${products.length}`);
  console.log(`Newly Uploaded to Cloudinary: ${uploadedCount}`);
  console.log(`Already on Cloudinary: ${alreadyCloudinaryCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log("==================================================");

  await client.close();
}

run().catch(err => {
  console.error("Migration fatal error:", err);
  process.exit(1);
});
