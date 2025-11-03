declare module 'deepai' {
  export interface DeepAIResponse {
    id: string;
    output: string;
  }

  export function setApiKey(key: string): void;
  export function callStandardApi(
    endpoint: string,
    options: {
      text?: string;
      image?: string;
      grid?: boolean;
      [key: string]: any;
    }
  ): Promise<DeepAIResponse>;
}