// const mongoose = require('mongoose');
const Product = require('../Models/ProductModel');
const Category = require('../Models/CategoryModel');
const { dir } = require('../server');
const path = require('path');

// Abstract category validation into a separate function
const validateCategory = async (categoryId) => {
    // console.log('Validating category with ID:', categoryId);
    try {
        const category = await Category.findById(categoryId);
        // console.log('Found category:', category);
        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }
        return categoryId;
    } catch (error) {
        console.error('Error validating category:', error);
        throw error;
    }
};

// Create a new product
module.exports.createProduct = async (req, res, next) => {
    // console.log(req.files);
    try {
        const { title,
            description,
            price,
            location,
            numberOfRooms,
            squareFootage,
            numberOfBeds,
            numberOfBaths,
            categoryId } = req.body;

        let images = req.files; // Get the uploaded images from req.files

        // Get the path of each image file
        let imagePaths = images.map(file => {
            let relativePath = path.relative(dir, file.path);
            return relativePath.replace(/\\/g, '/');
        });

        // console.log(imagePaths);
        let validatedCategoryId;

        if (Array.isArray(categoryId)) {
            validatedCategoryId = categoryId[0];
        } else {
            validatedCategoryId = categoryId;
        }

        if (typeof validatedCategoryId !== 'string') {
            throw new Error('categoryId must be a string, not a ' + typeof validatedCategoryId);
        }

        validatedCategoryId = await validateCategory(validatedCategoryId);

        const createdProduct = await Product.create({
            title,
            description,
            price,
            location,
            numberOfRooms,
            squareFootage,
            numberOfBeds,
            numberOfBaths,
            images: imagePaths, // Save the paths of the uploaded images
            categoryId: validatedCategoryId,
        });

        res.status(201).json({
            message: 'Product created successfully',
            success: true,
            data: createdProduct,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Get all products
module.exports.getProducts = async (req, res, next) => {
    try {
        const productIds = req.query.ids ? req.query.ids.split(',') : [];
        const products = productIds.length
            ? await Product.find({ '_id': { $in: productIds } })
            : await Product.find();

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
    // console.log(req.files)
    try {
        const productId = req.params.productId;
        let newImages = req.files; // Get the uploaded images from req.files

        // Get the path of each image file
        let newImagePaths = Array.isArray(newImages) ? newImages.map(file => path.relative(dir, file.path).replace(/\\/g, '/')) : [];


        const { title,
            description,
            price,
            location,
            numberOfRooms,
            squareFootage,
            numberOfBeds,
            numberOfBaths,
            categoryId } = req.body;

        // Check if categoryId exists
        if (!categoryId) {
            return res.status(400).json({ error: 'Category ID is required' });
        }

        // Validate categoryId
        const validatedCategoryId = await validateCategory(categoryId);

        // Fetch the existing product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get the current images of the product
        let currentImages = product.images;

        // Append the new images to the existing ones
        let updatedImages = currentImages.concat(newImagePaths);

        product.images = updatedImages; // Update the paths of the uploaded images
        product.markModified('images'); // Tell Mongoose that the images field has been updated

        // Update other fields
        product.title = title;
        product.description = description;
        product.price = price;
        product.location = location;
        product.numberOfRooms = numberOfRooms;
        product.squareFootage = squareFootage;
        product.numberOfBeds = numberOfBeds;
        product.numberOfBaths = numberOfBaths;
        product.categoryId = validatedCategoryId;

        // Save the product
        const updatedProduct = await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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