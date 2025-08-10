export interface ForketOptions {
  sourceDir: string;
  buildDir: string;
  serverDirName?: string;
  clientDirName?: string;
  clientCopyableFiles?: string[];
  watch?: boolean;
  printGraph?: boolean;
  manifestFile?: string;
}

export interface ForketInstance {
  process: () => Promise<void>;
}

export default function Forket(options?: ForketOptions): ForketInstance;
export function client(): string;
export function processChunk(res: any): any;
export function serializeProps(props: any): any;
