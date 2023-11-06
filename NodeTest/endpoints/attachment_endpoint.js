const { Endpoint, EndpointAnswer, EndpointError } = require('./endpoint');
const { AttachmentModel } = require('../models/attachment_model');
const { TextUtils } = require('../utils/text_utils');
const mongoose = require('mongoose');
const fs = require('fs');

class AttachmentsUploadEndpoint extends Endpoint {
	constructor() {
		super(Endpoint.TYPE_POST, 'upload', null);
	}

	/**
	 * 
	 * @param {any} params
	 * @param {import('express-fileupload').FileArray} files
	 * @returns {Promise<EndpointAnswer>}
	 */
	async execute(params, files) {
		try {
			if (files == undefined) throw new EndpointError('Files not sent', 400);
			if (!Array.isArray(files.files)) files.files = [files.files];

			let uploadedFiles = [];
			for (let fileArrayIndex in files.files) {
				let file = files.files[fileArrayIndex];

				let ext = file.name.split('.').pop().toLowerCase();
				let fileDir = global.serverDirectory + '/' + global.uploadDirectory + '/' + ext;
				if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });
				let fileName = TextUtils.generateString(10) + '.' + ext;

				file.mv(fileDir + '/' + fileName);

				let attachment = new AttachmentModel({
					local_path: fileName,
					original_name: file.name,
				});

				await attachment.save();
				uploadedFiles.push(attachment);
			}

			return new EndpointAnswer(1, 'Files uploaded', { files: uploadedFiles });
		} catch (err) {
			if (err.name == 'ValidationError') return new EndpointAnswer(0, 'Validation error', {}, 400);
			else if (err.name == 'EndpointError') return new EndpointAnswer(0, err.message, {}, err.getCode());
			else return new EndpointAnswer(0, 'Server error', {}, 500);
		}
	}
}

module.exports.AttachmentsUploadEndpoint = AttachmentsUploadEndpoint;
module.exports.attachmentsEndpoints = [
	new AttachmentsUploadEndpoint(),
];