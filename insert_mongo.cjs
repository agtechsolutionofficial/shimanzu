const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://agtechsolutionofficial_db_user:hHBfw95dNjKekEmw@cluster0.5fcavy3.mongodb.net/shimanzu?appName=Cluster0";
const client = new MongoClient(uri);

const INITIAL_CATEGORIES = [
  {
    id: 'chemicals',
    name: 'CHEMICALS',
    shortName: 'Chemicals',
    accentColor: '#1E40AF',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    description: 'Explore our high-purity chemical technicals, titanium dioxide rutile pigments, and specialty industrial formulations.',
    fullDescription: 'High-purity chemical technicals, titanium dioxide rutile grade pigments, specialty industrial additives, and advanced chemical intermediates manufactured with Japanese precision.',
    productCount: 0
  },
  {
    id: 'fungicides',
    name: 'FUNGICIDES',
    shortName: 'Fungicides',
    accentColor: '#0D9488',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    description: 'Learn more about our best-in-class selection of fungicides, many with proprietary active ingredients.',
    fullDescription: 'Our fungicide portfolio provides broad-spectrum and systemic control against destructive plant pathogens, powdery mildew, blast, blights, and rusts, protecting plant vitality from root to leaf.',
    productCount: 0
  },
  {
    id: 'herbicides',
    name: 'HERBICIDES',
    shortName: 'Herbicides',
    accentColor: '#15803D',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80',
    description: 'Clean fields improve your yield potential. Formulated to help you control tough, resistant weeds across crops.',
    fullDescription: 'Clean fields improve your yield potential. Formulated to suppress invasive grass, sedges, and broadleaf weeds in paddy, cotton, soybean, maize, and pulses with superior crop safety.',
    productCount: 0
  },
  {
    id: 'insecticides',
    name: 'INSECTICIDES & MITICIDES',
    shortName: 'Insecticides & Miticides',
    accentColor: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    description: 'View our insecticide and miticide offerings featuring innovative chemistries for superior control.',
    fullDescription: 'Engineered with advanced chemistries that target chewing and sucking pests, borer complexes, aphids, thrips, and mites while preserving beneficial predatory insects.',
    productCount: 0
  },
  {
    id: 'at-plant',
    name: 'AT-PLANT',
    shortName: 'At-Plant Technologies',
    accentColor: '#EA580C',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80',
    description: 'View our leading At-Plant technologies designed to protect your input investments from the start.',
    fullDescription: 'Protect crops right from seedling emergence with root-zone bio-stimulants, seed dressers, and soil health restorers that unlock early vigor and robust disease resilience.',
    productCount: 0
  },
  {
    id: 'harvest-aids',
    name: 'HARVEST AIDS',
    shortName: 'Harvest Aids',
    accentColor: '#0F766E',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    description: 'See our tools developed to support an easier, more efficient harvest.',
    fullDescription: 'Uniform maturation defoliants, crop desiccants, and harvest conditioners designed to accelerate harvesting schedules, reduce moisture content, and maximize grade quality.',
    productCount: 0
  },
  {
    id: 'precision-platforms',
    name: 'PRECISION PLATFORMS',
    shortName: 'Precision Platforms',
    accentColor: '#1E3A8A',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    description: 'Read more about our proprietary technologies transforming crop protection application.',
    fullDescription: 'Next-generation bio-stimulants, nano-adjuvants, drone-compatible formulations, and foliar nutrition technologies designed to maximize chemical efficacy and minimize environmental footprint.',
    productCount: 0
  }
];

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✓ Connected successfully to MongoDB Atlas!");
    const db = client.db("shimanzu");

    // 1. Products Migration
    const productsColl = db.collection("products");
    const raw = fs.readFileSync("c:/Users/HP/Downloads/shimanzu/products_for_mongo.json", "utf8").replace(/^\uFEFF/, '');
    const products = JSON.parse(raw);
    console.log(`Read ${products.length} products from products_for_mongo.json`);

    const prodOps = products.map(p => ({
      updateOne: {
        filter: { id: p.id },
        update: { $set: p },
        upsert: true
      }
    }));
    await productsColl.bulkWrite(prodOps);
    const prodCount = await productsColl.countDocuments();
    console.log(`✓ Total products in MongoDB collection 'products': ${prodCount}`);

    // 2. Categories Migration
    const catColl = db.collection("categories");
    const catOps = INITIAL_CATEGORIES.map(c => ({
      updateOne: {
        filter: { id: c.id },
        update: { $set: { ...c, _id: c.id } },
        upsert: true
      }
    }));
    await catColl.bulkWrite(catOps);
    const catCount = await catColl.countDocuments();
    console.log(`✓ Total categories in MongoDB collection 'categories': ${catCount}`);

  } catch (err) {
    console.error("MongoDB Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
