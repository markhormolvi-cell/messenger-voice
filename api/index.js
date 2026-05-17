export default async function handler(req, res) {
  // 1. CORS Headers (Taa-ke extension se block na ho)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Pre-flight request handler
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Yahan aapka Asal Google Sheet URL chupa hua hoga!
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_1zadB5WtiQCqI5w7MuufNjZ8fFw3wqEmjQrvX575a6mSFye0sVJF-NChG43wU2nC/exec";

  try {
    const fetchResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      },
      // Vercel JSON body ko parse kar deta hai, is liye dobara stringify karte hain
      body: req.method === "POST" ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined,
    });
    
    const data = await fetchResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: "Vercel Bridge Error: " + error.toString() });
  }
}
