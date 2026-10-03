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
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

const router = express.Router();

// -------------------------------------------------------------
// Cloudinary Upload Endpoint
// -------------------------------------------------------------
router.post('/upload', async (req, res) => {
  try {
    const { image, folder = 'shimanzu_products' } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // If it's already an external HTTP URL, return as is
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
      return res.json({ success: true, url: image });
    }

    // Upload to Cloudinary using signed REST API
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', image);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    formData.append('signature', signature);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const uploadRes = await fetch(cloudUrl, {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (uploadRes.ok && uploadData.secure_url) {
      console.log('✓ Uploaded image to Cloudinary:', uploadData.secure_url);
      return res.json({
        success: true,
        url: uploadData.secure_url,
        public_id: uploadData.public_id
      });
    } else {
      console.warn('Cloudinary upload warning:', uploadData);
      return res.json({
        success: true,
        url: image,
        warning: uploadData.error?.message || 'Cloudinary upload unverified'
      });
    }
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
