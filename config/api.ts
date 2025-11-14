export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash-exp',
    apiVersion: 'v1beta',
    endpoint: 'https://generativelanguage.googleapis.com'
  }
};
