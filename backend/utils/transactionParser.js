// utils/transactionParser.js
const extractTransactionFromEmail = (email) => {
    const emailBody = email.data.payload.parts[0].body.data;
    const decodedBody = Buffer.from(emailBody, 'base64').toString('utf-8');
  
    // Example regex patterns to extract transaction details
    const amountMatch = decodedBody.match(/Amount: \$(\d+\.\d{2})/);
    const dateMatch = decodedBody.match(/Date: (\d{4}-\d{2}-\d{2})/);
    const descriptionMatch = decodedBody.match(/Description: (.+)/);
  
    return {
      amount: parseFloat(amountMatch[1]),
      date: new Date(dateMatch[1]),
      description: descriptionMatch[1].trim(),
    };
  };
  
  module.exports = extractTransactionFromEmail;
  