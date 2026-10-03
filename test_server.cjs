const { spawn } = require('child_process');

const nodePath = process.execPath || 'C:\\Program Files\\nodejs\\node.exe';
console.log("Starting server process for test with", nodePath);
const srv = spawn(nodePath, ['server/index.js'], { cwd: __dirname, stdio: 'pipe' });

srv.stdout.on('data', (d) => process.stdout.write(`[SERVER OUT] ${d}`));
srv.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d}`));

setTimeout(async () => {
  try {
    console.log("Testing GET http://127.0.0.1:5000/api/health ...");
    const healthRes = await fetch('http://127.0.0.1:5000/api/health');
    const health = await healthRes.json();
    console.log("Health response:", health);

    console.log("Testing GET http://127.0.0.1:5000/api/products ...");
    const prodRes = await fetch('http://127.0.0.1:5000/api/products');
    const prods = await prodRes.json();
    console.log(`Products count: ${prods.count}, sample product: ${prods.data?.[0]?.name}, image: ${prods.data?.[0]?.img_src}`);

    console.log("Testing GET http://127.0.0.1:5000/api/categories ...");
    const catRes = await fetch('http://127.0.0.1:5000/api/categories');
    const cats = await catRes.json();
    console.log(`Categories response count: ${cats.count}, sample name: ${cats.data?.[0]?.name}`);

    console.log("TEST SUCCESSFUL!");
  } catch (err) {
    console.error("Test failed:", err.message);
  } finally {
    srv.kill();
    process.exit(0);
  }
}, 3500);
