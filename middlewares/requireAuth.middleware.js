const logger = require('../services/LoggerService')

async function requireAuth(req, res, next) {
  
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized, Auth required');
    return;
  }
  next();
}

module.exports = requireAuth
