const Order = require('../Models/OrderModel');
const Product = require('../Models/ProductModel');

// Create a new order
module.exports.createOrder = async (req, res, next) => {
    try {
        const { userId, products } = req.body;

        // Calculate total price
        let totalPrice = 0;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(400).json({ error: `Product not found for ID: ${products[i].productId}` });
            }
            totalPrice += product.price * products[i].quantity;
        }

        // Create the new order
        const order = await Order.create({
            userId,
            products,
            totalPrice, // Add the calculated total price to the order
        });

        res.status(201).json({
            message: 'Order created successfully',
            success: true,
            data: order,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// Get all orders
module.exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();

        res.status(200).json({
            data: orders,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get a single order by ID
module.exports.getOrderById = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({
            data: order,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ error: 'Invalid order ID' });
        } else {
            next(error);
        }
    }
};


// Update an order
module.exports.updateOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const { userId, products } = req.body;

        // Retrieve the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Prevent changes if the order is shipped, delivered or cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ error: 'Cannot update an order that has been shipped, delivered or cancelled' });
        }

        // Calculate total price
        let totalPrice = 0;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(400).json({ error: `Product not found for ID: ${products[i].productId}` });
            }
            totalPrice += product.price * products[i].quantity;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                userId,
                products,
                totalPrice, // Update the total price of the order
            },
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order updated successfully',
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ error: 'Invalid order ID' });
        } else {
            next(error);
        }
    }
};

// Delete an order
module.exports.deleteOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order deleted successfully',
            success: true,
            data: null,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ error: 'Invalid order ID' });
        } else {
            next(error);
        }
    }
};
