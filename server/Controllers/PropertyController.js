const Property = require('../Models/PropertyModel');
const Category = require('../Models/CategoryModel');

// Create a new property
module.exports.createProperty = async (req, res, next) => {
    try {
        const { name, description, price, location, category } = req.body;

        // Validate category
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Category not found' });
        }

        // Create the new property
        const property = await Property.create({
            name,
            description,
            price,
            location,
            category,
        });

        res.status(201).json({
            message: 'Property created successfully',
            success: true,
            data: property,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get all properties
module.exports.getProperties = async (req, res, next) => {
    try {
        const properties = await Property.find();

        res.status(200).json({
            data: properties,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get a single property by ID
module.exports.getPropertyById = async (req, res, next) => {
    try {
        const propertyId = req.params.propertyId;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.status(200).json({
            data: property,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Update a property
module.exports.updateProperty = async (req, res, next) => {
    try {
        const propertyId = req.params.propertyId;
        
        const { name, description, price, location } = req.body;

        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            {
                name,
                description,
                price,
                location,
            },
            { new: true } // Return the updated property
        );

        if (!updatedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.status(200).json({
            message: 'Property updated successfully',
            success: true,
            data: updatedProperty,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Delete a property
module.exports.deleteProperty = async (req, res, next) => {
    try {
        const propertyId = req.params.propertyId;

        const deletedProperty = await Property.findByIdAndDelete(propertyId);

        if (!deletedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }

        res.status(200).json({
            message: 'Property deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
