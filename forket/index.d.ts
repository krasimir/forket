export interface ForketOptions {
  sourceDir?: string;
  buildDir?: string;
  serverDirName?: string;
  clientDirName?: string;
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
  forketServerActions(forketServerActionsHandler?: Function): Promise<void>;
  serveApp({ factory: Function, serverActionsEndpoint: string }): (req: any, res: any) => void;
  setRenderer(renderer: Function): void;
  setRequestContext(requestContext: any): void;
}

export default function Forket(options?: ForketOptions): Promise<ForketInstance>;
