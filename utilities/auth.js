// utilities/auth.js
const jwtUtil = require('./jwt');

function setLocalsFromToken(req, res, next) {
  res.locals.loggedin = false;
  res.locals.accountData = null;
  const token = req.cookies?.jwt;
  if (!token) return next();
  try {
    const payload = jwtUtil.verifyToken(token);
    res.locals.loggedin = true;
    res.locals.accountData = payload;
  } catch (err) {
    // invalid token: clear cookie
    res.clearCookie('jwt');
  }
  return next();
}

// Guard that checks login status and role for inventory admin operations
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) {
      req.flash('notice', 'Please log in to access that page.');
      return res.redirect('/account/login');
    }
    try {
      const payload = jwtUtil.verifyToken(token);
      if (!allowedRoles.includes(payload.account_type)) {
        req.flash('notice', 'You do not have permission to access that page.');
        return res.redirect('/account/login');
      }
      // attach payload to req for convenience
      req.account = payload;
      res.locals.accountData = payload;
      res.locals.loggedin = true;
      return next();
    } catch (err) {
      res.clearCookie('jwt');
      req.flash('notice', 'Please log in to access that page.');
      return res.redirect('/account/login');
    }
  };
}

module.exports = { setLocalsFromToken, requireRole };
