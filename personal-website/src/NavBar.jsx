import {HashLink} from "react-router-hash-link";
import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const NavBar = () => {
    const [hasScrolled, setHasScrolled] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 75) {
                setHasScrolled(true);
            }
            else {
                setHasScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []);

    const isMainPage = location.pathname="/";
    const navbarClass = (!isMainPage || scrolled) ? 'navbar scrolled' : 'navbar';

    return(
        <nav className={`navbar ${hasScrolled ? 'scrolled' : ''}`}>
            <ul>
                <li><HashLink smooth to="/#home">Home</HashLink></li>
                <li><HashLink smooth to="/#about">About</HashLink></li>
                <li><HashLink smooth to="/#resume">Resume</HashLink></li>
                <li><HashLink smooth to="/#portfolio">Portfolio</HashLink></li>
                <li><HashLink smooth to="/#contact">Contact</HashLink></li>
            </ul>
        </nav>
    );
};

export default NavBar;