const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cartInclude = {
  product: { include: { category: { select: { name: true, slug: true } } } },
};

exports.getCart = async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: cartInclude,
  });
  res.json(items);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: req.user.id, productId, quantity },
    include: cartInclude,
  });
  res.status(201).json(item);
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
    data: { quantity },
    include: cartInclude,
  });
  res.json(item);
};

exports.removeFromCart = async (req, res) => {
  await prisma.cartItem.delete({
    where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
  });
  res.json({ message: 'Item removed from cart' });
};

exports.clearCart = async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ message: 'Cart cleared' });
};
