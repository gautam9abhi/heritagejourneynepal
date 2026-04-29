// This file provides type declarations for Deno and external modules

// Type declarations for Deno standard library
declare module "https://deno.land/std@0.190.0/http/server.ts" {
  /**
   * Serves HTTP requests with the given handler.
   * @param handler A function that handles incoming requests and returns a Response.
   */
  export function serve(handler: (request: Request) => Promise<Response> | Response): void;
}

// Type declarations for Resend email service
declare module "resend" {
  export interface ResendEmailOptions {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text?: string;
    reply_to?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: any[];
    tags?: Array<{name: string; value: string}>;
  }

  export interface ResendEmailResponse {
    id: string;
    from: string;
    to: string[];
    created_at: string;
  }

  export class Resend {
    constructor(apiKey: string | undefined);
    
    emails: {
      send(options: ResendEmailOptions): Promise<ResendEmailResponse>;
    };
  }
}

// Additional Deno globals not covered by default TypeScript types
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    has(key: string): boolean;
    delete(key: string): boolean;
  }
  
  export const env: Env;
}
