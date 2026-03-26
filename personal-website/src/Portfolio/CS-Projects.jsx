import React from 'react';
import {HashLink as Link} from 'react-router-hash-link';

function CS() {
    return (
        <>
            <Link to="/#portfolio" className="back-button">
                <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                
                <h1 className="title">CS Projects</h1>
                <p>Here is where you'll find my programming projects.</p>
            </section>
        </>
    );    
};

export default CS;