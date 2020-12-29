declare namespace Letssl {
  interface Logger {
    error?(...args: any[]): void;
    warn?(...args: any[]): void;
    info?(...args: any[]): void;
    debug?(...args: any[]): void;
  }

  interface RetrievingOptions {
    altNames?: string[];
    builtInServerPort?: number;
    commonName: string;
    debugLevel?: number;
    directoryUrl?: string;
    email?: string;
    httpOptions?: object;
    logger?: Logger;
    onCertificateIssued?: (key: Buffer, cert: Buffer) => void;
    onCertificateRenewed?: (key: Buffer, cert: Buffer) => void;
    renewThresholdDays?: number;
    renewInTheFuture?: boolean;
    storageDirPath?: string;
  }

  function getCertificate(
    options: RetrievingOptions
  ): Promise<[Buffer, Buffer]>;
}

export = Letssl;
