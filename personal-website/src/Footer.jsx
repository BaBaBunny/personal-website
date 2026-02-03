import { useEffect, useRef, useState } from 'react';
import { patchnotes } from './patchData';
import PatchNotes from './PatchNotes';


const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isPatchOpen, setIsPatchOpen] = useState(false);
    const [visitCount, setVisitCount] = useState('...');
    const hasRan = useRef(false);

    const latestVersion = patchnotes.length > 0 ? patchnotes[patchnotes.length - 1].version : "v1.0";

    useEffect(() => {
        if (hasRan.current) return;
        hasRan.current = true;

        const namespace = 'bababunny-website-v1';
        const key = 'visits';
        const storageKey = 'page_viewed';

        const hasVisited = localStorage.getItem(storageKey);

        if (!hasVisited) {
            console.log("New visitor detected! Incrementing count...")

            localStorage.setItem(storageKey, 'true');

            fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
                .then(response => response.json())
                .then(data => setVisitCount(data.count))
                .catch(err => console.error(err));
        } else {
            console.log("Welcome back! Fetching count...");

            fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/`)
                .then(response => response.json())
                .then(data => setVisitCount(data.count))
                .catch(err => console.error(err));
        }
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
                    Unique Visitors: {visitCount}
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