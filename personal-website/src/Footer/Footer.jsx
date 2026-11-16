import { useEffect, useRef, useState } from 'react';
import { patchnotes } from '../PatchNotes/patchData';
import PatchNotes from '../PatchNotes/PatchNotes.jsx';
import './Footer.css';


const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isPatchOpen, setIsPatchOpen] = useState(false);
    const [visitCount, setVisitCount] = useState('...');
    const hasRan = useRef(false);

    const latestVersion = patchnotes.length > 0 ? patchnotes[patchnotes.length - 1].version : "v1.0";

    useEffect(() => {
        if (hasRan.current) return;
        hasRan.current = true;

        const storageKey = 'page_viewed';
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const hasVisited = localStorage.getItem(storageKey);

        let endpoint = '/api/visits';
        if (!hasVisited && !isLocal) {
            console.log("New visitor detected! Incrementing count...");
            localStorage.setItem(storageKey, 'true');
            endpoint = '/api/visits?action=up';
        } else {
            console.log("Welcome back! Fetching count...");
        }

        fetch(endpoint)
            .then((res) => res.json())
            .then((response) => {
                const count = response?.value ?? response?.data?.up_count ?? response?.count;
                if (count !== undefined) {
                    setVisitCount(count);
                }
            })
            .catch((err) => console.error("Visit fetch error:", err));
    }, []);

    return(
        <>
            <footer className="footer">
                <div className="footer-text">
                    <p>
                        &copy; {currentYear} BaBaBunny
                    </p>
                </div>

                <div className="footer-links">
                    <button className="footer-btn-link" onClick={() => setIsPatchOpen(true)}>
                        Patch Notes: v{latestVersion}
                    </button>
                </div>

                <span className="visitor-count">
                    Visitors: {visitCount}
                </span>
            </footer>

            <PatchNotes
                isOpen={isPatchOpen}
                onClose={() => setIsPatchOpen(false)}
                data={patchnotes}
            />
        </>
    );
};

export default Footer;