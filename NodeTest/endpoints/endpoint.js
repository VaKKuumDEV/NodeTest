const { TextUtils } = require('../utils/text_utils');
const fileUpload = require('express-fileupload');

class EndpointError extends Error {
	#code;

	constructor(message, code) {
		super(message);

		this.name = 'EndpointError';
		this.#code = code;
	}

	getCode() {
		return this.#code;
	}
}

class EndpointAnswer {
	#code = 0;
	#message = '';
	#params = {};
	#statusCode = 200;

	/**
	 * 
	 * @param {number} code
	 * @param {string} message
	 * @param {Object} params
	 * @param {number} status
	 */
	constructor(code, message, params, status = 200) {
		if (typeof message != 'string' && !TextUtils.isNumeric(message)) message = JSON.stringify(message);

		this.#code = code;
		this.#message = message;
		this.#params = params;
		this.#statusCode = status;
	}

	/**
	 * 
	 * @returns
	 */
	getCode() {
		return this.#code;
	}

	/**
	 * 
	 * @returns
	 */
	getMessage() {
		return this.#message;
	}

	/**
	 * 
	 * @returns
	 */
	getStatus() {
		return this.#statusCode;
	}

	/**
	 * 
	 * @returns {string}
	 */
	toJSONText() {
		let jsonData = this.toJson();

		return JSON.stringify(jsonData);
	}

	/**
	 * 
	 * @returns {Object}
	 */
	toJson() {
		let jsonData = {
			code: this.#code,
			message: this.#message,
		};

		for (let key in this.#params) {
			jsonData[key] = this.#params[key];
		}

		return jsonData;
	}
}

class Endpoint {
    static TYPE_GET = 0;
    static TYPE_POST = 1;
    static TYPE_PUT = 2;
    static TYPE_DELETE = 3;

    /**
     * @type {number}
     */
    #type = Endpoint.TYPE_GET;
    /**
     * @type {string}
     */
    #name;
    /**
     * @type {string?}
     */
    #param = null;

    /**
     * 
     * @param {number} type
     * @param {string} name
     * @param {string?} param
     */
	constructor(type, name, param = null) {
		this.#name = name;
		this.#type = type;
		this.#param = param;
	}

	/**
	 * 
	 * @returns
	 */
	getName() {
		return this.#name;
	}

	/**
	 * 
	 * @returns
	 */
	getType() {
		return this.#type;
	}

	/**
	 * 
	 * @returns
	 */
	getParam() {
		return this.#param;
	}

	/**
	 * 
	 * @param {any} params
	 * @param {fileUpload.FileArray?} files
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params, files = null) {
		return new EndpointAnswer(0, 'Method not found', {});
	}
}

module.exports.Endpoint = Endpoint;
module.exports.EndpointError = EndpointError;
module.exports.EndpointAnswer = EndpointAnswer;