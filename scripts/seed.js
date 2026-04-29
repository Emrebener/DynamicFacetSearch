const env = require('../src/config/env');
const { connectToMongo, getProductsCollection, closeMongo } = require('../src/db/mongo');

const now = new Date();

const products = [
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Lightweight business laptop with a compact screen.',
    category: 'Laptops',
    price: 899.99,
    condition: 'Used',
    attributes: {
      brand: 'Lenovo',
      cpu: 'Intel i7',
      ramGb: 16,
      storageGb: 512,
      screenSizeInches: 14,
      ports: ['USB-C', 'HDMI'],
    },
  },
  {
    name: 'Dell XPS 13',
    description: 'Portable laptop with high-resolution display.',
    category: 'Laptops',
    price: 1099.99,
    condition: 'Refurbished',
    attributes: {
      brand: 'Dell',
      cpu: 'Intel i5',
      ramGb: 16,
      storageGb: 512,
      screenSizeInches: 13,
      ports: ['USB-C'],
    },
  },
  {
    name: 'Apple MacBook Pro 14',
    description: 'Professional laptop for development and creative work.',
    category: 'Laptops',
    price: 1599.99,
    condition: 'Used',
    attributes: {
      brand: 'Apple',
      cpu: 'M3 Pro',
      ramGb: 18,
      storageGb: 512,
      screenSizeInches: 14,
      ports: ['USB-C', 'HDMI', 'SD'],
    },
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Wireless headphones with active noise cancellation.',
    category: 'Headphones',
    price: 249.99,
    condition: 'Used',
    attributes: {
      brand: 'Sony',
      noiseCancelling: true,
      batteryLifeHours: 30,
      connection: ['Bluetooth', '3.5mm'],
      colour: 'Black',
    },
  },
  {
    name: 'Bose QuietComfort',
    description: 'Comfortable headphones for travel and commuting.',
    category: 'Headphones',
    price: 199.99,
    condition: 'Refurbished',
    attributes: {
      brand: 'Bose',
      noiseCancelling: true,
      batteryLifeHours: 24,
      connection: ['Bluetooth'],
      colour: 'Silver',
    },
  },
  {
    name: 'Audio-Technica M50x',
    description: 'Studio headphones with wired connection.',
    category: 'Headphones',
    price: 119.99,
    condition: 'New',
    attributes: {
      brand: 'Audio-Technica',
      noiseCancelling: false,
      batteryLifeHours: 0,
      connection: ['3.5mm'],
      colour: 'Black',
    },
  },
  {
    name: 'The Left Hand of Darkness',
    description: 'Classic science fiction novel.',
    category: 'Books',
    price: 8.99,
    condition: 'Used',
    attributes: {
      author: 'Ursula K. Le Guin',
      genre: 'Science Fiction',
      format: 'Paperback',
      pageCount: 320,
      language: 'English',
    },
  },
  {
    name: 'Clean Code',
    description: 'Software development book about maintainable code.',
    category: 'Books',
    price: 24.99,
    condition: 'Used',
    attributes: {
      author: 'Robert C. Martin',
      genre: 'Technology',
      format: 'Hardback',
      pageCount: 464,
      language: 'English',
    },
  },
  {
    name: 'Norwegian Wood',
    description: 'Literary fiction paperback.',
    category: 'Books',
    price: 6.99,
    condition: 'Used',
    attributes: {
      author: 'Haruki Murakami',
      genre: 'Literary Fiction',
      format: 'Paperback',
      pageCount: 296,
      language: 'English',
    },
  },
  {
    name: 'Trek FX 2',
    description: 'Hybrid bicycle for commuting and leisure rides.',
    category: 'Bicycles',
    price: 399.99,
    condition: 'Used',
    attributes: {
      brand: 'Trek',
      bikeType: 'Hybrid',
      frameSize: 'M',
      wheelSizeInches: 28,
      gearCount: 21,
    },
  },
  {
    name: 'Specialized Rockhopper',
    description: 'Mountain bike for trails and mixed terrain.',
    category: 'Bicycles',
    price: 549.99,
    condition: 'Used',
    attributes: {
      brand: 'Specialized',
      bikeType: 'Mountain',
      frameSize: 'L',
      wheelSizeInches: 29,
      gearCount: 18,
    },
  },
  {
    name: 'Brompton C Line',
    description: 'Folding bicycle for city travel.',
    category: 'Bicycles',
    price: 899.99,
    condition: 'Refurbished',
    attributes: {
      brand: 'Brompton',
      bikeType: 'Folding',
      frameSize: 'One Size',
      wheelSizeInches: 16,
      gearCount: 6,
    },
  },
].map((product) => ({
  ...product,
  createdAt: now,
  updatedAt: now,
  demoSeed: true,
}));

async function seed() {
  await connectToMongo();
  const collection = getProductsCollection();

  await collection.deleteMany({ demoSeed: true });
  await collection.insertMany(products);

  console.log(`Seeded ${products.length} demo products into ${env.mongoDbName}.`);
  await closeMongo();
}

seed().catch(async (error) => {
  console.error('Failed to seed products:', error);
  await closeMongo();
  process.exit(1);
});

