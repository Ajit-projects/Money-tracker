const express=require('express');
const cors=require('cors');
const app=express();
const {db}=require('./db/db');
const {readdirSync}=require('fs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const cron = require('node-cron');
const extractTransactionFromEmail = require('./utils/transactionParser');
const saveTransaction = require('./utils/saveTransaction');
const { google } = require('googleapis');
const session = require('express-session');
import * as dotenv from dotenv;


// require('./cron/checkEmails');

const CLIENT_ID =process.env.CLIENT_ID
const CLIENT_SECRET=process.env.SECRET_KEY
const REDIRECT_URI = process.env.CALL_BACK

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

require ('dotenv').config()

const PORT=process.env.PORT

// middlewares
app.use(express.json())
app.use(cors())


// app.get('/',(req,res) => {
//     res.send('hello world');
// })

// routes
readdirSync('./routes').map((route) => app.use('/api/v1',require('./routes/'+route)))
// base URL-/api/v1 which will appear after localhost:3000 so finally it look like localhost:3000/api/v1/ - represents root route.

app.post('/auth/google', async (req, res) => {
    const { tokenId } = req.body;
  
    try {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokenId,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { sub: userId, email } = payload;
  
      console.log(`User ID: ${userId}, Email: ${email}`);
  
      // Retrieve access token and store it in the session
      oauth2Client.setCredentials({ id_token: tokenId });
      req.session.tokens = oauth2Client.credentials;
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error verifying Google ID token:', error);
      res.status(500).json({ success: false, message: 'Authentication failed' });
    }
  });
  
  // Example route to check if OAuth was successful
  app.get('/', (req, res) => {
    if (req.session.tokens) {
      res.send('Authentication successful!');
    } else {
      res.send('<a href="/auth/google">Authenticate with Google</a>');
    }
  });
  
  // Cron job to check emails and extract transactions
  const checkEmails = async (tokens) => {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
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
    if (app.request && app.request.session.tokens) {
      checkEmails(app.request.session.tokens);
    } else {
      console.log('No tokens found in session');
    }
  });

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to a port :',PORT)
    })
}

server()





