import React from 'react';
import '../styling/About.css';

const About = () => {
    return (
        <div className="about-container">
            <header className="about-header">
                <h1>About WingGo</h1>
                <p>Discover more about our mission and values.</p>
            </header>
            <section className="about-content">
                <h2>Our Mission</h2>
                <p>
                    At WingGo, our mission is to make vacation planning effortless and exciting. We aim to provide a comprehensive travel platform that caters to all your travel needs, from booking flights and hotels to discovering local gems and managing your budget.
                </p>
                <h2>Our Values</h2>
                <ul>
                    <li>
                        <h3>Customer-Centric</h3>
                        <p>We prioritize our customers' needs and strive to provide the best travel experience possible.</p>
                    </li>
                    <li>
                        <h3>Innovation</h3>
                        <p>We continuously innovate to bring new features and improvements to our platform.</p>
                    </li>
                    <li>
                        <h3>Integrity</h3>
                        <p>We operate with honesty and transparency in all our dealings.</p>
                    </li>
                    <li>
                        <h3>Excellence</h3>
                        <p>We are committed to delivering excellence in every aspect of our service.</p>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default About;