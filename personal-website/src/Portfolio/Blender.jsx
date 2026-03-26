import React from 'react';
import {HashLink as Link} from 'react-router-hash-link';

function Blender() {
    return (
        <>
            <Link to="/#portfolio" className="back-button">
                <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                
                <h1 className="title">Blender Projects</h1>
                <p>Here is where you'll find my 3D modeling and animation projects.</p>
            </section>
        </>
    );    
};

export default Blender;