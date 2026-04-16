export default async function handler(req, res) {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    let profileUrl = "https://open.spotify.com/";

    try {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            profileUrl = profile?.external_urls?.spotify || profileUrl;
        }
    }
    catch (err) {
        console.error("Error fetching Spotify profile:", err);
    }

    const songResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (songResponse.status === 204 || songResponse.status > 400) {
        return res.status(200).json({
            isPlaying: false,
            profileUrl,
        });
    }

    const song = await songResponse.json();

    if (song.item == null) {
        return res.status(200).json({
            isPlaying: false,
            profileUrl,
        });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((artist) => artist.name).join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return res.status(200).json({
        isPlaying,
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
        profileUrl,
    });
}