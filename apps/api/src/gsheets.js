// Import the Google APIs client library
import { google } from 'googleapis';
import { readFile } from 'fs/promises';

// Load your credentials
const credentials = JSON.parse(await readFile(new URL('../../terraform/credentials.json', import.meta.url)));

// Define the ID of the spreadsheet and the range of data you want to access
const spreadsheetId = '1wOU7ctxfB9gNGswTu6puq_7OerYQq-gUjiFnibuI4h0';
const range = 'Sheet1!A1:E10'; // Adjust the range as needed

// Authorize a client with credentials, then call the Google Sheets API
async function accessSpreadsheet() {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values;
        if (rows.length) {
            console.log('Data from the spreadsheet:');
            rows.forEach((row) => {
                console.log(row.join(', '));
            });
        } else {
            console.log('No data found.');
        }
    } catch (err) {
        console.error('The API returned an error:', err);
    }
}

accessSpreadsheet();