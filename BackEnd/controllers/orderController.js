const Product = require('../models/product');
const Tourist = require('../models/tourist');
const Order = require('../models/order');

const createOrder = async (req, res) => {
  try {
    const { buyerId, products } = req.body;

    // Validate required fields
    if (!buyerId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Buyer ID and products are required' });
    }

    // Fetch buyer details
    const buyer = await Tourist.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Calculate total price and validate product quantities
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }

      // Ensure enough quantity is available
      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product: ${product.name}` });
      }

      totalPrice += product.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      buyer: buyerId,
      products,
      totalPrice,
      paymentStatus: 'notPaid', // Default status
      orderStatus: 'confirmed', // Default status
    });

    // Save the order
    const savedOrder = await order.save();

    // Will not Deduct stock for ordered products till payment

    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = { createOrder };
