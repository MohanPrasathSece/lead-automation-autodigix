/**
 * Google Apps Script for sending lead data to your Node.js backend.
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Replace all the code there with this file's contents.
 * 4. Update the `WEBHOOK_URL` below to point to your live backend (e.g., your Render/Railway URL) once it's deployed.
 * 5. Add a Trigger: 
 *    - Click the clock icon (Triggers) on the left sidebar.
 *    - Click "Add Trigger".
 *    - Choose function: `onEdit` or `onChange`.
 *    - Select event type: "On edit" or "On change".
 *    - Save and grant permissions.
 */

const WEBHOOK_URL = 'http://localhost:3000/api/leads'; // Update this to your deployed URL

function onEdit(e) {
  // We only want to trigger when a new row is added (e.g., by a form or pasting).
  
  if (!e) return;
  
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const row = range.getRow();
  
  // Example: Ignore changes to the header row
  if (row === 1) return;
  
  // Read all the headers to construct our JSON payload dynamically
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Only proceed if this looks like a new entry (e.g., it has a Website)
  const websiteIndex = headers.indexOf('Website');
  
  if (websiteIndex === -1 || !rowData[websiteIndex]) {
     // No Website specified, skip
     return;
  }
  
  let payload = {};
  
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i];
    if (key) {
      payload[key] = rowData[i];
    }
  }
  
  // Send data to backend
  sendDataToBackend(payload);
}

function sendDataToBackend(payload) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Don't crash the script if the server returns an error
  };
  
  try {
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log('Response Code: ' + response.getResponseCode());
    Logger.log('Response Body: ' + response.getContentText());
  } catch (error) {
    Logger.log('Error sending webhook: ' + error.toString());
  }
}
