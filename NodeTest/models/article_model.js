var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { AttachmentModel } = require('./attachment_model');

var Article = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    images: [AttachmentModel.schema],
    modified: { type: Date, default: Date.now },
    publication_date: { type: Date, default: Date.now },
});

Article.methods.isPublicated = function () {
    return this.publication_date >= new Date();
};

Article.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

Article.set('toObject', { getters: true });
Article.set('toJSON', { getters: true });

var ArticleModel = mongoose.model('Article', Article);
module.exports.ArticleModel = ArticleModel;