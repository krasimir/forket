export interface ForketOptions {
  sourceDir?: string;
  buildDir?: string;
  serverDirName?: string;
  clientDirName?: string;
  forketServerActionsEndpoint?: string;
  forketServerActionsHandler?: string;
  clientCopyableFiles?: string[];
  watch?: boolean;
  printGraph?: boolean;
}

export interface ForketInstance {
  process(): Promise<void>;
  getGraphs(): Object;
  printGraph(): void;
  client(serverActionsEndpoint: string): string;
  processChunk(res: any): any;
  setupForketSA(app: any): Promise<void>;
}

export default function Forket(options?: ForketOptions): Promise<ForketInstance>;
