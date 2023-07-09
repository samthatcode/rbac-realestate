const Investment = require('../Models/InvestmentModel');

// Create a new investment or investment opportunity
exports.createInvestment = async (req, res, next) => {
    try {
        const { propertyId, investmentAmount, title, description, property, terms } = req.body;

        let investment;

        if (propertyId && investmentAmount) {
            investment = await Investment.create({ property: propertyId, investmentAmount });
        } else {
            investment = await Investment.create({ title, description, property, terms });
        }

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
exports.getInvestments = async (req, res, next) => {
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
exports.getInvestmentById = async (req, res, next) => {
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
exports.updateInvestment = async (req, res, next) => {
    try {
        const investmentId = req.params.investmentId;
        const { title, description, property, terms, propertyId, investmentAmount } = req.body;

        const updatedInvestment = await Investment.findByIdAndUpdate(
            investmentId,
            {
                title,
                description,
                property,
                terms,
                property: propertyId,
                investmentAmount,
            },
            { new: true } // Return the updated investment
        );

        if (!updatedInvestment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        res.status(200).json({
            message: 'Investment updated successfully',
            success: true,
            data: updatedInvestment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Delete an investment
exports.deleteInvestment = async (req, res, next) => {
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
