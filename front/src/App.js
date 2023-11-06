import React from 'react';
import './App.css';
import './styles/news.scss';
import 'font-awesome/css/font-awesome.min.css';
import Header from './pages/page_parts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsPage from './pages/news';
import NewsMyPage from './pages/mynews';
import NewAddPage from './pages/new_add';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' exact element={<NewsPage />} />
                <Route path='/news' element={<NewsPage />} />
                <Route path='/news/add' element={<NewAddPage />} />
                <Route path='/news/my' element={<NewsMyPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
            </Routes>
        </Router>
    );
}

export default App;