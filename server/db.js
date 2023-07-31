const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./Models/ProductModel');
const products = require('./data/ProductData');
const Category = require('./Models/CategoryModel');

const MONGODB_URI = process.env.MONGODB_URI;

async function addCategory(categoryName, categoryDescription) {
    try {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ name: categoryName });
        if (existingCategory) {
            console.log(`Category ${categoryName} already exists`);
            return;
        }

        // Create a new category
        const category = new Category({
            name: categoryName,
            description: categoryDescription
        });

        // Save the category to the database
        await category.save();
        console.log(`Category ${categoryName} added successfully`);
    } catch (err) {
        console.error(`Failed to add category ${categoryName}:`, err);
    }
}

async function validateCategory(categoryName) {
    console.log(`Validating category: ${categoryName}`);
    const category = await Category.findOne({ name: categoryName });
    console.log(`Found category: ${category}`);
    if (!category) {
        throw new Error('Category not found');
    }
    return category._id;
}

async function addProducts() {
    for (const product of products) {
        const { name, image, description, price, rating, color, size, images, category } = product;

        try {
            // Validate categoryId
            const categoryId = await validateCategory(category);

            // Check if the product already exists
            const existingProduct = await Product.findOne({ name });
            if (existingProduct) {
                console.log(`Product ${name} already exists`);
                continue;
            }

            // Create the new product
            const createdProduct = await Product.create({
                name,
                image,
                description,
                price,
                rating,
                color,
                size,
                images,
                category: categoryId,
            });
            console.log(`Product ${name} created with ID: ${createdProduct._id}`);
            console.log(`Product ${name} created!`);
        } catch (err) {
            console.error(`Failed to add product ${name}:`, err);
        }
    }
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the Database successfully');

    // Add the categories and products after successfully connecting to the database
    addCategory('Houses', 'Description for Houses').then(() => {
        addCategory('Lands', 'Description for Lands').then(() => {
            addProducts().then(() => {
                console.log('All products added!');
                // Retrieve and log the products from the database
                Product.find({}, function (err, products) {
                    if (err) {
                        console.error('Failed to retrieve products:', err);
                    } else {
                        console.log('Retrieved products:', products);
                    }
                    process.exit();
                });
            }).catch(err => {
                console.error('Failed to add products:', err);
                process.exit(1);
            });
        }).catch(err => {
            console.error('Failed to add category:', err);
            process.exit(1);
        });
    }).catch(err => {
        console.error('Failed to add category:', err);
        process.exit(1);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
});
