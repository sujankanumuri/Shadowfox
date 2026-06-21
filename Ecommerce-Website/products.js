const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require('uuid');

const router = express.Router();
const file = path.join(__dirname, "../data/products.json");

router.get("/", (req, res) => {
  try {
    console.log('[products route] reading file:', file, 'exists:', fs.existsSync(file));
    let raw = fs.readFileSync(file, 'utf8');
    // inspect leading character codes for debugging
    const head = raw.slice(0, 8);
    console.log('[products route] head chars:', head.split('').map(c => c.charCodeAt(0)));
    // strip UTF-8 BOM if present
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    console.log('[products route] file length:', raw.length);
    const products = JSON.parse(raw);
    res.json(products);
  } catch (err) {
    console.error('[products route] error reading products:', err);
    res.json([]);
  }
});

// allow adding new products (admin)
router.post('/', (req, res) => {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const products = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
    const { name, price, description = '', category = 'General', image = '' } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Name and price required' });
    const id = products.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
    const prod = { id, name, price: Number(price), description, category, image };
    products.push(prod);
    fs.writeFileSync(file, JSON.stringify(products, null, 2));
    res.status(201).json(prod);
  } catch (err) {
    console.error('[products route] POST error', err);
    res.status(500).json({ message: 'Could not add product' });
  }
});

module.exports = router;
