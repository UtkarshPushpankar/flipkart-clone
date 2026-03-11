const { PrismaClient } = require('@prisma/client');
const { sendOrderConfirmationEmail } = require('../services/emailService');
const prisma = new PrismaClient();

exports.placeOrder = async (req, res) => {
  const { addressId, paymentMethod = 'COD' } = req.body;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });
  if (cartItems.length === 0)
    return res.status(400).json({ message: 'Cart is empty' });

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: req.user.id },
  });
  if (!address) return res.status(404).json({ message: 'Address not found' });

  // Check stock
  for (const item of cartItems) {
    if (item.product.stock < item.quantity)
      return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: req.user.id,
        addressId,
        totalAmount,
        paymentMethod,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    // Update stock
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { userId: req.user.id } });

    return newOrder;
  });

  // Send confirmation email (bonus - fire and forget)
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  sendOrderConfirmationEmail(user.email, user.name, order).catch(console.error);

  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: {
      items: { include: { product: { select: { name: true, images: true, brand: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: {
      items: { include: { product: true } },
      address: true,
    },
  });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};
