export interface ForketOptions {
  sourceDir: string;
  buildDir: string;
  serverDirName?: string;
  clientDirName?: string;
}

export interface ForketInstance {
  process: () => Promise<void>;
}

export default function Forket(options?: ForketOptions): ForketInstance;
export function client(): string;
export function processChunk(res: any): any;
