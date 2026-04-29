
/// <reference types="https://deno.land/x/servest/types.d.ts" />

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
  }
  
  export const env: Env;
  
  export const serve: any;
}
