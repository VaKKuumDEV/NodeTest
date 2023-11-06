var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    registered: { type: Date, default: Date.now },
});

User.set('toJSON', { getters: true });

var UserModel = mongoose.model('User', User);
module.exports.UserModel = UserModel;