export interface Config {
    endpoint: string;
    header?: { [key: string]: string; }
    cacheFor?: number;
    environment?: string;
}
