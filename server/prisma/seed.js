const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Default User (for "no login required" mode) ───
  const hashedPassword = await bcrypt.hash('password123', 10);
  const defaultUser = await prisma.user.upsert({
    where: { email: 'user@flipkart.com' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'user@flipkart.com',
      password: hashedPassword,
      phone: '9876543210',
    },
  });
  console.log('✅ Default user created:', defaultUser.email);

  // ─── Default Address ───
  await prisma.address.upsert({
    where: { id: 'default-address-id' },
    update: {},
    create: {
      id: 'default-address-id',
      userId: defaultUser.id,
      fullName: 'Rahul Sharma',
      phone: '9876543210',
      pincode: '110001',
      street: '12, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      isDefault: true,
    },
  });

  // ─── Categories ───
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' } }),
    prisma.category.upsert({ where: { slug: 'home-furniture' }, update: {}, create: { name: 'Home & Furniture', slug: 'home-furniture', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200' } }),
    prisma.category.upsert({ where: { slug: 'books' }, update: {}, create: { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200' } }),
    prisma.category.upsert({ where: { slug: 'sports' }, update: {}, create: { name: 'Sports & Fitness', slug: 'sports', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200' } }),
    prisma.category.upsert({ where: { slug: 'beauty' }, update: {}, create: { name: 'Beauty & Care', slug: 'beauty', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' } }),
  ]);

  const [electronics, fashion, homeFurniture, books, sports, beauty] = categories;
  console.log('✅ Categories seeded');

  // ─── Products ───
  const products = [
    // Electronics
    { name: 'Samsung Galaxy S24 Ultra', description: 'Flagship Android smartphone with 200MP camera, S-Pen, and Snapdragon 8 Gen 3 processor. 12GB RAM, 256GB storage.', brand: 'Samsung', categoryId: electronics.id, price: 109999, mrp: 134999, stock: 25, rating: 4.5, reviewCount: 3421, isFeatured: true, images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500'], specifications: { Display: '6.8" Dynamic AMOLED 2X', Processor: 'Snapdragon 8 Gen 3', Battery: '5000mAh', Camera: '200MP + 12MP + 10MP + 50MP', RAM: '12GB', Storage: '256GB' } },
    { name: 'Apple iPhone 15', description: 'Apple iPhone 15 with A16 Bionic chip, 48MP camera system, Dynamic Island, and USB-C charging.', brand: 'Apple', categoryId: electronics.id, price: 79999, mrp: 89900, stock: 18, rating: 4.6, reviewCount: 5210, isFeatured: true, images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', 'https://images.unsplash.com/photo-1574755393849-623942496936?w=500'], specifications: { Display: '6.1" Super Retina XDR', Processor: 'A16 Bionic', Battery: '3877mAh', Camera: '48MP + 12MP', RAM: '6GB', Storage: '128GB' } },
    { name: 'boAt Airdopes 141', description: 'True wireless earbuds with 42H total playback, BEAST™ Mode low latency, and IPX4 water resistance.', brand: 'boAt', categoryId: electronics.id, price: 999, mrp: 2990, stock: 120, rating: 4.1, reviewCount: 89432, isFeatured: false, images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'], specifications: { 'Battery Life': '42 Hours Total', 'Driver Size': '6mm', Connectivity: 'Bluetooth 5.3', 'Water Resistance': 'IPX4', Latency: '60ms' } },
    { name: 'Lenovo IdeaPad Slim 3', description: 'Thin & light laptop with Intel Core i5 12th Gen, 16GB RAM, 512GB SSD, Full HD display.', brand: 'Lenovo', categoryId: electronics.id, price: 54990, mrp: 67990, stock: 14, rating: 4.3, reviewCount: 2180, isFeatured: true, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500'], specifications: { Processor: 'Intel Core i5 12th Gen', RAM: '16GB DDR4', Storage: '512GB SSD', Display: '15.6" Full HD IPS', OS: 'Windows 11 Home' } },
    { name: 'Sony WH-1000XM5', description: 'Industry-leading noise canceling headphones with 30hr battery, multipoint connection, and crystal clear calls.', brand: 'Sony', categoryId: electronics.id, price: 24990, mrp: 34990, stock: 35, rating: 4.7, reviewCount: 4312, isFeatured: false, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'], specifications: { 'Battery Life': '30 Hours', 'Noise Cancelling': 'Yes', Connectivity: 'Bluetooth 5.2 + 3.5mm', Weight: '250g', Microphone: 'Built-in' } },
    { name: 'Redmi Note 13 Pro', description: '200MP OIS camera, 120Hz AMOLED display, 5100mAh battery with 67W fast charging.', brand: 'Xiaomi', categoryId: electronics.id, price: 23999, mrp: 28999, stock: 60, rating: 4.4, reviewCount: 12500, isFeatured: false, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'], specifications: { Display: '6.67" AMOLED 120Hz', Processor: 'Snapdragon 7s Gen 2', Battery: '5100mAh', Camera: '200MP OIS', RAM: '8GB', Storage: '256GB' } },
    { name: 'Bajaj Majesty RCX 3 Air Cooler', description: '36L tower air cooler with 3-speed control, auto-fill feature, and ice chamber for ultra cool air.', brand: 'Bajaj', categoryId: electronics.id, price: 8499, mrp: 11999, stock: 45, rating: 4.2, reviewCount: 3210, isFeatured: false, images: ['https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500'], specifications: { Capacity: '36 Litres', 'Air Flow': '1800 m³/hr', Speeds: '3', 'Power Consumption': '185W', 'Ice Chamber': 'Yes' } },
    { name: 'Prestige Induction Cooktop', description: 'Slim induction cooktop with 8 preset menus, auto-off, child lock, and Indian menu presets.', brand: 'Prestige', categoryId: electronics.id, price: 1999, mrp: 3500, stock: 80, rating: 4.3, reviewCount: 22100, isFeatured: false, images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'], specifications: { Power: '1600W', Voltage: '230V AC', Menus: '8 Preset', 'Safety Features': 'Auto-off, Child Lock', Weight: '1.2kg' } },

    // Fashion
    { name: 'Campus OG-07 Sneakers', description: 'Classic casual sneakers with PVC outer material, cushioned insole, and rubber sole for all-day comfort.', brand: 'Campus', categoryId: fashion.id, price: 668, mrp: 1499, stock: 9, rating: 3.5, reviewCount: 2877, isFeatured: true, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'], specifications: { 'Outer Material': 'PVC', Type: 'Casual Sneakers', Closure: 'Lace-Up', Sole: 'Rubber', Ideal_For: 'Men' } },
    { name: 'Allen Solly Regular Fit Polo', description: 'Premium cotton polo T-shirt with ribbed collar, half sleeves, and regular fit. Available in multiple colors.', brand: 'Allen Solly', categoryId: fashion.id, price: 699, mrp: 1299, stock: 150, rating: 4.2, reviewCount: 5430, isFeatured: false, images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500'], specifications: { Fabric: '100% Cotton', Fit: 'Regular Fit', Sleeve: 'Half Sleeve', Neck: 'Polo', 'Wash Care': 'Machine Wash' } },
    { name: 'Levi\'s 511 Slim Fit Jeans', description: 'Classic slim fit jeans with stretch fabric, 5-pocket styling, and iconic Levi\'s red tab.', brand: "Levi's", categoryId: fashion.id, price: 2099, mrp: 3999, stock: 75, rating: 4.4, reviewCount: 8920, isFeatured: false, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'https://images.unsplash.com/photo-1541840031508-326a4c6f4ef3?w=500'], specifications: { Fabric: '99% Cotton 1% Elastane', Fit: 'Slim Fit', Rise: 'Mid Rise', 'Wash Type': 'Dark Wash', Pockets: '5 Pocket' } },
    { name: 'Puma Running Sports Shoes', description: 'Lightweight running shoes with SOFTFOAM+ cushioning, mesh upper, and non-marking outsole.', brand: 'Puma', categoryId: fashion.id, price: 2299, mrp: 4999, stock: 40, rating: 4.3, reviewCount: 6780, isFeatured: false, images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], specifications: { 'Outer Material': 'Mesh', Type: 'Running', Sole: 'Non-marking Rubber', Closure: 'Lace-Up', Cushioning: 'SOFTFOAM+' } },
    { name: 'BELLAVITA Mystic Bloom Perfume', description: 'Luxurious Eau de Parfum with notes of jasmine, rose, and musk. Long-lasting 60ml bottle.', brand: 'BELLAVITA', categoryId: fashion.id, price: 499, mrp: 1199, stock: 200, rating: 4.0, reviewCount: 9800, isFeatured: false, images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=500', 'https://images.unsplash.com/photo-1588776814546-1ffedbe47add?w=500'], specifications: { Type: 'Eau de Parfum', Volume: '60ml', 'Top Notes': 'Jasmine', 'Base Notes': 'Musk', 'Ideal For': 'Women' } },

    // Home & Furniture
    { name: 'Solimo Microfiber Comforter', description: 'All-season microfiber comforter with 300 GSM filling, soft shell fabric, and machine washable design.', brand: 'Solimo', categoryId: homeFurniture.id, price: 999, mrp: 2499, stock: 95, rating: 4.3, reviewCount: 31200, isFeatured: false, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'], specifications: { GSM: '300', Material: 'Microfiber', Size: 'Double (90x100 inches)', 'Wash Care': 'Machine Washable', Season: 'All Season' } },
    { name: 'Pigeon Healthifry Air Fryer', description: '4.2L digital air fryer with 8 preset programs, rapid air technology, and easy-clean non-stick basket.', brand: 'Pigeon', categoryId: homeFurniture.id, price: 3299, mrp: 7000, stock: 55, rating: 4.4, reviewCount: 14300, isFeatured: false, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'], specifications: { Capacity: '4.2 Litres', Power: '1400W', Programs: '8 Presets', Temperature: '80°C - 200°C', 'Non-Stick': 'Yes' } },
    { name: 'Nilkamal Plastic Chair', description: 'Durable plastic chair with ergonomic design, stackable feature, and UV-resistant material. Supports up to 150kg.', brand: 'Nilkamal', categoryId: homeFurniture.id, price: 899, mrp: 1499, stock: 200, rating: 4.1, reviewCount: 7600, isFeatured: false, images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500'], specifications: { Material: 'High-grade Plastic', 'Weight Capacity': '150kg', Stackable: 'Yes', 'UV Resistant': 'Yes' } },

    // Books
    { name: 'Clean Code by Robert C. Martin', description: 'A handbook of agile software craftsmanship. Learn how to write code that is readable, maintainable, and efficient.', brand: 'Pearson', categoryId: books.id, price: 499, mrp: 799, stock: 300, rating: 4.7, reviewCount: 12000, isFeatured: false, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500'], specifications: { Author: 'Robert C. Martin', Pages: '431', Publisher: 'Pearson', Language: 'English', ISBN: '978-0132350884' } },
    { name: 'The Alchemist', description: 'Paulo Coelho\'s masterpiece about following your dreams. Over 65 million copies sold worldwide.', brand: 'HarperCollins', categoryId: books.id, price: 199, mrp: 350, stock: 500, rating: 4.6, reviewCount: 45000, isFeatured: false, images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'], specifications: { Author: 'Paulo Coelho', Pages: '208', Publisher: 'HarperCollins', Language: 'English', Genre: 'Fiction' } },
    { name: 'System Design Interview Vol 2', description: 'An insider\'s guide to system design interviews covering distributed systems, scalability, and real-world case studies.', brand: 'Independently Published', categoryId: books.id, price: 2499, mrp: 3200, stock: 80, rating: 4.8, reviewCount: 3400, isFeatured: false, images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'], specifications: { Author: 'Alex Xu', Pages: '434', Language: 'English', Genre: 'Technical' } },

    // Sports
    { name: 'Boldfit Yoga Mat', description: 'Anti-slip TPE yoga mat with alignment lines, 6mm thickness, and carrying strap. Ideal for yoga and fitness.', brand: 'Boldfit', categoryId: sports.id, price: 599, mrp: 1999, stock: 180, rating: 4.3, reviewCount: 18900, isFeatured: false, images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'], specifications: { Material: 'TPE', Thickness: '6mm', Size: '183cm x 61cm', 'Anti-Slip': 'Yes', 'Carrying Strap': 'Included' } },
    { name: 'Strauss Adjustable Dumbbell', description: 'Pair of adjustable rubber dumbbells with chrome handle. Weight: 2kg x 2 per dumbbell.', brand: 'Strauss', categoryId: sports.id, price: 999, mrp: 2499, stock: 90, rating: 4.2, reviewCount: 7800, isFeatured: false, images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'], specifications: { Weight: '2kg x 2', Material: 'Rubber + Chrome', Type: 'Fixed Weight', 'Ideal For': 'Home Gym' } },
    { name: 'Nivia Dominator Football', description: 'Official size 5 football with 32-panel design, machine stitched, and high-air retention bladder.', brand: 'Nivia', categoryId: sports.id, price: 599, mrp: 999, stock: 120, rating: 4.1, reviewCount: 5600, isFeatured: false, images: ['https://images.unsplash.com/photo-1551958219-acbc595f17e3?w=500'], specifications: { Size: '5 (Official)', Panels: '32', Construction: 'Machine Stitched', Bladder: 'Butyl' } },

    // Beauty
    { name: 'Minimalist 10% Niacinamide Serum', description: 'Oil control serum with 10% Niacinamide and 1% Zinc for clear, balanced skin. 30ml bottle.', brand: 'Minimalist', categoryId: beauty.id, price: 349, mrp: 599, stock: 250, rating: 4.5, reviewCount: 28700, isFeatured: false, images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'], specifications: { 'Key Ingredient': 'Niacinamide 10%, Zinc 1%', 'Skin Type': 'All Skin Types', Volume: '30ml', 'Cruelty Free': 'Yes' } },
    { name: 'Mamaearth Onion Hair Oil', description: 'Onion hair oil with castor and bhringraj for hair fall control and hair growth. 250ml.', brand: 'Mamaearth', categoryId: beauty.id, price: 349, mrp: 499, stock: 300, rating: 4.3, reviewCount: 52000, isFeatured: false, images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500'], specifications: { 'Key Ingredient': 'Onion, Castor, Bhringraj', Volume: '250ml', 'Hair Type': 'All Hair Types', 'Toxin Free': 'Yes' } },
    { name: 'Lakme Absolute Lipstick', description: 'High shine lip color with argan oil infusion. 8-hour wear with rich pigmentation. 3.7g.', brand: 'Lakme', categoryId: beauty.id, price: 349, mrp: 575, stock: 400, rating: 4.2, reviewCount: 16800, isFeatured: false, images: ['https://images.unsplash.com/photo-1586495777744-4e6232bf2278?w=500'], specifications: { Type: 'Lipstick', Finish: 'High Shine', 'Key Ingredient': 'Argan Oil', Weight: '3.7g', 'Wear Time': '8 Hours' } },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} products seeded`);
  console.log('🎉 Database seeding complete!');
  console.log('Default login → email: user@flipkart.com | password: password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
