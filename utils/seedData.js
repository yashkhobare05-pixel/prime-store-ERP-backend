const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Warehouse = require('../models/Warehouse');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const SalesOrder = require('../models/SalesOrder');
const PurchaseOrder = require('../models/PurchaseOrder');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_stock_inventory';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Warehouse.deleteMany();
    await Supplier.deleteMany();
    await Customer.deleteMany();
    await SalesOrder.deleteMany();
    await PurchaseOrder.deleteMany();
    await Notification.deleteMany();
    await ActivityLog.deleteMany();

    console.log('Cleared existing collection data.');

    // 1. Create Default Users
    const admin = await User.create({
      name: 'Dr. Sarah Connor (Admin)',
      email: 'admin@inventory.ai',
      password: 'adminpassword123',
      role: 'Admin',
      department: 'Executive Management',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    });

    const manager = await User.create({
      name: 'Alex Vance (Manager)',
      email: 'manager@inventory.ai',
      password: 'managerpassword123',
      role: 'Manager',
      department: 'Warehouse Operations',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80'
    });

    const employee = await User.create({
      name: 'Marcus Brody (Employee)',
      email: 'employee@inventory.ai',
      password: 'employeepassword123',
      role: 'Employee',
      department: 'Stock & Logistics',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80'
    });

    console.log('Seeded Users: Admin, Manager, Employee');

    // 2. Create Categories
    const catElectronics = await Category.create({ name: 'Electronics & Computing', code: 'CAT-ELEC', description: 'Computers, laptops, and smart gadgets' });
    const catPeripherals = await Category.create({ name: 'Peripherals & Accessories', code: 'CAT-PERI', description: 'Keyboards, mice, monitors, and audio' });
    const catNetworking = await Category.create({ name: 'Networking & Servers', code: 'CAT-NET', description: 'Routers, switches, and rack hardware' });

    // 3. Create Warehouses
    const whAlpha = await Warehouse.create({
      name: 'Central Logistics Hub Alpha',
      code: 'WH-ALPHA',
      location: { address: '100 Silicon Way', city: 'San Jose', state: 'CA', country: 'USA', zipCode: '95134' },
      capacityUnits: 15000,
      occupiedUnits: 4200,
      managerName: 'Alex Vance'
    });

    const whBeta = await Warehouse.create({
      name: 'East Coast Distribution Beta',
      code: 'WH-BETA',
      location: { address: '450 Industrial Blvd', city: 'Newark', state: 'NJ', country: 'USA', zipCode: '07102' },
      capacityUnits: 10000,
      occupiedUnits: 2800,
      managerName: 'Elena Rostova'
    });

    // 4. Create Suppliers
    const supTech = await Supplier.create({
      name: 'Nexus Silicon Supplies',
      companyName: 'Nexus Tech Global Ltd.',
      email: 'orders@nexussilicon.com',
      phone: '+1-800-555-0199',
      rating: 4.9,
      leadTimeDays: 2,
      deliveryPerformanceScore: 98.4
    });

    const supAudio = await Supplier.create({
      name: 'SonicWave Audio Corp',
      companyName: 'SonicWave Technologies',
      email: 'sales@sonicwave.com',
      phone: '+1-800-555-0288',
      rating: 4.6,
      leadTimeDays: 4,
      deliveryPerformanceScore: 93.1
    });

    // 5. Create Customers
    const cust1 = await Customer.create({
      name: 'Acme Enterprise Solutions',
      email: 'procurement@acme-corp.com',
      phone: '+1-415-555-9011',
      loyaltyPoints: 1250,
      tier: 'Gold',
      totalSpent: 48500
    });

    const cust2 = await Customer.create({
      name: 'Quantum Cybernetics',
      email: 'tech@quantumcyber.io',
      phone: '+1-415-555-8822',
      loyaltyPoints: 3400,
      tier: 'Platinum',
      totalSpent: 112000
    });

    // 6. Create Products
    const productsData = [
      {
        name: 'HP Pavilion Ultra Laptop 16"',
        sku: 'HPP-16-ULTRA',
        barcode: '8901234567891',
        qrCode: 'QR-HPP-16-ULTRA-2026',
        category: catElectronics._id,
        supplier: supTech._id,
        warehouse: whAlpha._id,
        description: 'High-performance Intel i9 14th Gen, 32GB RAM, 1TB NVMe SSD',
        costPrice: 850,
        sellingPrice: 1299,
        stockQuantity: 14, // Low stock for AI alert
        minStockLevel: 20,
        maxStockLevel: 150,
        reorderPoint: 25,
        unit: 'PCS',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        movementVelocity: 'Fast Moving'
      },
      {
        name: 'Dell UltraSharp 27" 4K Monitor',
        sku: 'DELL-U27-4K',
        barcode: '8901234567892',
        qrCode: 'QR-DELL-U27-4K-2026',
        category: catPeripherals._id,
        supplier: supTech._id,
        warehouse: whAlpha._id,
        description: 'HDR400 IPS panel with USB-C Hub integration',
        costPrice: 320,
        sellingPrice: 499,
        stockQuantity: 65,
        minStockLevel: 15,
        maxStockLevel: 200,
        reorderPoint: 30,
        unit: 'PCS',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
        movementVelocity: 'Fast Moving'
      },
      {
        name: 'Logitech MX Master 3S Wireless',
        sku: 'LOGI-MX3S-BLK',
        barcode: '8901234567893',
        qrCode: 'QR-LOGI-MX3S-BLK-2026',
        category: catPeripherals._id,
        supplier: supTech._id,
        warehouse: whBeta._id,
        description: 'Ergonomic quiet click mouse 8000 DPI sensor',
        costPrice: 60,
        sellingPrice: 99,
        stockQuantity: 140,
        minStockLevel: 25,
        maxStockLevel: 300,
        reorderPoint: 40,
        unit: 'PCS',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
        movementVelocity: 'Fast Moving'
      },
      {
        name: 'SonicWave Noise-Canceling Headset',
        sku: 'SONIC-NC-PRO',
        barcode: '8901234567894',
        qrCode: 'QR-SONIC-NC-PRO-2026',
        category: catPeripherals._id,
        supplier: supAudio._id,
        warehouse: whBeta._id,
        description: 'Active Noise Canceling with 40-hour battery life',
        costPrice: 110,
        sellingPrice: 199,
        stockQuantity: 8, // Low stock
        minStockLevel: 15,
        maxStockLevel: 100,
        reorderPoint: 20,
        unit: 'PCS',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        movementVelocity: 'Moderate Moving'
      },
      {
        name: 'Enterprise 24-Port Gigabit PoE Router',
        sku: 'NET-POE-24P',
        barcode: '8901234567895',
        qrCode: 'QR-NET-POE-24P-2026',
        category: catNetworking._id,
        supplier: supTech._id,
        warehouse: whAlpha._id,
        description: 'Managed Layer 3 Switch with SFP+ Fiber uplink',
        costPrice: 450,
        sellingPrice: 799,
        stockQuantity: 180, // Overstock candidate
        minStockLevel: 10,
        maxStockLevel: 80,
        reorderPoint: 15,
        unit: 'PCS',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
        movementVelocity: 'Slow Moving'
      }
    ];

    const createdProducts = await Product.create(productsData);
    console.log(`Seeded ${createdProducts.length} Products`);

    // 7. Seed Notifications
    await Notification.create([
      {
        title: 'Critical Low Stock Warning',
        message: 'HP Pavilion Ultra Laptop stock is at 14 units (Min Level: 20). Reorder recommended immediately.',
        type: 'Low Stock',
        priority: 'High',
        relatedProduct: createdProducts[0]._id
      },
      {
        title: 'AI Reorder Recommendation',
        message: 'AI Model predicts 82 units demand next 30 days for HP Pavilion. Recommended PO quantity: 50 units.',
        type: 'AI Insight',
        priority: 'Critical',
        relatedProduct: createdProducts[0]._id
      },
      {
        title: 'Overstock Risk Alert',
        message: 'Enterprise 24-Port Switch inventory exceeds max stock level by 100 units.',
        type: 'Reorder Alert',
        priority: 'Medium',
        relatedProduct: createdProducts[4]._id
      }
    ]);

    // 8. Seed Activity Log
    await ActivityLog.create([
      {
        userName: admin.name,
        userRole: admin.role,
        action: 'System Initialization',
        module: 'Database',
        details: 'Seeded initial products, warehouses, and AI prediction models.',
        ipAddress: '127.0.0.1'
      }
    ]);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDatabase();
