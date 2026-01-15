import { useEffect, useState } from 'react';

const PatchEntry = ({patch, isLast}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="patch-entry" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="patch-header">
                <span className="version-badge">v{patch.version}</span>
                <span className="patch-date">{patch.date}</span>
            </div>
            <h3 className="patch-title">{patch.title}</h3>
            
            {/* conditionally render list if expanded */}
            {isExpanded && (
                <ul className="patch-list fade-in-list">
                    {patch.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                    ))}
                </ul>
            )}
            {!isLast && <hr className="patch-divider" />}
        </div>
    );
};

const PatchNotes = ({isOpen, onClose, data}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="patch-overlay" onClick={onClose}>
            <div className="patch-content" onClick={(e) => e.stopPropagation()}>
                <h2>Patch Notes</h2>
                <button className="close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="patch-body" onClick={(e) => e.stopPropagation()}>
                {data.map((patch, index) => (
                    <PatchEntry
                        key={index}
                        patch={patch}
                        isLast={index === data.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default PatchNotes;