import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dns from 'node:dns';

// Only set custom DNS on local machines, never in production/Vercel serverless
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env if not loaded
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://agtechsolutionofficial_db_user:hHBfw95dNjKekEmw@cluster0.5fcavy3.mongodb.net/shimanzu?appName=Cluster0';
const DB_NAME = process.env.MONGODB_DB_NAME || 'shimanzu';
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'p8vpwwcg';
const API_KEY = process.env.CLOUDINARY_API_KEY || '377931843173741';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'KbuoEAP4ho7yGOfPQS00AUWGdjk';

const app = express();

// Increase limit for base64 product images
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let mongoClient = null;
let db = null;

async function getDb() {
  if (db) return db;
  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
      });
      await mongoClient.connect();
      console.log('✓ Successfully connected to MongoDB Atlas (' + DB_NAME + ')');
    }
    db = mongoClient.db(DB_NAME);
    // Background ensure collections
    ensureCropsCollection(db).catch(e => console.warn('Auto-seed crops warning:', e.message));
    ensureQueriesCollection(db).catch(e => console.warn('Auto-seed queries warning:', e.message));
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

const router = express.Router();

// -------------------------------------------------------------
// Cloudinary Upload Helper & Endpoint
// -------------------------------------------------------------
async function uploadToCloudinary(imageInput, folder = 'shimanzu_products', publicId = null) {
  if (!imageInput) return '';
  if (typeof imageInput === 'string' && imageInput.includes('res.cloudinary.com')) return imageInput;

  try {
    const timestamp = Math.round(Date.now() / 1000);
    let payload = imageInput;

    // Check if imageInput is a local relative or absolute file path
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
      console.log(`✓ Cloudinary upload (${folder}): ${uploadData.secure_url}`);
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

router.post('/upload', async (req, res) => {
  try {
    const { image, folder = 'shimanzu_products', publicId = null } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    const secureUrl = await uploadToCloudinary(image, folder, publicId);
    return res.json({ success: true, url: secureUrl });
  } catch (err) {
    console.error('Upload endpoint error:', err);
    return res.json({ success: true, url: req.body.image, error: err.message });
  }
});

// -------------------------------------------------------------
// Products Endpoints
// -------------------------------------------------------------

// GET all products
router.get('/products', async (req, res) => {
  try {
    const database = await getDb();
    const products = await database.collection('products').find({}).toArray();
    products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product
router.get('/products/:id', async (req, res) => {
  try {
    const database = await getDb();
    const product = await database.collection('products').findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }]
    });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new product
router.post('/products', async (req, res) => {
  try {
    const database = await getDb();
    const prod = req.body;
    const id = prod.id || 'prod-' + Date.now();
    const newProduct = {
      ...prod,
      id,
      _id: id,
      created_at: prod.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await database.collection('products').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: newProduct },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update product
router.put('/products/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    const updateFields = { ...req.body, updated_at: new Date().toISOString() };
    delete updateFields._id; // prevent immutable _id update error

    await database.collection('products').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: updateFields }
    );
    const updated = await database.collection('products').findOne({
      $or: [{ id: id }, { _id: id }]
    });

    res.json({ success: true, data: updated || updateFields });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    await database.collection('products').deleteOne({
      $or: [{ id: id }, { _id: id }]
    });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Categories Endpoints
// -------------------------------------------------------------

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const database = await getDb();
    const categories = await database.collection('categories').find({}).sort({ name: 1 }).toArray();
    res.json({ success: true, data: categories, count: categories.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add category
router.post('/categories', async (req, res) => {
  try {
    const database = await getDb();
    const cat = req.body;
    const id = cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      ...cat,
      id,
      _id: id,
      created_at: cat.created_at || new Date().toISOString()
    };

    await database.collection('categories').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: newCategory },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update category
router.put('/categories/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    const updateFields = { ...req.body, updated_at: new Date().toISOString() };
    delete updateFields._id;

    await database.collection('categories').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: updateFields }
    );
    const updated = await database.collection('categories').findOne({
      $or: [{ id: id }, { _id: id }]
    });

    res.json({ success: true, data: updated || updateFields });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE category
router.delete('/categories/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    await database.collection('categories').deleteOne({
      $or: [{ id: id }, { _id: id }]
    });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Crops Endpoints (MongoDB Atlas & Cloudinary)
// -------------------------------------------------------------

const INITIAL_CROPS_DATA = [
  {
    id: 'alfalfa',
    name: 'Alfalfa',
    cropKey: 'Alfalfa',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=600&q=80',
    description: 'Protect high-protein alfalfa yields and stand persistence from damaging weevils, leafhoppers, and aggressive weed competition.'
  },
  {
    id: 'citrus',
    name: 'Citrus',
    cropKey: 'Citrus',
    image: '../src/assets/images/categories/insecticides.jpg',
    description: 'Ensure clean fruit skin and vigorous tree health against citrus canker, mites, psyllids, and thrips with targeted chemistry.'
  },
  {
    id: 'corn-field',
    name: 'Corn - Field Corn',
    cropKey: 'Maize',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    description: 'Safeguard your field corn from seedling rot, early weeds, and destructive stem borers to maximize bushel weight.'
  },
  {
    id: 'corn-seed',
    name: 'Corn - Seed Corn',
    cropKey: 'Maize',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80',
    description: 'High-value seed corn production demands elite protection against foliar diseases, soil pests, and late-season weeds.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    cropKey: 'Cotton',
    image: '../src/assets/images/categories/harvest-aids.jpg',
    description: 'From seedling vigor and bollworm control to synchronous boll opening and clean defoliation for superior lint grades.'
  },
  {
    id: 'cucurbits',
    name: 'Cucurbits',
    cropKey: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    description: 'Defend melon, squash, and cucumber vines against powdery mildew, downy mildew, aphids, and gummy stem blight.'
  },
  {
    id: 'grapes',
    name: 'Grapes',
    cropKey: 'Grapes',
    image: '../src/assets/images/categories/fungicides.jpg',
    description: 'Guard your grape yields with first-rate disease, pest and weed control solutions. Whether for table grapes, raisin or wine, our product portfolio delivers full protection and peace of mind.'
  },
  {
    id: 'peanuts',
    name: 'Peanuts',
    cropKey: 'Groundnut',
    image: 'https://images.unsplash.com/photo-1567892329774-672522718910?auto=format&fit=crop&w=600&q=80',
    description: 'Protect subterranean pod development and lush vine foliage against early and late leaf spot, white mold, and thrips.'
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    cropKey: 'Potato',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Achieve disease-free tubers and uniform tuber sizing with industry-standard blight control, seed piece protection, and vine desiccants.'
  },
  {
    id: 'pulse-crops',
    name: 'Pulse Crops',
    cropKey: 'Pulses',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    description: 'Unlock maximum biological nitrogen fixation and protect chickpea, lentil, and pigeon pea blooms from pod borers and wilt.'
  },
  {
    id: 'rice',
    name: 'Rice',
    cropKey: 'Paddy',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    description: 'Proven solutions for transplanted and direct-seeded rice: comprehensive weed eradication, stem borer defense, and blast suppression.'
  },
  {
    id: 'small-fruits',
    name: 'Small Fruits',
    cropKey: 'Fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    description: 'Premium berry and small fruit protection ensuring spotless appearance, extended shelf life, and resistance against botrytis rot.'
  },
  {
    id: 'small-grains',
    name: 'Small Grains',
    cropKey: 'Wheat',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    description: 'Strengthen wheat and barley stands against rusts, powdery mildew, seed rots, and yield-robbing early grassy weeds.'
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    cropKey: 'Sorghum',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    description: 'Maximize drought resilience and grain head fill with targeted stem borer control and pre-emergence weed management.'
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    cropKey: 'Soybean',
    image: '../src/assets/images/categories/herbicides.jpg',
    description: 'Clean canopy start with inoculants and residual weed control, transitioning into late-season pod feeder protection.'
  },
  {
    id: 'sunflowers',
    name: 'Sunflowers',
    cropKey: 'Sunflower',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
    description: 'Safeguard vibrant sunflower heads from moth larvae, head rot, and early nutrient deficiencies for higher oil yields.'
  },
  {
    id: 'sweet-corn',
    name: 'Sweet Corn',
    cropKey: 'Maize',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    description: 'Produce tender, worm-free, market-ready sweet corn ears with ultra-pure insecticides and timely disease prevention.'
  },
  {
    id: 'tobacco',
    name: 'Tobacco',
    cropKey: 'Tobacco',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    description: 'Maintain uniform leaf quality and sucker suppression for superior curing and commercial grade standards.'
  },
  {
    id: 'tree-fruit',
    name: 'Tree Fruit',
    cropKey: 'Apple',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'Protect apple, mango, and stone fruit orchards against scab, codling moth, anthracnose, and fruit rot.'
  },
  {
    id: 'tree-nuts',
    name: 'Tree Nuts',
    cropKey: 'Nuts',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    description: 'Complete season-long protection from early bloom sprays through hull split to protect high-value nut meat quality.'
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    cropKey: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Comprehensive pest, bacterial, and fungal defense for tomato, chilli, okra, onion, and brassicas with minimal pre-harvest intervals.'
  }
];

let isCropsSeeded = false;
async function ensureCropsCollection(database) {
  if (isCropsSeeded) return;
  try {
    const collection = database.collection('crops');
    const count = await collection.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding crops directory into MongoDB Atlas & Cloudinary...');
      for (const item of INITIAL_CROPS_DATA) {
        let finalImage = item.image;
        try {
          finalImage = await uploadToCloudinary(item.image, 'shimanzu_crops', `crop_${item.id}`);
        } catch (e) {
          console.warn(`Could not upload ${item.id} to Cloudinary:`, e.message);
        }
        await collection.updateOne(
          { $or: [{ id: item.id }, { _id: item.id }] },
          {
            $set: {
              ...item,
              image: finalImage,
              _id: item.id,
              created_at: new Date().toISOString()
            }
          },
          { upsert: true }
        );
      }
      console.log(`✓ Successfully seeded ${INITIAL_CROPS_DATA.length} crops into MongoDB Atlas!`);
    }
    isCropsSeeded = true;
  } catch (err) {
    console.warn('ensureCropsCollection error:', err.message);
  }
}

// GET all crops
router.get('/crops', async (req, res) => {
  try {
    const database = await getDb();
    await ensureCropsCollection(database);
    const crops = await database.collection('crops').find({}).sort({ name: 1 }).toArray();
    res.json({ success: true, data: crops, count: crops.length });
  } catch (err) {
    console.error('Error fetching crops:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single crop
router.get('/crops/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    const crop = await database.collection('crops').findOne({
      $or: [{ id: id }, { _id: id }]
    });
    if (!crop) {
      return res.status(404).json({ success: false, error: 'Crop not found' });
    }
    res.json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new crop
router.post('/crops', async (req, res) => {
  try {
    const database = await getDb();
    const crop = req.body;
    const id = crop.id || (crop.name || 'crop').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let finalImg = (crop.image || '').trim();

    if (finalImg && (finalImg.startsWith('data:') || finalImg.startsWith('blob:'))) {
      finalImg = await uploadToCloudinary(finalImg, 'shimanzu_crops', `crop_${id}_${Date.now()}`);
    }

    const newCrop = {
      ...crop,
      id,
      _id: id,
      cropKey: crop.cropKey || crop.name,
      image: finalImg,
      description: crop.description || '',
      created_at: crop.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await database.collection('crops').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: newCrop },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: newCrop });
  } catch (err) {
    console.error('Error adding crop:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update crop
router.put('/crops/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    const updateFields = { ...req.body, updated_at: new Date().toISOString() };
    delete updateFields._id;

    if (updateFields.image && (updateFields.image.startsWith('data:') || updateFields.image.startsWith('blob:'))) {
      updateFields.image = await uploadToCloudinary(updateFields.image, 'shimanzu_crops', `crop_${id}_${Date.now()}`);
    }

    await database.collection('crops').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: updateFields }
    );
    const updated = await database.collection('crops').findOne({
      $or: [{ id: id }, { _id: id }]
    });

    res.json({ success: true, data: updated || updateFields });
  } catch (err) {
    console.error('Error updating crop:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE crop
router.delete('/crops/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    await database.collection('crops').deleteOne({
      $or: [{ id: id }, { _id: id }]
    });
    res.json({ success: true, message: 'Crop deleted' });
  } catch (err) {
    console.error('Error deleting crop:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Queries / Inquiries Endpoints (MongoDB Atlas)
// -------------------------------------------------------------

const INITIAL_QUERIES_DATA = [
  {
    id: 'query-101',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@gmail.com',
    phone: '+91 98251 44820',
    location: 'Surat, Gujarat',
    productInterest: 'TEBCIN (Fungicide)',
    subject: 'Bulk order requirement for Paddy Season',
    message: 'We require 200 Litres of TEBCIN for our co-operative paddy fields in Olpad block to control Sheath Blight. Please share dealer quotation and delivery timeline.',
    date: '2026-09-28T14:30:00Z',
    status: 'new'
  },
  {
    id: 'query-102',
    name: 'Vikram Singh (Agro Chem Dist.)',
    email: 'vikram.singh@agrochemindia.com',
    phone: '+91 94140 88219',
    location: 'Indore, Madhya Pradesh',
    productInterest: 'Ghiroilkona R-999 (PW)',
    subject: 'Distributorship & 25kg Bag pricing for Coatings',
    message: 'We are chemical stockists in Indore dealing in industrial paints and masterbatch formulations. We would like to place an initial order for 10 metric tons of Ghiroilkona R-999 Rutile Grade pigment.',
    date: '2026-09-27T10:15:00Z',
    status: 'contacted'
  },
  {
    id: 'query-103',
    name: 'Dr. Suresh Deshmukh',
    email: 'suresh.horticulture@yahoo.com',
    phone: '+91 98220 31405',
    location: 'Nashik, Maharashtra',
    productInterest: 'MANGO BAR (PGR)',
    subject: 'Dosage clarification for 8-year-old Alphonso trees',
    message: 'Can you please provide the technical bulletin and soil drenching schedule for MANGO BAR (Paclobutrazol 23% SC) for October collar drenching?',
    date: '2026-09-26T16:45:00Z',
    status: 'resolved'
  },
  {
    id: 'query-104',
    name: 'Harpreet Singh Mann',
    email: 'mann.farms@outlook.com',
    phone: '+91 98142 55901',
    location: 'Ludhiana, Punjab',
    productInterest: 'SHIM PYROX (Herbicide)',
    subject: 'Wheat Phalaris minor pre-emergence application',
    message: 'Need advice on tank mixing SHIM PYROX (Pyroxasulfone 85% WG) with other selective herbicides for zero-till wheat sowing.',
    date: '2026-09-25T09:20:00Z',
    status: 'new'
  }
];

let isQueriesSeeded = false;
async function ensureQueriesCollection(database) {
  if (isQueriesSeeded) return;
  try {
    const collection = database.collection('queries');
    const count = await collection.countDocuments();
    if (count === 0) {
      console.log('📩 Seeding customer queries into MongoDB Atlas...');
      for (const q of INITIAL_QUERIES_DATA) {
        await collection.updateOne(
          { $or: [{ id: q.id }, { _id: q.id }] },
          { $set: { ...q, _id: q.id, created_at: q.date } },
          { upsert: true }
        );
      }
      console.log('✓ Seeded initial inquiries into MongoDB Atlas!');
    }
    isQueriesSeeded = true;
  } catch (err) {
    console.warn('ensureQueriesCollection error:', err.message);
  }
}

// GET all customer queries
router.get('/queries', async (req, res) => {
  try {
    const database = await getDb();
    await ensureQueriesCollection(database);
    const queries = await database.collection('queries').find({}).sort({ date: -1, created_at: -1 }).toArray();
    res.json({ success: true, data: queries, count: queries.length });
  } catch (err) {
    console.error('Error fetching queries:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new customer query
router.post('/queries', async (req, res) => {
  try {
    const database = await getDb();
    const q = req.body;
    const id = q.id || 'query-' + Date.now();
    const newQuery = {
      id,
      _id: id,
      name: (q.name || 'Anonymous User').trim(),
      email: (q.email || '').trim(),
      phone: (q.phone || 'Not specified').trim(),
      location: (q.location || 'Website Lead').trim(),
      productInterest: (q.productInterest || 'General Inquiry').trim(),
      subject: (q.subject || 'Contact Inquiry').trim(),
      message: (q.message || '').trim(),
      date: q.date || new Date().toISOString(),
      status: (q.status || 'new').toLowerCase().trim(),
      created_at: new Date().toISOString()
    };

    await database.collection('queries').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: newQuery },
      { upsert: true }
    );
    console.log(`✓ New customer lead saved in MongoDB: ${newQuery.name} (${newQuery.email})`);
    res.status(201).json({ success: true, data: newQuery });
  } catch (err) {
    console.error('Error saving query:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update customer query (e.g. status)
router.put('/queries/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    const updateFields = { ...req.body, updated_at: new Date().toISOString() };
    delete updateFields._id;

    await database.collection('queries').updateOne(
      { $or: [{ id: id }, { _id: id }] },
      { $set: updateFields }
    );
    const updated = await database.collection('queries').findOne({
      $or: [{ id: id }, { _id: id }]
    });

    res.json({ success: true, data: updated || updateFields });
  } catch (err) {
    console.error('Error updating query:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE customer query
router.delete('/queries/:id', async (req, res) => {
  try {
    const database = await getDb();
    const id = req.params.id;
    await database.collection('queries').deleteOne({
      $or: [{ id: id }, { _id: id }]
    });
    res.json({ success: true, message: 'Query deleted' });
  } catch (err) {
    console.error('Error deleting query:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Shimanzu API', database: 'MongoDB Atlas' });
});

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Shimanzu API' });
});

// Mount router on both '/api' and '/'
app.use('/api', router);
app.use('/', router);

export default app;

// Start standalone server if executed directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  app.listen(PORT, () => {
    console.log(`🚀 Shimanzu Backend API Server listening on port ${PORT}`);
  });
}
