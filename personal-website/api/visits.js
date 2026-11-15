export default async function handler(req, res) {
  const action = req.query.action === 'up' ? '/up' : '';
  const url = `https://api.counterapi.dev/v2/bababunny/bababunny-visits${action}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.VITE_COUNTER_API_TOKEN}`,
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch counter' });
  }
}