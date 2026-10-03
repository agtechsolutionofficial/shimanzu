const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const apiKey = '377931843173741';
const apiSecret = 'KbuoEAP4ho7yGOfPQS00AUWGdjk';
const cloudName = 'p8vpwwcg';

const auth = Buffer.from(apiKey + ':' + apiSecret).toString('base64');

async function testCloudinary() {
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/ping`, {
      headers: { Authorization: 'Basic ' + auth }
    });
    const data = await res.json();
    console.log('Cloudinary ping status:', res.status, data);
    if (res.status === 200) {
      console.log('✓ CLOUDINARY AUTHENTICATION SUCCESSFUL FOR CLOUD:', cloudName);
    }
  } catch (err) {
    console.error('Ping error:', err.message);
  }
}

testCloudinary();
