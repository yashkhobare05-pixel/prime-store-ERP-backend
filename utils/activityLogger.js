const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, action, moduleName, details, req) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : '127.0.0.1';
    await ActivityLog.create({
      user: user._id || null,
      userName: user.name || 'System User',
      userRole: user.role || 'Admin',
      action,
      module: moduleName,
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
};

module.exports = logActivity;
