import { useEffect, useState } from "react";
import Api from "../utils/api";
import AttachmentSchema from '../schemas/attachment';
import Cookies from 'universal-cookie';
import $ from "jquery";

var uploadedFiles = [];

function onFormSubmit(event) {
    const cookies = new Cookies();
    let token = cookies.get('token');

    event.preventDefault();

    let formData = {};
    let dataArray = $('#newAddForm').serializeArray();
    dataArray.forEach(item => {
        if (formData.hasOwnProperty(item.name)) {
            if (!Array.isArray(formData[item.name])) formData[item.name] = [formData[item.name]];
            formData[item.name].push(item.value);
        } else formData[item.name] = item.value;
    });

    let files = [];
    for (let fileIndex in uploadedFiles) files.push(uploadedFiles[fileIndex].id);

    let data = {
        title: formData['title'],
        description: formData['description'],
        token: token,
    };

    if (files.length > 0) data.files = files;

    Api.executePostMethod('news', data)
        .then(answer => answer.json())
        .then(answer => {
            if (answer.code !== 1) throw new Error(answer.message);

            window.location.replace("/news");
        })
        .catch(err => console.log(err));
}

function onUploaderFilesChange(event) {
    if (window.FormData === undefined) throw new Error('Your browser not supports FormData');
    if ($('#pictures')[0].files.length === 0) return;

    let formData = new FormData();
    $.each($('#pictures')[0].files, function (key, input) {
        formData.append('files', input);
    });

    Api.executePostMethod('upload', formData)
        .then(answer => answer.json())
        .then(answer => {
            if (answer.code !== 1) throw new Error(answer.message);
            let attachments = [];
            answer.files.forEach(item => attachments.push(new AttachmentSchema(item)));
            uploadedFiles = attachments;
        })
        .catch(err => console.log(err));
}

const NewAddPage = () => {
    useEffect(() => {
        
    }, []);

    return (
        <div class="rendered-form">
            <form method="POST" id="newAddForm" onSubmit={onFormSubmit}>
                <div class="formbuilder-text form-group field-title">
                    <label for="title" class="formbuilder-text-label">Title<span class="formbuilder-required">*</span></label>
                    <input type="text" placeholder="Enter new title" class="form-control" name="title" maxlength="128" id="title" required="required" aria-required="true" />
                </div>
                <div class="formbuilder-textarea form-group field-description">
                    <label for="description" class="formbuilder-textarea-label">New description<span class="formbuilder-required">*</span></label>
                    <textarea type="textarea" class="form-control" name="description" maxlength="512" rows="5" id="description" required="required" aria-required="true"></textarea>
                </div>
                <div class="formbuilder-file form-group field-pictures">
                    <label for="pictures" class="formbuilder-file-label">Pictures</label>
                    <input type="file" placeholder="Load a pictures" class="form-control" multiple="true" id="pictures" accept="image/png, image/gif, image/jpeg" onChange={onUploaderFilesChange} />
                </div>
                <div class="">
                    <button type="submit" class="btn-success btn" value="Add a new" id="control-4012824">Add a new</button>
                </div>
            </form>
        </div>
    );
};

export default NewAddPage;