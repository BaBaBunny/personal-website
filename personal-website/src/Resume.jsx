import queensLogo from './assets/queens-logo.png'
import laurelHeightsLogo from './assets/laurel-heights-logo.png'

function Resume() {
    return (
        <section id = "resume" className = "page-section">
            <h1 className="title">Resume</h1>
            <div className="resume-grid">
                <div className="resume-left">
                    <h2>Experience</h2>
                    <p>N/A, not found.</p>
                    <p>Status: homeless</p>
                </div>
                <div className="resume-right">
                    <div className="resume-top">
                        <h2>Education</h2>
                        <div className="edu-section">
                            <div className="edu-logo">
                                <img src={queensLogo} alt="Queen's University"/>
                            </div>
                            <div className="edu-content">
                                <h3>Queen's University</h3>
                                <p className="edu-date">Fall 2024 - Present</p>
                                <p className="edu-desc">Bachelor's of Computing (Honours) in Computing</p>
                            </div>
                            <div className="edu-logo">
                                <img src={laurelHeightsLogo} alt="Laurel Heights Secondary School"/>
                            </div>
                            <div className="edu-content">
                                <div className="edu-header">
                                    <h3>Laurel Heights Secondary School</h3>
                                    <span className="edu-date">September 2020 - June 2024</span>
                                </div>
                                <p className="edu-desc">Secondary School</p>
                            </div>
                        </div>
                    </div>
                    <div className="resume-bottom">
                        <h2>Skills</h2>
                        <p>my skills</p>
                    </div> 
                </div>
            </div>
        </section>
    );
};

export default Resume;