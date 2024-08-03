// cron/checkEmails.js
const cron = require('node-cron');
const { google } = require('googleapis');
const extractTransactionFromEmail = require('../utils/transactionParser');
const saveTransaction = require('../utils/saveTransaction');

const checkEmails = async (tokens) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: 'me', q: 'from:noreply@bank.com' });

  if (res.data.messages) {
    for (const message of res.data.messages) {
      const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
      const transaction = extractTransactionFromEmail(msg);
      await saveTransaction(transaction);
    }
  }
};

// Schedule the job to run every 15 minutes
cron.schedule('*/15 * * * *', () => {
  const app = require('../app'); // Import the app to access the session
  const tokens = app.request.session.tokens; // Retrieve tokens from session
  if (tokens) {
    checkEmails(tokens);
  } else {
    console.log('No tokens found in session');
  }
});
