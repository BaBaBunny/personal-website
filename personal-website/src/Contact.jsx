import React, {useState, useRef} from 'react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
    const form = useRef();
    const [status, setStatus] = useState('');

    const [formInfo, setFormInfo] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

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
                    setFormInfo({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                    });
                    
                    setTimeout(() => setStatus(''), 3000);
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
            <p>Get in contact with me!</p>

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

                        {status === 'success' && (
                            <p style={{color: 'green', marginTop: '10px'}}>
                                Message sent successfully!
                            </p>
                        )}

                        {status === 'error' && (
                            <p style={{color: 'red', marginTop: '10px'}}>
                                Failed to send. Please try again.
                            </p>
                        )}
                    </form>
                </div>

                {/* right column */}
                <div className="contact-right">
                    <h2>Socials</h2>
                    <p>Here is where you'll find me digitally!</p>
                    <ul className="socials-list">
                        <li>
                            <a href="https://github.com/BaBaBunny" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-btn github"
                            >
                                <i className="fa-brands fa-github"></i> GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/bababunny" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-btn linkedin"
                            >
                                <i className="fa-brands fa-linkedin"></i> LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/at_bababunny" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-btn instagram"
                            >
                                <i className="fa-brands fa-instagram"></i> Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://youtube.ca/bababunny"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-btn youtube"
                            >
                                <i className="fa-brands fa-youtube"></i> YouTube
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Contact;