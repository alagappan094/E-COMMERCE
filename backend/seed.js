const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal clear sound.',
    price: 2999,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    rating: 4.5,
    numReviews: 120,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches, perfect for gaming and typing enthusiasts.',
    price: 4499,
    category: 'Electronics',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    rating: 4.7,
    numReviews: 88,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support office chair with adjustable height, armrests, and breathable mesh back.',
    price: 12999,
    category: 'Furniture',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop',
    rating: 4.3,
    numReviews: 64,
  },
  {
    name: 'Cotton Casual T-Shirt',
    description: '100% organic cotton, available in multiple sizes. Soft, breathable, and machine washable.',
    price: 599,
    category: 'Clothing',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    rating: 4.1,
    numReviews: 210,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled vacuum insulated water bottle. Keeps drinks cold for 24hrs or hot for 12hrs.',
    price: 899,
    category: 'Sports & Outdoors',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    rating: 4.6,
    numReviews: 175,
  },
  {
    name: 'Smart 4K LED TV 55"',
    description: 'Ultra HD 4K Smart TV with HDR, built-in streaming apps, and voice control.',
    price: 45999,
    category: 'Electronics',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&h=300&fit=crop',
    rating: 4.4,
    numReviews: 56,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive foam cushioning and breathable mesh upper.',
    price: 3499,
    category: 'Sports & Outdoors',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    rating: 4.5,
    numReviews: 302,
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable 12-cup coffee maker with built-in grinder and thermal carafe.',
    price: 5999,
    category: 'Kitchen',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    rating: 4.2,
    numReviews: 93,
  },
  {
    name: 'Yoga Mat',
    description: 'Eco-friendly non-slip yoga mat with alignment lines and carrying strap.',
    price: 1299,
    category: 'Sports & Outdoors',
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1601925228442-994fc2db0e82?w=400&h=300&fit=crop',
    rating: 4.8,
    numReviews: 145,
  },
  {
    name: 'Leather Laptop Bag',
    description: 'Genuine leather laptop bag fits up to 15.6" laptops. Multiple compartments and padded shoulder strap.',
    price: 3299,
    category: 'Accessories',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    rating: 4.3,
    numReviews: 77,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with silent click, 2.4GHz receiver, and 18-month battery life.',
    price: 1499,
    category: 'Electronics',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    rating: 4.4,
    numReviews: 188,
  },
  {
    name: 'Scented Candle Set',
    description: 'Set of 6 hand-poured soy wax candles in assorted fragrances. Burns for 40+ hours each.',
    price: 1199,
    category: 'Home & Garden',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=300&fit=crop',
    rating: 4.7,
    numReviews: 234,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user (password will be hashed by the pre-save hook)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('👤 Created users');

    // Seed products
    await Product.insertMany(products);
    console.log('📦 Seeded 12 products');

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin credentials:');
    console.log('   Email:    admin@ecommerce.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 User credentials:');
    console.log('   Email:    john@example.com');
    console.log('   Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
