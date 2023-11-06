const { Endpoint, EndpointAnswer, EndpointError } = require('./endpoint');
const { UserModel } = require('../models/user_model');
const { JWT } = require('../utils/jwt');
const { BCrypt } = require('../libs/bcrypt');

class UserRegEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_POST, 'users', null);
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			let user = new UserModel({
				login: params.login,
				password: await BCrypt.getHash(params.password),
			});

			await user.save();
			let jwt = JWT.generateToken(user);
			return new EndpointAnswer(1, 'User registered', { token: jwt });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

class UserLoginEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_GET, 'users', null);
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			let user = await UserModel.findOne({ login: params.login });
			if (user == null) throw new EndpointError('User not found', 404);

			if (!await BCrypt.checkHash(user.password, params.password)) throw new EndpointError('Password incorrect', 400);
			let jwt = JWT.generateToken(user);
			return new EndpointAnswer(1, 'User token', { token: jwt });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else if (err.name == 'EndpointError') return new EndpointAnswer(0, err.message, {}, err.getCode());
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

module.exports.UserRegEndpoint = UserRegEndpoint;
module.exports.UserLoginEndpoint = UserLoginEndpoint;
module.exports.usersEndpoints = [
	new UserRegEndpoint(),
	new UserLoginEndpoint(),
];