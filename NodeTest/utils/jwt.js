const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user_model');

class JWT {
    static signature = 'rWjX2X3s1mOAhJdh7pnmXRazYeYrDk1p';

    /**
     * 
     * @param {UserModel} user
     * @returns
     */
    static generateToken(user) {
        const data = {
            id: user._id,
            login: user.login,
        };
        const expiration = '24h';
        return jwt.sign({ data, }, JWT.signature, { expiresIn: expiration });
    }

    /**
     * 
     * @param {string} token
     * @returns
     */
    static decodeJWT(token) {
        return jwt.decode(token);
    }
}

module.exports.JWT = JWT;