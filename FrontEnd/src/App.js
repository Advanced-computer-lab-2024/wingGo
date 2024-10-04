<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
cd:// src/App.js
import React from 'react';
>>>>>>> Stashed changes
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import AdminDashboard from './components/AdminDashboard';
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
                            </ul>
                        </nav>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;