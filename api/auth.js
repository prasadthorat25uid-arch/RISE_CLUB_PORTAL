// Vercel Serverless Function: Authentication API Route
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { prn, password } = req.body || {};

  if (!prn || !password) {
    return res.status(400).json({ success: false, message: 'PRN and Password are required.' });
  }

  // Simulated Vercel serverless authentication response
  return res.status(200).json({
    success: true,
    message: 'Authentication successful via Vercel backend api/auth',
    authenticatedPrn: prn,
    timestamp: new Date().toISOString()
  });
}
