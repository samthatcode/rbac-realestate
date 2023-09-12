const Investment = require('../Models/InvestmentModel');
const { dir } = require('../server');
const path = require('path');



// Create a new investment or investment opportunity
module.exports.createInvestment = async (req, res, next) => {
    try {
        const {
            title,
            description,
            investmentAmount,
            location,
            terms,
        } = req.body;

        let images = req.files; // Get the uploaded images from req.files

        // Get the path of each image file
        let imagePaths = images.map(file => {
            let relativePath = path.relative(dir, file.path);
            return relativePath.replace(/\\/g, '/');
        });

        let investment;

        // Create the investment with all the provided fields
        investment = await Investment.create({
            title,
            description,
            investmentAmount,
            location,
            terms,
            images: imagePaths,
        });

        res.status(201).json({
            message: 'Investment created successfully',
            success: true,
            data: investment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Get all investments
module.exports.getInvestments = async (req, res, next) => {
    try {
        const investments = await Investment.find();

        res.status(200).json({
            data: investments,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get a single investment by ID
module.exports.getInvestmentById = async (req, res, next) => {
    try {
        const investmentId = req.params.investmentId;
        const investment = await Investment.findById(investmentId);

        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        res.status(200).json({
            data: investment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Update an investment
module.exports.updateInvestment = async (req, res, next) => {
    try {
        const investmentId = req.params.investmentId;

        let newImages = req.files; // Get the uploaded images from req.files

        // Get the path of each image file
        let newImagePaths = Array.isArray(newImages) ? newImages.map(file => path.relative(dir, file.path).replace(/\\/g, '/')) : [];

        const { title, description, terms, investmentAmount, location } = req.body;

        // Fetch the existing investment
        const investment = await Investment.findById(investmentId);

        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        // Get the current images of the investment
        let currentImages = investment.images;

        // Append the new images to the existing ones
        let updatedImages = currentImages.concat(newImagePaths);

        investment.images = updatedImages; // Update the paths of the uploaded images
        investment.markModified('images'); // Tell Mongoose that the images field has been updated

        // Update other fields
        investment.title = title;
        investment.description = description;
        investment.terms = terms;
        investment.investmentAmount = investmentAmount;
        investment.location = location;

        // Save the investment
        const updatedInvestment = await investment.save();

        res.status(200).json({
            message: 'Investment updated successfully',
            success: true,
            data: updatedInvestment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};


// Delete an investment
module.exports.deleteInvestment = async (req, res, next) => {
    try {
        const investmentId = req.params.investmentId;

        const deletedInvestment = await Investment.findByIdAndDelete(investmentId);

        if (!deletedInvestment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        res.status(200).json({
            message: 'Investment deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
