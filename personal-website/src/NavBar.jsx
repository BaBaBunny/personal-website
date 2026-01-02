import { HashLink } from "react-router-hash-link";
import React, {useState, useEffect} from 'react';

const NavBar = () => {
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setHasScrolled(true);
            }
            else {
                setHasScrolled(False);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []);

    return(
        <div className = "navbar">
            <nav classname={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <ul>
                    <li><HashLink smooth to="/#home">Home</HashLink></li>
                    <li><HashLink smooth to="/#about">About</HashLink></li>
                    <li><HashLink smooth to="/#resume">Resume</HashLink></li>
                    <li><HashLink smooth to="/#portfolio">Portfolio</HashLink></li>
                    <li><HashLink smooth to="/#contact">Contact</HashLink></li>
                </ul>
            </nav>
        </div>
    );
};

export default NavBar;