import React, {useState, useRef} from 'react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
    const form = useRef();
    const [status, setStatus] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('sending');

        const serviceID = import.meta.env.VITE_SERVICE_ID;
        const templateID = import.meta.env.VITE_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_PUBLIC_KEY;
        
        emailjs
            .sendForm(serviceID, templateID, form.current, {
                publicKey: publicKey,
            })
            .then(
                () => {
                    setStatus('success');
                    console.log('success');
                    e.target.reset();
                },
                (error) => {
                    setStatus('error');
                    console.log('failed...', error.text);
                },
            );
    };

    return (
        <section id="contact" className="page-section">
            <h1 className="title">Contact</h1>
            <p>get in and touch me</p>

            <div className="contact-box">
                <div className="contact-left">
                    <form className="contact-form" ref={form} onSubmit={sendEmail}>
                        <div className="form-box">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="enter your name"
                                value={formInfo.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-box">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="enter your email"
                                value={formInfo.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-box">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="main point"
                                value={formInfo.subject}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-box">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="leave your message here"
                                rows="5"
                                value={formInfo.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="send-button" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>

                {/* right column */}
                <div className="contact-right">
                    <h2>Socials</h2>
                    <p>All my active socials:</p>
                    <ul>
                        <li>
                            <a href="https://github.com/" target="_blank" rel="noreferrer">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/at_bababunny" target="_blank" rel="noreferrer">
                                Instagram
                            </a>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Contact;