// Vercel Serverless Function: Link-Based Member Work Submissions API Route
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { taskId, memberId, memberName, linkUrl, linkType, notes } = req.body || {};

    if (!linkUrl) {
      return res.status(400).json({ success: false, message: 'Submission link URL is required.' });
    }

    const newSubmission = {
      id: `sub-${Date.now()}`,
      taskId,
      memberId,
      memberName,
      linkUrl,
      linkType: linkType || 'GitHub Repository',
      notes: notes || '',
      submittedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Submission recorded successfully on Vercel backend api/submissions',
      submission: newSubmission
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      status: 'Submissions API ready on Vercel backend.'
    });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
