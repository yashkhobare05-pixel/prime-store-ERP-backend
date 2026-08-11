const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');

exports.getReportsSummary = async (req, res, next) => {
  try {
    const sales = await SalesOrder.find();
    const products = await Product.find();
    const purchases = await PurchaseOrder.find();
    const suppliers = await Supplier.find();
    const customers = await Customer.find();

    const totalSalesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPurchaseCost = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const grossProfit = totalSalesRevenue - totalPurchaseCost;
    const profitMargin = totalSalesRevenue > 0 ? ((grossProfit / totalSalesRevenue) * 100).toFixed(1) : 0;

    const inventoryValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.costPrice), 0);
    const retailStockValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.sellingPrice), 0);

    res.status(200).json({
      success: true,
      summary: {
        totalSalesRevenue,
        totalPurchaseCost,
        grossProfit,
        profitMargin,
        inventoryValue,
        retailStockValue,
        totalProducts: products.length,
        totalSalesOrders: sales.length,
        totalPurchaseOrders: purchases.length,
        totalSuppliers: suppliers.length,
        totalCustomers: customers.length
      }
    });
  } catch (err) {
    next(err);
  }
};
