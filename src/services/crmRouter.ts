import { sendToGenericCrm } from '../crm-handlers/genericCrmHandler';

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
  const website = leadData.Website.toLowerCase().trim();

  const CRM_CORE_URL = process.env.CRM_CORE_URL || 'https://inwo.crmcore.me/api/lead_management/api/affiliates';
  const MYINVESTTRADE_URL = process.env.MYINVESTTRADE_URL || 'https://api.myinvesttrade.com/api/lead_management/api/affiliates';
  
  const CRM_TOKEN = process.env.CRM_TOKEN || 'AFF_1_92cbc1bc76284e19b711bab22587d75f'; 

  try {
    switch (website) {
      // Websites using inwo.crmcore.me
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
      case 'velora assets':
      case 'the market office':
      case 'the capital space':
        return await sendToGenericCrm(leadData, CRM_CORE_URL, CRM_TOKEN);
        
      // Websites using api.myinvesttrade.com
      case 'the report desk':
      case 'avenza finance':
      case 'lumera markets':
      case 'the finance view':
      case 'revelle partners':
      case 'solara assets':
      case 'the asset circle':
      case 'the asset office':
      case 'the investor office':
      case 'the ledger capital':
      case 'the market vault':
      case 'zyvera capital':
        return await sendToGenericCrm(leadData, MYINVESTTRADE_URL, CRM_TOKEN);

      default:
        console.warn(`[CRM Router] No CRM configured for website: ${website}. Defaulting to CRM Core.`);
        return await sendToGenericCrm(leadData, CRM_CORE_URL, CRM_TOKEN);
    }
  } catch (error: any) {
    console.error(`[CRM Router] Exception while routing to ${website}:`, error.message);
    return { success: false, error: error.message };
  }
};
