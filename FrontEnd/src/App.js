import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Registerpage from './components/Registerpage';
import AdminDashboard from './components/AdminDashboard';
import TourGuideDashboard from './components/TourGuideDashboard'; // New Component
import AdvertiserPage from './components/AdvertiserPage';
import Preloader from './components/Preloader';
import SellerPage from './components/SellerPage';
import './App.css';
import GovornorDashboard from './components/GovornorDashboard';
import TouristDashboard from './components/TouristDashboard';
import ActivitiesPage from './components/ActivitiesPage';
import HistoricalPlacesPage from './components/HistoricalPlacesPage';
import ProductsPage from './components/ProductsPage';
import ItinerariesPage from './components/ItinerariesPage';


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
                                <li><a href="/register">Register</a></li>
                                <li><a href="/admin">Admin Dashboard</a></li>
                                <li><a href='/govornor'>Govornor Dashboard</a></li>
                                <li><a href="/tourguide">Tour Guide Dashboard</a></li>
                                <li><a href="/advertiser">Advertiser</a></li>
                                <li><a href="/seller">Seller</a></li>
                                <li><a href="/tourist">Tourist</a></li>
                            </ul>
                        </nav>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/register" element={<Registerpage />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/govornor" element={<GovornorDashboard />} />        
                            <Route path="/tourguide" element={<TourGuideDashboard />} />
                            <Route path="/advertiser" element={<AdvertiserPage />} />
                            <Route path="/seller" element={<SellerPage />} />
                            <Route path="/tourist" element={<TouristDashboard />} />
                            <Route path="/activities" element={<ActivitiesPage />} />
                            <Route path="/historical-places" element={<HistoricalPlacesPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/itineraries" element={<ItinerariesPage />} />
                        </Routes>
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;