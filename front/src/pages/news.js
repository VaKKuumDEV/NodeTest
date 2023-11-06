import $ from "jquery";
import { useEffect, useState } from "react";
import React from "react";
import Api from "../utils/api";
import NewSchema from '../schemas/new';

/**
 * 
 * @param {NewSchema} article
 * @returns
 */
const NewArticle = (article) => {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let dateOptions = { timezone: timeZone, year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    let imageLink = 'http://itchief.ru/assets/demo/image/image1-800-530.jpg';
    if (article.images.length > 0) imageLink = article.images[0].local_path;

    return (
        <>
            <div class="row">
                <div class="col-md-8">
                    <div class="wp-block property list">
                        <div class="wp-block-body">
                            <div class="wp-block-img">
                                <a href="#">
                                    <img src={ imageLink } alt=""/>
                                </a>
                            </div>
                            <div class="wp-block-content">
                                <small>
                                    <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> {(new Date(article.publication_date)).toLocaleString('en', dateOptions) }</small>
                                <h4 class="content-title">{ article.title }</h4>
                                <p class="description">{ article.description }</p>
                                <span class="pull-right">
                                    <span class="capacity">
                                        <i class="fa fa-user"></i> {article.author}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const NewsPage = () => {
    const [articles, setData] = useState([]);
    useEffect(() => {
        Api.executeGetMethod('news')
            .then(answer => answer.json())
            .then(answer => {
                if (answer.code !== 1) throw new Error(answer.message);
                let articles = [];
                answer.articles.forEach(item => articles.push(new NewSchema(item)));
                setData(articles);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div class="container">
            {articles.map(article => NewArticle(article))}
        </div>
    );
};

export default NewsPage;