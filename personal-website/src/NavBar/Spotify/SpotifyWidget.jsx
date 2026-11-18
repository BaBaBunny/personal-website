import { useEffect, useState } from "react";
import './SpotifyWidget.css';

export default function SpotifyWidget({ compact = false }) {
    const [song, setStong] = useState(null);
    const spotifyProfileUrl = song?.profileUrl || "https://open.spotify.com/user/214pgth4sdcdcx4euk73yzcvy?si=47325f27b0c74566";

    useEffect(() => {
        const fetchSong = () => {
            fetch('/api/spotify')
                .then((res) => res.json())
                .then((data) => {
                    setStong(data);
                })
                .catch((err) => {
                    console.error("Error fetching Spotify data:", err);
                });
        };
        
        fetchSong();

        const interval = setInterval(fetchSong, 10000); //refresh time

        return () => clearInterval(interval);
    }, []);

    if (!song || !song.isPlaying) {
        if (compact) {
            return (
                <a
                    href={spotifyProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spotify-widget compact not-playing"
                    aria-label="Open Spotify profile"
                >
                    <i className="fa-brands fa-spotify" aria-hidden="true"></i>
                </a>
            );
        }

        return (
            <a
                href={spotifyProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-widget not-playing"
                aria-label="Open Spotify profile"
            >
                <i className="fa-brands fa-spotify" aria-hidden="true"></i>
            </a>
        );
    }

    if (compact) {
        return (
            <span className="spotify-compact-wrapper">
                <a
                    href={song.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spotify-widget compact"
                    aria-label={`Now playing: ${song.title} by ${song.artist}`}
                >
                    <img
                        src={song.albumImageUrl}
                        alt={song.album}
                        className={`spotify-cover ${!song.isPlaying ? 'paused' : ''}`}
                    />
                </a>
                <span className="spotify-track-popover" role="tooltip">
                    <span className="spotify-track-title">{song.title}</span>
                    <span className="spotify-track-artist">{song.artist}</span>
                </span>
            </span>
        );
    }

    return (
        <div className="spotify-widget">
            <img
                src={song.albumImageUrl}
                alt={song.album}
                className={`spotify-cover ${!song.isPlaying ? 'paused' : ''}`}
            />
            <div className="spotify-info">
                <a href={song.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spotify-title"
                >
                    {song.title}
                </a>
                <span className="spotify-artist">{song.artist}</span>
            </div>
        </div>
    );
}