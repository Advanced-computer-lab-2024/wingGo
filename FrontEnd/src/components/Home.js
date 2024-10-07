import React from 'react';
import '../styling/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <header className="hero-section">
                <h1>Welcome to WingGo</h1>
                <p>Your all-in-one travel platform for effortless and exciting vacation planning!</p>
            </header>
            <section className="features-section">
                <h2>Key Features</h2>
                <ul>
                    <li>
                        <h3>Personalized Travel Planning</h3>
                        <p>Tailor your vacation with preferences like historic sites, beaches, shopping, and budget-friendly options.</p>
                    </li>
                    <li>
                        <h3>Seamless Booking</h3>
                        <p>Book flights, hotels, and transportation directly within the app through trusted third-party services—no redirects, just easy and fast bookings.</p>
                    </li>
                    <li>
                        <h3>Smart Budgeting</h3>
                        <p>Get activity suggestions that fit your remaining budget after booking flights and hotels, with transportation costs included for stress-free planning.</p>
                    </li>
                    <li>
                        <h3>Discover Local Gems</h3>
                        <p>Explore curated activities, museums, and historical landmarks, complete with ticket prices and directions.</p>
                    </li>
                    <li>
                        <h3>Real-Time Notifications</h3>
                        <p>Stay updated on upcoming events and activities you’ve booked with instant app and email alerts.</p>
                    </li>
                    <li>
                        <h3>Tour Guides & Itineraries</h3>
                        <p>Find expert-guided tours or create your own adventure with customizable itineraries and detailed activity breakdowns.</p>
                    </li>
                    <li>
                        <h3>Exclusive Gift Shop</h3>
                        <p>Don’t forget to stop by our in-app gift shop for souvenirs and unique local items to remember your trip by!</p>
                    </li>
                </ul>
            </section>
            <footer className="footer-section">
                <p>Start your vacation with us today and experience the world in a whole new way!</p>
            </footer>
        </div>
    );
};

export default Home;