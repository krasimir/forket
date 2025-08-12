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
  setupForketSA(app: any, forketServerActionsHandler?: Function): Promise<void>;
  setupApp(app: any, rootPath: string, rootElementFactory: Function): void;
  setRenderer(renderer: any): void;
}

export default function Forket(options?: ForketOptions): Promise<ForketInstance>;
