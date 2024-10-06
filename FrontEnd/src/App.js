import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import AdminDashboard from './components/AdminDashboard';
import TourGuideDashboard from './components/TourGuideDashboard'; // New Component
import AdvertiserPage from './components/AdvertiserPage';
import Preloader from './components/Preloader';
import './App.css';

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Router>
            <div className="App">
                {loading ? (
                    <Preloader />
                ) : (
                    <>
                        <nav>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/about">About</a></li>
                                <li><a href="/admin">Admin Dashboard</a></li>
                                <li><a href="/tourguide">Tour Guide Dashboard</a></li>
                                <li><a href="/advertiser">Advertiser</a></li>
                            </ul>
                        </nav>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/tourguide" element={<TourGuideDashboard />} />
                            <Route path="/advertiser" element={<AdvertiserPage />} />
                        </Routes>
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;