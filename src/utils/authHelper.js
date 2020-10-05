const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS, 10));
const secret = process.env.JWT_SECRET;

/**
   * Generate JWT
   * @param {Object} payload - object literal resource to be encoded
   * @param {String} expiresIn jwt expiry date
   * @returns {String} - jwt token
   */
exports.generateToken = (payload, expiresIn = '1 days') => {
  const token = jwt.sign({ ...payload }, secret, { expiresIn });
  return token;
};

/**
 * @function verifyToken
 * @param {String} token jwt token
 * @returns {Object} decoded object
 */
exports.verifyToken = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

/**
 * @function hashPassword
 * @param {String} password pasword string to be hashed
 * @returns {String} hashed password
 * @description takes a raw password string, hashes it and returns the hasshed value
 */
exports.hashPassword = (password) => bcrypt.hashSync(password, salt);
