const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { defaultProducts } = require('./config/seedData');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('🗑️  Cleared existing data');

    await Promise.all([
      User.create({
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: 'admin123',
        role: 'admin',
      }),
      User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'user',
      }),
    ]);

    console.log('👤 Created users');

    await Product.insertMany(defaultProducts);
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
