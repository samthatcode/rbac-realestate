const Land = require('../Models/LandModel');
const Category = require('../Models/CategoryModel');
const { dir } = require('../server');
const path = require('path');

// Abstract category validation into a separate function
const validateCategory = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }
        return categoryId;
    } catch (error) {
        console.error('Error validating category:', error);
        throw error;
    }
};

// Create a new land
module.exports.createLand = async (req, res, next) => {
    try {
        const {
            title,
            description,
            price,
            location,
            acreage,
            categoryId
        } = req.body;

        let images = req.files; // Get the uploaded images from req.files

        // Get the path of each image file
        let imagePaths = images.map(file => {
            let relativePath = path.relative(dir, file.path);
            return relativePath.replace(/\\/g, '/');
        });

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

        const createdLand = await Land.create({
            title,
            description,
            price,
            location,
            acreage,
            images: imagePaths, // Save the paths of the uploaded images
            categoryId: validatedCategoryId,
        });

        res.status(201).json({
            message: 'Land created successfully',
            success: true,
            data: createdLand,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get all lands
module.exports.getLands = async (req, res, next) => {
    try {
      const landIds = req.query.ids ? req.query.ids.split(',') : [];
      const lands = landIds.length
        ? await Land.find({ '_id': { $in: landIds } })
        : await Land.find();
  
      res.status(200).json({
        data: lands,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

// Get a single land by ID
module.exports.getLandById = async (req, res, next) => {
    try {
        const landId = req.params.landId;
        const land = await Land.findById(landId);

        if (!land) {
            return res.status(404).json({ error: 'Land not found' });
        }

        res.status(200).json({
            data: land,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Update a land
module.exports.updateLand = async (req, res, next) => {
    try {
        const landId = req.params.landId;
        let newImages = req.files; // Get the uploaded images from req.files

        // Get the path of each image file
        let newImagePaths = Array.isArray(newImages) ? newImages.map(file => path.relative(dir, file.path).replace(/\\/g, '/')) : [];

        const {
            title,
            description,
            price,
            location,
            acreage,
            categoryId
        } = req.body;

        // Check if categoryId exists
        if (!categoryId) {
            return res.status(400).json({ error: 'Category ID is required' });
        }

        // Validate categoryId
        const validatedCategoryId = await validateCategory(categoryId);

        // Fetch the existing land
        const land = await Land.findById(landId);

        if (!land) {
            return res.status(404).json({ error: 'Land not found' });
        }

        // Get the current images of the land
        let currentImages = land.images;

        // Append the new images to the existing ones
        let updatedImages = currentImages.concat(newImagePaths);

        land.images = updatedImages; // Update the paths of the uploaded images
        land.markModified('images'); // Tell Mongoose that the images field has been updated

        // Update other fields
        land.title = title;
        land.description = description;
        land.price = price;
        land.location = location;
        land.acreage = acreage;
        land.categoryId = validatedCategoryId;

        // Save the land
        const updatedLand = await land.save();

        res.status(200).json({
            message: 'Land updated successfully',
            success: true,
            data: updatedLand,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};

// Delete a land
module.exports.deleteLand = async (req, res, next) => {
    try {
        const landId = req.params.landId;

        const deletedLand = await Land.findByIdAndDelete(landId);

        if (!deletedLand) {
            return res.status(404).json({ error: 'Land not found' });
        }

        res.status(200).json({
            message: 'Land deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
