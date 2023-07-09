const User = require('../Models/UserModel');

// Redirect first-time buyers
module.exports.redirectFirstTimeBuyer = async (req, res, next) => {
    try {
        // Check if the user is a first-time buyer
        const user = await User.findById(req.userId);

        if (user.firstTimeBuyer) {
            // Redirect to the registration page for first-time buyers
            return res.redirect('/register');
        } else {
            // Redirect to the login page for subsequent buyers
            return res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Buyer Dashboard
module.exports.getBuyerDashboard = async (req, res, next) => {
    try {
        // Retrieve the buyer's data, including purchases and investments
        const user = await User.findById(req.userId)
            .populate('purchases')
            .populate('investments');

        // Render the buyer dashboard view with the buyer's data
        res.render('buyerDashboard', { user });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Purchase a product
module.exports.purchaseProduct = async (req, res, next) => {
    try {
        const { productId } = req.body;

        // Add the purchase to the user's record
        await User.findByIdAndUpdate(req.userId, { $push: { purchases: productId } });

        // Perform additional logic for purchase, such as updating inventory, generating invoices, etc.

        res.status(200).json({
            message: 'Product purchased successfully',
            success: true,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// View purchase history
module.exports.viewPurchaseHistory = async (req, res, next) => {
    try {
        // Retrieve the buyer's purchase history
        const user = await User.findById(req.userId).populate('purchases');

        // Render the purchase history view with the user's purchases
        res.render('purchaseHistory', { purchases: user.purchases });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// View investment portfolio
module.exports.viewInvestmentPortfolio = async (req, res, next) => {
    try {
        // Retrieve the buyer's investment portfolio
        const user = await User.findById(req.userId).populate('investments');

        // Render the investment portfolio view with the user's investments
        res.render('investmentPortfolio', { investments: user.investments });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
