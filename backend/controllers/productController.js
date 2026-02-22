const Product = require('../models/Product');

const autoCategorize = (productData) => {
    const name = (productData.name || "").toLowerCase();
    const desc = (productData.description || "").toLowerCase();
    let newCategory = productData.category;
    let newSubcategories = Array.isArray(productData.subcategories) ? [...productData.subcategories] : [];

    // Master Category Mapping
    if (name.includes('cake') || name.includes('pastry') || name.includes('brownie')) {
        newCategory = 'Cake';
    } else if (name.includes('pizza') || name.includes('patty') || name.includes('patties') || name.includes('burger') || name.includes('sandwich') || name.includes('hot dog') || name.includes('fries') || name.includes('momos')) {
        newCategory = 'Fastfood';
    } else if (name.includes('coffee') || name.includes('tea') || name.includes('shake') || name.includes('mojito') || name.includes('drink')) {
        newCategory = 'Beverages';
    } else if (name.includes('flower') || name.includes('bouquet') || name.includes('rose')) {
        newCategory = 'Flowers';
    }

    // Subcategory Tagging
    if (name.includes('birthday') || desc.includes('birthday')) {
        if (!newSubcategories.includes('Birthday')) newSubcategories.push('Birthday');
    }
    if (name.includes('first birthday') || name.includes('1st birthday')) {
         if (!newSubcategories.includes('First Birthday')) newSubcategories.push('First Birthday');
    }
    if (name.includes('anniversary') || desc.includes('anniversary') || name.includes('wedding') || name.includes('couple')) {
        if (!newSubcategories.includes('Anniversary')) newSubcategories.push('Anniversary');
    }
    if (name.includes('photo')) {
        if (!newSubcategories.includes('Photo Cake')) newSubcategories.push('Photo Cake');
    }
    if (name.includes('pizza')) {
        if (!newSubcategories.includes('Pizza')) newSubcategories.push('Pizza');
    }
    if (name.includes('patty') || name.includes('patties')) {
        if (!newSubcategories.includes('Patties')) newSubcategories.push('Patties');
    }

    if (!newCategory || newCategory === 'All') {
        newCategory = 'Bakery';
    }

    productData.category = newCategory;
    productData.subcategories = newSubcategories;
    return productData;
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            const regexCategory = new RegExp(`^${category}$`, 'i');
            query = {
                $or: [
                    { category: regexCategory },
                    { subcategories: regexCategory }
                ]
            };
        }
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productData = autoCategorize(req.body);
        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productData = autoCategorize(req.body);
        const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

exports.toggleAvailability = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        product.isAvailable = !product.isAvailable;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling availability' });
    }
};

exports.deleteAllProducts = async (req, res) => {
    try {
        const result = await Product.deleteMany({});
        res.json({ message: `Deleted ${result.deletedCount} products` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all products' });
    }
};
