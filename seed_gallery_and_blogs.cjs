// Script to explicitly seed or update Gallery and Blog photos into Cloudinary and MongoDB Atlas
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://agtechsolutionofficial_db_user:hHBfw95dNjKekEmw@cluster0.5fcavy3.mongodb.net/shimanzu?appName=Cluster0';
const DB_NAME = process.env.MONGODB_DB_NAME || 'shimanzu';
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'p8vpwwcg';
const API_KEY = process.env.CLOUDINARY_API_KEY || '377931843173741';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'KbuoEAP4ho7yGOfPQS00AUWGdjk';

async function uploadToCloudinary(imageInput, folder = 'shimanzu_gallery', publicId = null) {
  if (!imageInput) return '';
  if (typeof imageInput === 'string' && imageInput.includes('res.cloudinary.com')) return imageInput;

  try {
    const timestamp = Math.round(Date.now() / 1000);
    let payload = imageInput;

    if (typeof imageInput === 'string' && !imageInput.startsWith('data:') && !imageInput.startsWith('http://') && !imageInput.startsWith('https://')) {
      const fullPath = path.isAbsolute(imageInput) ? imageInput : path.resolve(__dirname, imageInput);
      if (fs.existsSync(fullPath)) {
        const ext = path.extname(fullPath).slice(1) || 'jpeg';
        const fileBuf = fs.readFileSync(fullPath);
        payload = `data:image/${ext};base64,${fileBuf.toString('base64')}`;
      }
    }

    const paramsObj = { folder, timestamp: String(timestamp) };
    if (publicId) paramsObj.public_id = publicId;

    const sortedKeys = Object.keys(paramsObj).sort();
    const paramsToSign = sortedKeys.map(k => `${k}=${paramsObj[k]}`).join('&') + API_SECRET;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', payload);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    if (publicId) formData.append('public_id', publicId);
    formData.append('signature', signature);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const uploadRes = await fetch(cloudUrl, {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (uploadRes.ok && uploadData.secure_url) {
      console.log(`✓ Cloudinary (${folder}): ${uploadData.secure_url}`);
      return uploadData.secure_url;
    } else {
      console.warn('Cloudinary upload warning:', uploadData);
      return uploadData.secure_url || imageInput;
    }
  } catch (err) {
    console.warn('Cloudinary upload error:', err.message);
    return imageInput;
  }
}

const GALLERY_ITEMS = [
  { id: 'gal-1',  cat: 'field',    title: 'Precision Spraying',       tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-2',  cat: 'field',    title: 'Green Crop Fields',        tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-3',  cat: 'field',    title: 'Rice Plantation',          tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-4',  cat: 'field',    title: 'Tractor Operations',       tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-5',  cat: 'field',    title: 'Seedling Growth',          tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-6',  cat: 'field',    title: 'Wheat Harvest',            tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-7',  cat: 'field',    title: 'Drone Agri Technology',    tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-8',  cat: 'field',    title: 'Irrigation Systems',       tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-9',  cat: 'field',    title: 'Sustainable Farming',      tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-10', cat: 'field',    title: 'Crop Monitoring',          tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-11', cat: 'field',    title: 'Vegetable Farming',        tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-12', cat: 'field',    title: 'Modern Agriculture',       tag: 'Field & Crops',  src: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-13', cat: 'lab',      title: 'Laboratory Testing',       tag: 'Lab & Research', src: 'https://images.pexels.com/photos/954583/pexels-photo-954583.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-14', cat: 'lab',      title: 'Chemical Analysis',        tag: 'Lab & Research', src: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-15', cat: 'lab',      title: 'Quality Control',          tag: 'Lab & Research', src: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-16', cat: 'lab',      title: 'Molecular Research',       tag: 'Lab & Research', src: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-17', cat: 'lab',      title: 'Formulation Development',  tag: 'Lab & Research', src: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-18', cat: 'lab',      title: 'HPLC Analysis',            tag: 'Lab & Research', src: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-19', cat: 'products', title: 'Agrochemical Solutions',   tag: 'Products',       src: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-20', cat: 'products', title: 'Crop Protection Range',    tag: 'Products',       src: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-21', cat: 'products', title: 'Herbicide Formulations',   tag: 'Products',       src: 'https://images.pexels.com/photos/4503267/pexels-photo-4503267.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-22', cat: 'products', title: 'Fungicide Series',         tag: 'Products',       src: 'https://images.pexels.com/photos/4503734/pexels-photo-4503734.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-23', cat: 'products', title: 'Insecticide Range',        tag: 'Products',       src: 'https://images.pexels.com/photos/4503271/pexels-photo-4503271.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'gal-24', cat: 'products', title: 'Bio-Stimulants',           tag: 'Products',       src: 'https://images.pexels.com/photos/4503269/pexels-photo-4503269.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

const BLOGS = [
  {
    id: 'blog-1',
    title: 'The Role of Agrochemicals in Modern Agriculture',
    desc: 'Discover how agrochemicals help increase crop yield, protect plants, and support sustainable farming practices for a better tomorrow.',
    content: "In today's rapidly evolving agricultural landscape, farmers face numerous challenges, including climate change, resource scarcity, and pest pressures. To address these challenges and achieve sustainable agricultural practices, farmers are increasingly turning to advanced agrochemical solutions that leverage technology and innovation.\n\nBy implementing modern crop protection strategies alongside high-quality Japanese formulations, crop yields can be significantly improved while maintaining ecological balance. At Shimanzu, we remain committed to pioneering breakthrough formulations that protect harvests and support agricultural prosperity.",
    img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
    category: 'Agriculture',
    date: '12 Apr 2025',
    author: 'Shimanzu Agrosciences'
  },
  {
    id: 'blog-2',
    title: 'Effective Ways to Control Common Pests in Crops',
    desc: 'Integrated Pest Management (IPM) represents a comprehensive approach to pest control that combines biological and chemical tools in a way that minimizes economic risks.',
    content: 'Integrated Pest Management (IPM) represents an ecosystem-based strategy that focuses on long-term prevention of pests or their damage through a combination of techniques such as biological control, habitat manipulation, modification of cultural practices, and use of resistant varieties.\n\nPesticides are used only after monitoring indicates that they are needed according to established guidelines, and treatments are made with the goal of removing only the target organism. Shimanzu provides precise chemistry designed to target only harmful pests without interrupting natural beneficial predators.',
    img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    category: 'Pesticides',
    date: '08 Apr 2025',
    author: 'Shimanzu Agrosciences'
  },
  {
    id: 'blog-3',
    title: 'Best Practices for Healthy and High-Yield Crops',
    desc: 'The quality of agrochemical products directly impacts crop yield. Discover best practices for maintaining optimal plant health.',
    content: 'Optimal crop nutrition, timely scouting, balanced water management, and preventative fungicidal and insecticidal treatments form the cornerstone of record-breaking agricultural yields.\n\nFarmers must pay close attention to critical vegetative and flowering stages. Utilizing adjuvant-assisted formulations ensures superior droplet spread and long-lasting canopy protection even during unexpected rain events.',
    img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    category: 'Agriculture',
    date: '02 Apr 2025',
    author: 'Shimanzu Agrosciences'
  },
  {
    id: 'blog-4',
    title: 'Sustainable Agriculture: Small Steps, Big Impact',
    desc: 'Learn about the latest innovations that balance crop productivity with environmental sustainability for future generations.',
    content: 'Sustainable farming seeks to sustain farmers, resources, and communities by promoting farming practices and methods that are profitable, environmentally sound, and good for communities.\n\nModern low-dose, high-efficiency Japanese formulations minimize residue in the soil while providing maximum protection against invasive fungal pathogens and aggressive weed competition.',
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    category: 'Sustainable Farming',
    date: '28 Mar 2025',
    author: 'Shimanzu Agrosciences'
  },
  {
    id: 'blog-5',
    title: 'Innovations in Japanese Crop Protection Technologies',
    desc: "Explore how Shimanzu's advanced Japanese formulations are setting new benchmarks in protecting crops from emerging fungal threats.",
    content: "Japanese agricultural chemistry is globally celebrated for meticulous molecular precision and environmental harmony. Through state-of-the-art suspension concentrates (SC) and water-dispersible granules (WG), Shimanzu sets new benchmarks.\n\nThese cutting-edge formulations offer superior rainfastness, broad-spectrum target activity, and extended residual control, ensuring farmers secure the greatest possible return on investment across every acre.",
    img: path.resolve(__dirname, 'src/assets/images/slide_15.jpg'),
    category: 'Crop Protection',
    date: '20 Mar 2025',
    author: 'Shimanzu Agrosciences'
  },
  {
    id: 'blog-6',
    title: 'The Future of Farming: Leveraging Technology for Growth',
    desc: 'From precision farming to AI-driven crop monitoring, technology is reshaping the agricultural landscape. Find out what the future holds.',
    content: 'From autonomous tractor steering and drone spraying to satellite imagery tracking vegetative health indices (NDVI), technology continues to empower growers around the globe.\n\nPairing digital diagnostics with precision-targeted agrochemical formulations enables localized spot treatments, cutting costs dramatically while boosting aggregate farm productivity.',
    img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800',
    category: 'Farming Tech',
    date: '15 Mar 2025',
    author: 'Shimanzu Agrosciences'
  }
];

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  console.log('Connected!');

  console.log('\n--- 1. SEEDING GALLERY ---');
  const galCol = db.collection('gallery');
  for (const item of GALLERY_ITEMS) {
    let finalSrc = item.src;
    if (finalSrc && !finalSrc.includes('res.cloudinary.com')) {
      finalSrc = await uploadToCloudinary(finalSrc, 'shimanzu_gallery', `gal_${item.id}`);
    }
    await galCol.updateOne(
      { $or: [{ id: item.id }, { _id: item.id }] },
      {
        $set: {
          ...item,
          _id: item.id,
          src: finalSrc,
          created_at: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    console.log(`Saved gallery photo: ${item.title}`);
  }

  console.log('\n--- 2. SEEDING BLOGS ---');
  const blogCol = db.collection('blogs');
  for (const blog of BLOGS) {
    let finalImg = blog.img;
    if (finalImg && !finalImg.includes('res.cloudinary.com')) {
      finalImg = await uploadToCloudinary(finalImg, 'shimanzu_blogs', `blog_${blog.id}`);
    }
    await blogCol.updateOne(
      { $or: [{ id: blog.id }, { _id: blog.id }] },
      {
        $set: {
          ...blog,
          _id: blog.id,
          img: finalImg,
          created_at: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    console.log(`Saved blog post: ${blog.title}`);
  }

  console.log('\n✓ Seeding finished successfully!');
  await client.close();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
