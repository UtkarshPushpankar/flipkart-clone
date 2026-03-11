const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(category && { category: { slug: category } }),
  };

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' }
    : sort === 'price_desc' ? { price: 'desc' }
    : sort === 'rating' ? { rating: 'desc' }
    : { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy, skip, take: parseInt(limit),
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
};

exports.getProductById = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  res.json(categories);
};

exports.getFeatured = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: { select: { name: true, slug: true } } },
    take: 8,
  });
  res.json(products);
};
