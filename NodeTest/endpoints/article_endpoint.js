const { Endpoint, EndpointAnswer, EndpointError } = require('./endpoint');
const { ArticleModel } = require('../models/article_model');
const { AttachmentModel } = require('../models/attachment_model');
const { JWT } = require('../utils/jwt');
const { UserModel } = require('../models/user_model');

class ArticlesEndpoint extends Endpoint{
	constructor() {
		super(Endpoint.TYPE_GET, 'news', null);
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			let articles = await ArticleModel.find({
				publication_date: {
					$lte: new Date(),
				},
			});

			return new EndpointAnswer(1, 'Articles list', { articles: articles });
		} catch (err) {
			return new EndpointAnswer(0, 'Error while getting articles', {}, 500);
		}
    }
}

class ArticlesMyEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_GET, 'mynews', null);
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			if (params.token == undefined) throw new EndpointError('Token not sent', 403);
			let tokenData = JWT.decodeJWT(params.token);

			let user = null;
			if (tokenData.data != undefined && tokenData.data.id != undefined) user = await UserModel.findById(tokenData.data.id);
			if (user == null) throw new EndpointError('User not found', 404);

			let articles = await ArticleModel.find({ author: user.login });

			return new EndpointAnswer(1, 'Articles list for user', { articles: articles });
		} catch (err) {
			return new EndpointAnswer(0, 'Error while getting articles', {}, 500);
		}
	}
}

class ArticleAddEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_POST, 'news', null);
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			if (params.token == undefined) throw new EndpointError('Token not sent', 403);
			let tokenData = JWT.decodeJWT(params.token);

			let user = null;
			if (tokenData.data != undefined && tokenData.data.id != undefined) user = await UserModel.findById(tokenData.data.id);
			if (user == null) throw new EndpointError('User not found', 404);

			let article = new ArticleModel({
				title: params.title,
				author: user.login,
				description: params.description,
			});

			if (params.files != undefined && Array.isArray(params.files)) {
				let attachments = [];
				for (let fileIndex in params.files) {
					try {
						let att = await AttachmentModel.findById(params.files[fileIndex]);
						if (att != null) attachments.push(att);
					} catch (err) { }
				}
				article.images = attachments;
			}

			if (params.publication_date != undefined) {
				try {
					let date = params.publication_date;
					if (date == '') throw 'Invalid date format';
					let datePieces = date.split('/');
					if (datePieces.length != 3) throw 'Invalid date format';

					let dateObj = new Date(parseInt(datePieces[2]), parseInt(datePieces[1]) - 1, parseInt(datePieces[0]), 0, 0, 0, 0);
					article.publication_date = dateObj;
				} catch (err) {
					throw 'Error while parsing date';
				}
			}

			await article.save();
			return new EndpointAnswer(1, 'Article added', { article: article });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

class ArticleGetEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_GET, 'news', 'id');
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			let article = await ArticleModel.findById(params.id);
			if (article == null) throw new EndpointError('Article not found', 404);

			return new EndpointAnswer(1, 'Article info', { article: article });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else if (err.name == 'EndpointError') return new EndpointAnswer(0, err.message, {}, err.getCode());
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

class ArticleEditEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_PUT, 'news', 'id');
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			if (params.token == undefined) throw new EndpointError('Token not sent', 403);
			let tokenData = JWT.decodeJWT(params.token);

			let user = null;
			if (tokenData.data != undefined && tokenData.data.id != undefined) user = await UserModel.findById(tokenData.data.id);
			if (user == null) throw new EndpointError('User not found', 404);

			let article = await ArticleModel.findById(params.id);
			if (article == null) throw new EndpointError('Article not found', 404);

			if (article.author != user.login) throw new EndpointError('Access denied', 403);

			article.title = params.title;
			article.description = params.description;
			article.images = params.images;

			if (params.publication_date != undefined) {
				try {
					let date = params.publication_date;
					if (date == '') throw 'Invalid date format';
					let datePieces = date.split('/');
					if (datePieces.length != 3) throw 'Invalid date format';

					let dateObj = new Date(parseInt(datePieces[2]), parseInt(datePieces[1]) - 1, parseInt(datePieces[0]), 0, 0, 0, 0);
					article.publication_date = dateObj;
				} catch (err) {
					throw 'Error while parsing date';
				}
			}

			await article.save();
			return new EndpointAnswer(1, 'Article edited', { article: article });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else if (err.name == 'EndpointError') return new EndpointAnswer(0, err.message, {}, err.getCode());
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

class ArticleDeleteEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_DELETE, 'news', 'id');
	}

	/**
	 * 
	 * @param {any} params
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params) {
		try {
			if (params.token == undefined) throw new EndpointError('Token not sent', 403);
			let tokenData = JWT.decodeJWT(params.token);

			let user = null;
			if (tokenData.data != undefined && tokenData.data.id != undefined) user = await UserModel.findById(tokenData.data.id);
			if (user == null) throw new EndpointError('User not found', 404);

			let article = await ArticleModel.findById(params.id);
			if (article == null) throw new EndpointError('Article not found', 404);

			if (article.author != user.login) throw new EndpointError('Access denied', 403);

			await article.deleteOne();
			return new EndpointAnswer(1, 'Article deleted', { article: article });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else if (err.name == 'EndpointError') return new EndpointAnswer(0, err.message, {}, err.getCode());
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

module.exports.ArticlesEndpoint = ArticlesEndpoint;
module.exports.ArticleAddEndpoint = ArticleAddEndpoint;
module.exports.ArticleGetEndpoint = ArticleGetEndpoint;
module.exports.ArticleEditEndpoint = ArticleEditEndpoint;
module.exports.ArticleDeleteEndpoint = ArticleDeleteEndpoint;
module.exports.ArticlesMyEndpoint = ArticlesMyEndpoint;
module.exports.articleEndpoints = [
	new ArticlesEndpoint(),
	new ArticleAddEndpoint(),
	new ArticleGetEndpoint(),
	new ArticleEditEndpoint(),
	new ArticleDeleteEndpoint(),
	new ArticlesMyEndpoint(),
];