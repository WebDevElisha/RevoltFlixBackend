export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const query = req.query.q;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query) {
        return res.status(200).json([]);
    }

    if (!apiKey) {
        return res.status(500).json({ error: "YouTube API key not configured on backend." });
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        const formattedItems = data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            poster_path: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url,
            channelTitle: item.snippet.channelTitle
        }));

        return res.status(200).json(formattedItems);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch from YouTube API." });
    }
}
