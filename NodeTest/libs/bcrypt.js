const bcrypt = require("bcryptjs");

class BCrypt {
    static ROUNDS = 10;

    /**
     * 
     * @param {string} password
     * @returns
     */
    static async getHash(password) {
        let salt = await bcrypt.genSalt(BCrypt.ROUNDS);
        let hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async checkHash(hash, password) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports.BCrypt = BCrypt;