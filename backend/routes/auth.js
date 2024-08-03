// routes/auth.js
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
import * as dotenv from 'dotenv';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_KEY,
  process.env.CALL_BACK
);

// Generate an OAuth URL and redirect the user to it
router.get('/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
  res.redirect(url);
});

// Handle the OAuth callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Save the tokens in the user's session or database
  req.session.tokens = tokens;

  res.redirect('/'); // Redirect to the main app
});

module.exports = router;
