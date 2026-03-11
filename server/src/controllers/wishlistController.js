const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const wishlistInclude = {
  product: { include: { category: { select: { name: true, slug: true } } } },
};

exports.getWishlist = async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user.id },
    include: wishlistInclude,
  });
  res.json(items);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: {},
    create: { userId: req.user.id, productId },
    include: wishlistInclude,
  });
  res.status(201).json(item);
};

exports.removeFromWishlist = async (req, res) => {
  await prisma.wishlistItem.delete({
    where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
  });
  res.json({ message: 'Removed from wishlist' });
};
