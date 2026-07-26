import { sendToGenericCrm } from '../crm-handlers/genericCrmHandler.js';

export interface LeadData {
  Website: string;
  Name?: string;
  Phone?: string;
  Email?: string;
  Country?: string;
  Message?: string;
  Campaign?: string;
  Source?: string;
  [key: string]: any; 
}

export const crmRouter = async (leadData: LeadData) => {
  const website = (leadData.Website || '').toLowerCase().trim();

  // June CRM (inwo.crmcore.me - Alex-TC24)
  const CRM_CORE_URL = process.env.CRM_CORE_URL || 'https://inwo.crmcore.me/api/lead_management/api/affiliates';
  const CRM_CORE_TOKEN = process.env.CRM_CORE_TOKEN || process.env.CRM_TOKEN || 'AFF_1_92cbc1bc76284e19b711bab22587d75f';
  
  // July CRM (api.myinvesttrade.com - 20 Websites)
  const MYINVESTTRADE_URL = process.env.MYINVESTTRADE_URL || 'https://api.myinvesttrade.com/api/lead_management/api/affiliates';
  const MYINVESTTRADE_TOKEN = process.env.MYINVESTTRADE_TOKEN || 'AFF_1_697ac63e6f88cac9f990b1a5c4beaefd';

  console.log(`\n======================================================`);
  console.log(`[CRM Router] Evaluating route for website: "${leadData.Website}" (normalized: "${website}")`);
  console.log(`======================================================`);

  try {
    switch (website) {
      // ----------------------------------------------------
      // JUNE WEBSITES (using inwo.crmcore.me & CRM_CORE_TOKEN)
      // ----------------------------------------------------
      case 'vertexiq':
      case 'vertex':
      case 'nova ledger':
      case 'maison bloc':
      case 'elite chain ai':
      case 'cryptora':
      case 'aetheris crypto':
      case 'atlas ledger':
      case 'atlas ledger (17)':
      case 'aurore capital labs':
      case 'bulletin finance':
      case 'ciphera intelligence':
      case 'evlois journele':
      case 'finastra daily':
      case 'futuria network':
      case 'le grand rapport':
      case 'le temps moderne':
      case 'le moderne capitale':
      case 'le moderne capitale (16)':
      case 'lumiere chain':
      case 'monde quotidien':
      case 'orbit x':
      case 'orbit x (19)':
      case 'european-insight':
      case 'european insight':
        console.log(`[CRM Router] Matched June CRM group for "${website}". Target: CRM Core.`);
        return await sendToGenericCrm(leadData, CRM_CORE_URL, CRM_CORE_TOKEN);
        
      // ----------------------------------------------------
      // JULY WEBSITES (using api.myinvesttrade.com & MYINVESTTRADE_TOKEN)
      // ----------------------------------------------------
      case 'the report desk':
      case 'avenza finance':
      case 'lumera markets':
      case 'the finance view':
      case 'revelle partners':
      case 'solara assets':
      case 'the asset circle':
      case 'asset circle':
      case 'the asset office':
      case 'the investor office':
      case 'the ledger capital':
      case 'the market vault':
      case 'zyvera capital':
      case 'zyvora finance':
      case 'velora assets':
      case 'the market office':
      case 'the capital space':
      case 'news project':
        console.log(`[CRM Router] Matched July CRM group for "${website}". Target: MyInvestTrade.`);
        return await sendToGenericCrm(leadData, MYINVESTTRADE_URL, MYINVESTTRADE_TOKEN);

      default:
        console.warn(`[CRM Router] WARNING: No specific CRM configured for website: "${website}". Defaulting to June CRM (CRM Core).`);
        return await sendToGenericCrm(leadData, CRM_CORE_URL, CRM_CORE_TOKEN);
    }
  } catch (error: any) {
    console.error(`[CRM Router] Fatal exception while routing lead for "${website}":`, error.message);
    return { success: false, error: error.message };
  }
};
