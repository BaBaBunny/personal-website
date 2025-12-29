import React, {useState} from 'react';

function Contact() {
    const[formInfo, setFormInfo] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const handleChange = (e) => {
        const{name, value} = e.target;
        setFormInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form has been submitted:", formInfo);
        alert("Message Sent!");
        setFormInfo({name: '', email: '', subject: '', message: ''});
    };

    return (
        <section id="contact" className="page-section">
            <h1 className="title">Contact</h1>
            <p>get in and touch me</p>

            <div className="contact-box">
                <div className="contact-left">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
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

                        <div className="form-group">
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

                        <div className="form-group">
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

                        <div className="form-group">
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

                        <button type="send" className="send-button">Send</button>
                    </form>
                </div>

                /* right column */
                <div className="contact-right">
                    <div className="socials-box">
                        <h2>Socials</h2>
                        <p>All my active socials:</p>
                        <ul className="social-links">
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
                                <a href="https://instagram.com/" target="_blank" rel="noreferrer">
                                    Instagram
                                </a>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;