var express = require('express');
var path = require('path'); // модуль для парсинга пути
var log = require('./libs/log')(module);
var config = require('./libs/config');
var mongoose = require('./libs/mongoose');
var { Endpoint, EndpointAnswer } = require('./endpoints/endpoint');
var app = express();

const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const _ = require('lodash');

global.uploadDirectory = 'uploads';
global.serverDirectory = path.join(__dirname, "public");

app.use(fileUpload({
	createParentPath: true,
	limits: {
		fileSize: 100 * 1024 * 1024 * 1024 //100MB max file(s) size
	},
}));

app.use(methodOverride()); // поддержка put и delete
app.use(express.static(global.serverDirectory)); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set('json spaces', 2);

let articleEndpoints = require('./endpoints/article_endpoint').articleEndpoints;
let attachmentsEndpoints = require('./endpoints/attachment_endpoint').attachmentsEndpoints;
let usersEndpoints = require('./endpoints/users_endpoint').usersEndpoints;

/**
 * @type {Endpoint[]}
 */
let endpoints = [];
endpoints = endpoints.concat(articleEndpoints);
endpoints = endpoints.concat(attachmentsEndpoints);
endpoints = endpoints.concat(usersEndpoints);

for (let endpointIndex in endpoints) {
	let endpoint = endpoints[endpointIndex];
	let link = '/api/' + endpoint.getName();
	if (endpoint.getParam() != null) link += '/:' + endpoint.getParam();

	if (endpoint.getType() == Endpoint.TYPE_GET) {
		app.get(link, async (req, res) => {
			let params = _.extend(req.params || {}, req.query || {}, req.body || {});
			let answer = await endpoint.execute(params);

			res.status(answer.getStatus()).send(answer.toJson());
		});
	} else if (endpoint.getType() == Endpoint.TYPE_POST) {
		app.post(link, async (req, res) => {
			let params = _.extend(req.params || {}, req.query || {}, req.body || {});
			let answer = await endpoint.execute(params, req.files);

			res.status(answer.getStatus()).send(answer.toJson());
		});
	} else if (endpoint.getType() == Endpoint.TYPE_PUT) {
		app.put(link, async (req, res) => {
			let params = _.extend(req.params || {}, req.query || {}, req.body || {});
			let answer = await endpoint.execute(params);

			res.status(answer.getStatus()).send(answer.toJson());
		});
	} else if (endpoint.getType() == Endpoint.TYPE_DELETE) {
		app.delete(link, async (req, res) => {
			let params = _.extend(req.params || {}, req.query || {}, req.body || {});
			let answer = await endpoint.execute(params);

			res.status(answer.getStatus()).send(answer.toJson());
		});
	}
}

app.get('*', async (req, res) => {
	if (!req.url.startsWith('/api')) {
		let filePath = global.serverDirectory + req.url;
		if (fs.existsSync(filePath)) {
			res.download(filePath);
		} else res.status(404).send('Not found');
	}
});

app.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});