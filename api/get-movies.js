export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');

    const apiKey = process.env.TMDB_API_KEY;
    const searchQuery = request.query.q;

    try {
        let url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
        
        if (searchQuery) {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`;
        }

        const apiRes = await fetch(url);
        if (!apiRes.ok) throw new Error('Failed to fetch from TMDB');
        
        const data = await apiRes.json();
        return response.status(200).json(data.results);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
