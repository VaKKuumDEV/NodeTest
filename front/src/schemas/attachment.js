class AttachmentSchema {
    /**@type {string}*/
    id;
    /**@type {string}*/
    local_path;
    /**@type {string}*/
    original_name;
    /**@type {Date}*/
    date;

    constructor(data) {
        this.id = data._id;
        this.local_path = data.local_path;
        this.original_name = data.original_name;
        this.date = new Date(data.date);
    }
};

export default AttachmentSchema;