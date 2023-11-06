var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Attachment = new Schema({
    local_path: {
        type: String,
        required: true,
        get: val => getLink(val),
    },
    original_name: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

/**
 * 
 * @param {string} path
 * @returns
 */
function getLink(path) {
    if (path.startsWith('http://')) return path;
    let ext = path.split('.').pop().toLowerCase();
    return 'http://localhost:1337/' + global.uploadDirectory + '/' + ext + '/' + path;
}

Attachment.set('toObject', { getters: true });
Attachment.set('toJSON', { getters: true });

var AttachmentModel = mongoose.model('Attachment', Attachment);
module.exports.AttachmentModel = AttachmentModel;