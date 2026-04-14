import { useEffect, useState } from "react";
import './SpotifyWidget.css';

export default function SpotifyWidget() {
    const [song, setStong] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSong = () => {
            fetch('/api/spotify')
                .then((res) => res.json())
                .then((data) => {
                    setStong(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching Spotify data:", err);
                    setLoading(false);
                });
        };
        
        fetchSong();

        const interval = setInterval(fetchSong, 10000); //refresh time

        return () => clearInterval(interval);
    }, []);

    if (!song || !song.isPlaying) {
        return <p>not listening rn :|</p>;
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
                    className="spotify-song-link"
                >
                    {song.title}
                </a>
                <span className="spotify-artist">{song.artist}</span>
            </div>
        </div>
    );
}