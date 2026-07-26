import axios from 'axios';
import type { LeadData } from '../services/crmRouter.js';

export const sendToGenericCrm = async (
  leadData: LeadData,
  crmUrl: string,
  crmToken: string
) => {
  const website = leadData.Website || 'Unknown Website';
  const email = leadData.Email || '';
  const phone = leadData.Phone || '';
  const country = leadData.Country || 'ch';

  const [firstName, ...lastNames] = (leadData.Name || '').trim().split(' ');
  const lastName = lastNames.join(' ');

  const payload = {
    country_name: country,
    description: leadData.Message || leadData.Campaign || 'Lead from Google Sheets',
    phone: phone, 
    email: email,
    first_name: firstName || '',
    last_name: lastName || '',
    custom_fields: {
      Source_ID: leadData.Source || 'Google Sheets',
    }
  };

  const tokenSummary = crmToken ? `${crmToken.substring(0, 10)}... (${crmToken.length} chars)` : 'MISSING_TOKEN';

  console.log(`\n------------------------------------------------------`);
  console.log(`[CRM Request] Preparing transmission for "${website}"`);
  console.log(`  -> Target URL:    ${crmUrl}`);
  console.log(`  -> Token Used:    ${tokenSummary}`);
  console.log(`  -> Lead Contact:  ${email} | Phone: ${phone} | Country: ${country}`);
  console.log(`  -> Payload JSON:`, JSON.stringify(payload, null, 2));
  console.log(`------------------------------------------------------`);

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass SSL for specific CRM APIs

    const response = await axios.post(crmUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Token': crmToken,
        'Authorization': `Bearer ${crmToken}`,
        'X-Affiliate-Token': crmToken,
        'x-token': crmToken
      }
    });
    
    console.log(`\n[CRM Accepted] Success for "${website}"!`);
    console.log(`  -> HTTP Status:   ${response.status} ${response.statusText || ''}`);
    console.log(`  -> Response Body:`, JSON.stringify(response.data, null, 2));
    console.log(`------------------------------------------------------\n`);
    
    return { success: true, status: response.status, data: response.data };

  } catch (error: any) {
    const status = error.response?.status || 'N/A';
    const errorData = error.response?.data || error.message;

    console.error(`\n[CRM Rejected / Error] Transmission failed for "${website}"!`);
    console.error(`  -> Target URL:    ${crmUrl}`);
    console.error(`  -> HTTP Status:   ${status}`);
    console.error(`  -> Error Detail:`, typeof errorData === 'object' ? JSON.stringify(errorData, null, 2) : errorData);
    console.error(`  -> Exception Msg:`, error.message);
    console.error(`------------------------------------------------------\n`);

    return { 
      success: false, 
      status: status,
      error: typeof errorData === 'object' ? JSON.stringify(errorData) : errorData,
      exception: error.message 
    };
  }
};
