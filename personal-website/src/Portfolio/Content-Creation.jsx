import React from 'react';
import {HashLink as Link} from 'react-router-hash-link';

function ContentCreation() {
    return (
        <>
            <Link to="/#portfolio" className="back-button">
                    <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                <h1 className="title">Content Creation</h1>
                <p>Here is where you'll find my social media content.</p>
            </section>
        </>
    );    
};

export default ContentCreation;