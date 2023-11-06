class TextUtils {
	/**
	 * 
	 * @param {string} str
	 * @returns
	 */
	static addSlashes(str) {
		return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	}

	/**
	 * 
	 * @param {string} email
	 * @returns
	 */
	static validateEmail(email) {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	}

	/**
	 * 
	 * @param {number} length
	 * @returns
	 */
	static generateString(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	/**
	 * 
	 * @param {string} str String to encode
	 * @returns
	 */
	static encodeUnicodeBase64(str) {
		return btoa(
			encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
				return String.fromCharCode('0x' + p1)
			})
		);
	}

	/**
	 * 
	 * @param {string} str Encoded string
	 * @returns
	 */
	static decodeUnicodeBase64(str) {
		return decodeURIComponent(
			atob(str)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				})
				.join('')
		);
	}

	/**
	 * Checks bool value in string
	 * @param {string} str
	 * @returns
	 */
	static isBooleanString(str) {
		if (str == "true") return true;
		else if (str == "false") return true;
		else if (str == "1") return true;
		else if (str == "0") return true;
		else if (str == "on") return true;
		else if (str == "off") return true;

		return false;
	}

	/**
	 * Convert string to bool
	 * @param {string} str
	 * @returns
	 */
	static toBoolean(str) {
		if (str == "true") return true;
		else if (str == "false") return false;
		else if (str == "1") return true;
		else if (str == "0") return false;
		else if (str == "on") return true;
		else if (str == "off") return false;

		return false;
	}

	/**
	 * 
	 * @param {string} str
	 * @returns
	 */
	static isNumeric(str) {
		if (typeof str == 'number') return true;
		else if (typeof str != "string") return false;

		return !isNaN(str) && !isNaN(parseFloat(str));
	}
};

module.exports.TextUtils = TextUtils;