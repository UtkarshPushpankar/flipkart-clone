const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page = 1,
    limit = 12,
  } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const brands = typeof brand === 'string' && brand.trim()
    ? brand.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  const where = {
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(category && { category: { slug: category } }),
    ...(brands.length ? { brand: { in: brands } } : {}),
    ...((minPrice || maxPrice) ? {
      price: {
        ...(minPrice ? { gte: parseInt(minPrice) } : {}),
        ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
      },
    } : {}),
    ...(minRating ? { rating: { gte: parseFloat(minRating) } } : {}),
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

exports.getProductFacets = async (req, res) => {
  const { search, category } = req.query;

  const where = {
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(category && { category: { slug: category } }),
  };

  const products = await prisma.product.findMany({
    where,
    select: { brand: true, price: true },
  });

  const brandsMap = new Map();
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  products.forEach((product) => {
    brandsMap.set(product.brand, (brandsMap.get(product.brand) || 0) + 1);
    if (product.price < min) min = product.price;
    if (product.price > max) max = product.price;
  });

  const brands = Array.from(brandsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

  res.json({
    brands,
    priceRange: {
      min: products.length ? min : 0,
      max: products.length ? max : 0,
    },
  });
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
