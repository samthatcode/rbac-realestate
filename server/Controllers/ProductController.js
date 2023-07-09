const Product = require('../Models/ProductModel');
const Category = require('../Models/CategoryModel');

// Create a new product
module.exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, categoryId } = req.body;

        // Validate categoryId
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Category not found' });
        }

        // Create the new product
        const product = await Product.create({
            name,
            description,
            price,
            category: categoryId,
        });

        res.status(201).json({
            message: 'Product created successfully',
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get all products
module.exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            data: products,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get a single product by ID
module.exports.getProductById = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            data: product,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Update a product
module.exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const { name, description, price } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                price,
            },
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Delete a product
module.exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
