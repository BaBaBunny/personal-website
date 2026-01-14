
const PatchNotes = ({isOpen, onClose, data}) => {
    if (!isOpen) return null;

    return (
        <div className="patch-overlay" onClick={onClose}>
            <div className="patch-content">
                <h2>Patch Notes</h2>
                <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="patch-body">
                {data.map((patch, index) => (
                    <div key={index} className="patch-entry">
                        <div className="patch-header">
                            <span className="version-badge">v{patch.version}</span>
                            <span className="patch-date">{patch.date}</span>
                        </div>
                        <h3 className="patch-title">{patch.title}</h3>
                        <ul className="patch-list">
                            {patch.changes.map((change, i)=> (
                                <li key={i}>{change}</li>
                            ))}
                        </ul>
                        {index < data.length - 1 && <hr className="patch-divider" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatchNotes;