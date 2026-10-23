// Адреса, куда уходят заявки с формы (вебхуки CRM, Make, n8n и т.п.).
// Их можно вписать прямо сюда в кавычки
// или задать в Vercel: Settings → Environment Variables
// (VITE_WEBHOOK_STEP_1 и VITE_WEBHOOK_STEP_3).
export const WEBHOOK_STEP_1: string = import.meta.env.VITE_WEBHOOK_STEP_1 || '';
export const WEBHOOK_STEP_3: string = import.meta.env.VITE_WEBHOOK_STEP_3 || '';
