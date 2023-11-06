import $ from "jquery"
import { useEffect } from "react";
import React from "react";
import Api from "../utils/api";
import Cookies from 'universal-cookie';

function onFormSubmit(event) {
    event.preventDefault();

    let formData = {};
    let dataArray = $('#registerForm').serializeArray();
    dataArray.forEach(item => {
        if (formData.hasOwnProperty(item.name)) {
            if (!Array.isArray(formData[item.name])) formData[item.name] = [formData[item.name]];
            formData[item.name].push(item.value);
        } else formData[item.name] = item.value;
    });

    let data = {
        login: formData['login'],
        password: formData['password'],
    };

    Api.executePostMethod('users', data)
        .then(answer => answer.json())
        .then(answer => {
            if (answer.code !== 1) throw new Error(answer.message);

            const cookies = new Cookies();
            cookies.set('token', answer.token);
            window.location.replace("/news");
        })
        .catch(err => console.log(err));
}

const RegisterPage = () => {
    useEffect(() => {

    }, []);

    return (
        <div class="rendered-form">
            <form action="#" method="GET" id="registerForm" onSubmit={onFormSubmit}>
                <div class="">
                    <h2 access="false" id="control-2575734">Login page</h2></div>
                <div class="formbuilder-text form-group field-login">
                    <label for="login" class="formbuilder-text-label">Login<span class="formbuilder-required">*</span></label>
                    <input type="text" placeholder="Enter your login" class="form-control" name="login" maxlength="256" id="login" required="required" aria-required="true" />
                </div>
                <div class="formbuilder-text form-group field-password">
                    <label for="password" class="formbuilder-text-label">Password<span class="formbuilder-required">*</span></label>
                    <input type="password" placeholder="Enter your password" class="form-control" name="password" maxlength="256" id="password" required="required" aria-required="true" />
                </div>
                <div class="formbuilder-button form-group field-button-1699215453339">
                    <button type="submit" class="btn-success btn" value="Register">Register</button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;