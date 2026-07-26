import { Router } from 'express';
import { crmRouter } from '../services/crmRouter';

const router = Router();

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData || !leadData.Website) {
      return res.status(400).json({ error: 'Missing required field: Website' });
    }

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
