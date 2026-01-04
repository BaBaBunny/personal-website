import React from 'react';
import {Link} from 'react-router-dom'

function Projects() {
    return (
        <>
            <Link to="/#portfolio" className="back-button">
                    <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                <h1 className="title">Projects</h1>
                <p>Here is where you'll find of my program-related creations.</p>
            </section>
        </>
    );    
}

export default Projects;