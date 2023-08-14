const Order = require('../Models/OrderModel');
const Product = require('../Models/ProductModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_VERIFY,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN
    }
});

const sendAdminEmail = async (order) => {

    const adminEmail = process.env.ADMIN_EMAIL; // Replace with the actual admin email
    const adminMailOptions = {
        from: process.env.EMAIL_VERIFY,
        to: adminEmail,
        subject: "New Order Created",
        text: `A new order has been created. Order ID: ${order._id}`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
      
          <div style="background-color: #003366; padding: 20px 0; text-align: center; color: white;">
            <img src="path-to-your-logo.png" alt="Business Logo" style="width: 150px;">
          </div>
      
          <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 600px;">
            <h2 style="color: #003366;">Order Notification</h2>
            <p>Dear Admin,</p>
      
            <p>We would like to inform you that an order has been placed successfully:</p>
      
            <ul>
              <li><strong>Name:</strong> ${order.shippingAddress.name}</li>
              <li><strong>Email:</strong> ${order.shippingAddress.email}</li>
              <li><strong>Shipping Address:</strong> ${order.shippingAddress.street}</li>
              <li><strong>Date of Purchase:</strong> ${order.orderDate}</li>                  
              <li><strong>Order ID:</strong> ${order._id}</li>
              <li><strong>Phone Number:</strong> ${order.shippingAddress.phone}</li>
              <li><strong>Payment Reference:</strong> ${order.paymentReference}</li>
            </ul>
      
            <h3>Ordered Products:</h3>
            <ul>
            ${order.products.map((product) => `<li>${product.title} - ${product.quantity} x &#x20A6;${product.price}</li>`).join("")}
          </ul>
      
            <p><strong>Total Price:</strong> &#x20A6;${order.totalPrice}</p>
           
      
            <p>Thank you for your attention.</p>
      
            <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
      
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 12px;">&copy; 2023 SureFinders. All rights reserved.</p>
          </div>
      
        </body>
        </html>`

    };

    await transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Admin email sent successfully:', info.response);
        }
    });

};

const sendCustomerEmail = async (order) => {
    // Customer email logic
    const customerEmail = order.shippingAddress.email;
    const customerMailOptions = {
        from: process.env.EMAIL_VERIFY,
        to: customerEmail,
        subject: "Order Confirmation",
        text: `Thank you for your order. Your order ID is: ${order._id}`,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
          <!-- Same as before -->
          <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 600px;">
            <h2 style="color: #003366;">Order Confirmation</h2>
            <p>Dear ${order.shippingAddress.name},</p>

            <p>Thank you for placing an order with us. Below are your order details:</p>

            <!-- Order details similar to the admin email -->
            <h3>Order details</h3>
            <ul>
            <li><strong>Name:</strong> ${order.shippingAddress.name}</li>
            <li><strong>Email:</strong> ${order.shippingAddress.email}</li>
            <li><strong>Shipping Address:</strong> ${order.shippingAddress.street}</li>
            <li><strong>Date of Purchase:</strong> ${order.orderDate}</li>                  
            <li><strong>Order ID:</strong> ${order._id}</li>
            <li><strong>Phone Number:</strong> ${order.shippingAddress.phone}</li>
            <li><strong>Payment Reference:</strong> ${order.paymentReference}</li>
          </ul>
            
            <h3>Ordered Products:</h3>
            <ul>
            ${order.products.map((product) => `<li>${product.title} - ${product.quantity} x &#x20A6;${product.price}</li>`).join("")}
          </ul>

            <p><strong>Total Price:</strong> &#x20A6;${order.totalPrice}</p>

            <p>Your order will be processed and shipped to you soon.</p>

            <p>Thank you for shopping with us.</p>

            <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 12px;">&copy; 2023 SureFinders. All rights reserved.</p>
          </div>
        </body>
        </html>`
    };

    await transporter.sendMail(customerMailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending customer email:', error);
        } else {
            console.log('Customer email sent successfully:', info.response);
        }
    });
};


// Create a new order
module.exports.createOrder = async (req, res, next) => {
    try {
        const { userId, products, shippingAddress, totalPrice, paymentReference } = req.body;

        // Ensure all product IDs exist
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(400).json({ error: `Product not found for ID: ${products[i].productId}` });
            }
        }

        // Create the new order
        const order = await Order.create({
            userId,
            products,
            shippingAddress,
            totalPrice, // Add the calculated total price to the order
            paymentReference,
            status: 'pending', // Set default status
        });

        // Send emails
        await Promise.all([
            sendAdminEmail(order),
            sendCustomerEmail(order)
        ]);

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
        const { userId, products, status } = req.body;

        // Retrieve the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Prevent changes if the order is shipped, delivered or cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ error: 'Cannot update an order that has been shipped, delivered or cancelled' });
        }

        // Ensure all product IDs exist
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return res.status(400).json({ error: `Product not found for ID: ${products[i].productId}` });
            }
        }

        // Get the old status before updating
        const oldStatus = order.status;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                userId,
                products,
                status, // Update the status of the order
            },
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if the status has changed
        if (oldStatus !== updatedOrder.status) {
            const adminEmail = process.env.ADMIN_EMAIL;
            const mailOptions = {
                from: process.env.EMAIL_VERIFY,
                to: adminEmail,
                subject: 'Order Status Changed',
                text: `The status of order ${updatedOrder._id} has changed to ${updatedOrder.status}.`
            };

            // Send email and wait for it to complete using async/await
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred while sending email:', error);
                } else {
                    console.log('Email sent successfully:', info.response);
                }
            });
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
