import AttachmentSchema from "./attachment";

class NewSchema {
    /**@type {string}*/
    id;
    /**@type {string}*/
    title;
    /**@type {string}*/
    author;
    /**@type {string}*/
    description;
    /**@type {Date}*/
    modified;
    /**@type {Date}*/
    publication_date;
    /**@type {Array<AttachmentSchema>}*/
    images;

    constructor(data) {
        this.id = data._id;
        this.title = data.title;
        this.author = data.author;
        this.description = data.description;
        this.modified = new Date(data.modified);
        this.publication_date = new Date(data.publication_date);

        let attachments = [];
        data.images.forEach(item => attachments.push(new AttachmentSchema(item)));
        this.images = attachments;
    }
};

export default NewSchema;