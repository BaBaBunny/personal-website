import React from 'react';
import {Link} from 'react-router-dom';

function ArtsCrafts() {
    return (
        <section className="page-section">
            <Link to="/" className="back-button">
                <i className="fa solid fa-xmark"></i>
            </Link>
            <h1 className="title">Arts & Crafts</h1>
            <p>Here is where you'll find of my more artistic creations.</p>
        </section>
    );    
}

export default ArtsCrafts;