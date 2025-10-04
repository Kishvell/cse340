// utilities/jwt.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.ACCESS_TOKEN_SECRET || 'replace_with_env_secret';
const EXPIRATION = '2h';

function buildToken(payload) {
  // don't include password in payload
  const safePayload = {
    account_id: payload.account_id,
    account_firstname: payload.account_firstname,
    account_lastname: payload.account_lastname,
    account_email: payload.account_email,
    account_type: payload.account_type
  };
  return jwt.sign(safePayload, SECRET, { expiresIn: EXPIRATION });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { buildToken, verifyToken };
