const Purchase = require('../Models/PurchaseModel');

// Create a new purchase
module.exports.createPurchase = async (req, res, next) => {
    try {
        const { clientId, productId, quantity } = req.body;

        // Create the new purchase
        const purchase = await Purchase.create({
            client: clientId,
            product: productId,
            quantity
        });

        res.status(201).json({
            message: 'Purchase created successfully',
            success: true,
            data: purchase
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get purchase details by ID
module.exports.getPurchaseById = async (req, res, next) => {
    try {
        const purchaseId = req.params.purchaseId;
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        res.status(200).json({
            data: purchase
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Update a purchase
module.exports.updatePurchase = async (req, res, next) => {
    try {
        const purchaseId = req.params.purchaseId;
        const { quantity } = req.body;

        const updatedPurchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { quantity },
            { new: true } // Return the updated purchase
        );

        if (!updatedPurchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        res.status(200).json({
            message: 'Purchase updated successfully',
            success: true,
            data: updatedPurchase
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Delete a purchase
module.exports.deletePurchase = async (req, res, next) => {
    try {
        const purchaseId = req.params.purchaseId;

        const deletedPurchase = await Purchase.findByIdAndDelete(purchaseId);

        if (!deletedPurchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        res.status(200).json({
            message: 'Purchase deleted successfully',
            success: true,
            data: null
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
