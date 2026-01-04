import queensLogo from './assets/queens-logo.png'
import laurelHeightsLogo from './assets/laurel-heights-logo.png'

function Resume() {
    return (
        <section id = "resume" className = "page-section">
            <h1 className="title">Resume</h1>
            <div className="resume-grid">
                <div className="resume-left">
                    <h2>Experience</h2>
                    <ul className="exp-list">
                        <li>please hire me</li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div className="resume-right">
                    <div className="edu-section">
                        <h2>Education</h2>
                        <div className="edu-card">
                            <div className="edu-logo">
                                <img src={queensLogo} alt="Queen's University"/>
                            </div>
                            <div className="edu-content">
                                <h3>Queen's University</h3>
                                <p className="edu-date">Fall 2024 - Present</p>
                                <p className="edu-desc">Bachelor's of Computing (Honours) in Computing</p>
                            </div>
                        </div>
                        <div className="edu-card">
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
        
                    <div className="skills-section">
                        <h2>Skills</h2>
                        <ul className="skills-list">
                            <li>Web Development - JavaScript, React, HTML, CSS</li>
                            <li>Programming Languages - Python, Java, C</li>
                            <li>VS Code for as Text Editor, Figma for UI</li>
                            <li>Game Development - Unity</li>
                            <li>DaVinci Resolve for video production</li>
                            <li>Blender for 3D assets & animations</li>
                            <li>Krita or any drawing softwares</li>
                            <li>Pixlr or any photo editing/creation softwares</li>
                        </ul>
                    </div> 
                </div>
            </div>
        </section>
    );
};

export default Resume;