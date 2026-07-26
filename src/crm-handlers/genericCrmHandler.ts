import axios from 'axios';
import { LeadData } from '../services/crmRouter';

export const sendToGenericCrm = async (
  leadData: LeadData,
  crmUrl: string,
  crmToken: string
) => {
  console.log(`[CRM Handler] Processing lead for ${leadData.Website}:`, leadData.Email);
  
  const [firstName, ...lastNames] = (leadData.Name || '').split(' ');
  const lastName = lastNames.join(' ');

  const payload = {
    country_name: leadData.Country || 'ch',
    description: leadData.Message || leadData.Campaign || 'Lead from Google Sheets',
    phone: leadData.Phone || '', 
    email: leadData.Email || '',
    first_name: firstName || '',
    last_name: lastName || '',
    custom_fields: {
      Source_ID: leadData.Source || 'Google Sheets',
    }
  };

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
    
    console.log(`[CRM Handler] Success for ${leadData.Website}. Status:`, response.status);
    return { success: true, data: response.data };

  } catch (error: any) {
    console.error(`[CRM Handler] Error sending lead for ${leadData.Website}:`, error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};
