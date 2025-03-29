declare module "@edgestore/react" {
  export function createEdgeStoreProvider(): {
    EdgeStoreProvider: any;
    useEdgeStore: any;
  };
}

declare module "@edgestore/server" {
  export function initEdgeStore(config?: {
    accessKey: string;
    secretKey: string;
  }): {
    router: (config: { publicFiles: any }) => any;
    fileBucket: () => any;
  };
}

declare module "@edgestore/server/adapters/next/app" {
  export function createEdgeStoreNextHandler(config: { router: any }): any;
}
