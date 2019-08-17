const logger = require('../services/LoggerService')

async function requireAuth(req, res, next) {
  console.log('req.session.user at auth',req.session);
  
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized, Auth required');
    return;
  }
  next();
}

module.exports = requireAuth
