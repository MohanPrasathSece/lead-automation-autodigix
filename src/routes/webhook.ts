import { Router } from 'express';
import { crmRouter } from '../services/crmRouter.js';

const router = Router();

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const rawData = req.body;

    // Map Facebook Lead format to our internal LeadData format if necessary
    let extractedWebsite = rawData.Website;
    if (!extractedWebsite && rawData.form_name) {
      extractedWebsite = String(rawData.form_name)
        .replace(/\b\d{2}-\d{2}-\d{4}\b/g, '') // Remove date like 27-07-2026
        .replace(/\bform\b/gi, '')             // Remove the word 'Form'
        .trim();
    }

    if (!extractedWebsite) {
      return res.status(400).json({ error: 'Missing required field: Website or form_name' });
    }

    const leadData = {
      Website: extractedWebsite,
      Name: rawData.Name || rawData.full_name || '',
      Phone: rawData.Phone || (rawData.phone ? String(rawData.phone).replace(/^p:/i, '') : ''),
      Email: rawData.Email || rawData.email || '',
      Country: rawData.Country || rawData.country || '',
      Campaign: rawData.Campaign || rawData.campaign_name || '',
      Source: rawData.Source || rawData.platform || '',
      Message: rawData.Message || '',
      ...rawData // Pass along any other fields
    };

    console.log(`[Webhook] Received new lead for website: ${leadData.Website}`);

    // Route the lead to the appropriate CRM
    const result = await crmRouter(leadData);

    if (result.success) {
      return res.status(200).json({ message: 'Lead routed successfully', details: result });
    } else {
      return res.status(500).json({ error: 'Failed to route lead', details: result });
    }
  } catch (error: any) {
    console.error('[Webhook Error]', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
