const express = require('express');
const router  = express.Router();
const { getFeed } = require('../../services/instagram.service');

router.get('/feed', async (_req, res) => {
  try {
    const result = await getFeed();

    if (!result) {
      return res.status(503).json({ success: false, message: 'Instagram not configured yet.' });
    }

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Instagram feed error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch Instagram feed.' });
  }
});

module.exports = router;
