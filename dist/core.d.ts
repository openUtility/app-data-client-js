declare module "model/config" {
    export interface Config {
        endpoint: string;
        header?: {
            [key: string]: string;
        };
        cacheFor?: number;
        environment?: string;
    }
}
declare module "app-data-client-switch" {
    import { Config } from "model/config";
    type iFetch = (input: string, init?: RequestInit) => Promise<Response>;
    export class AppDataClientSwitch {
        private config;
        private _fetch;
        private _core;
        constructor(config: Config | Promise<Config> | (() => Config), _fetch?: iFetch);
        /**
         * Gets the config that was passed in...
         * @returns The config as a promise...
         */
        private getConfig;
        /**
         * Generates the Headers and other options for the fetch request.
         * @param config to find passed Headers, and env settings
         * @returns the content
         */
        private getOptions;
        /** pulls the switch/key from the host url */
        private fetchKey;
        /**
         * gets the value for the passed switch
         * @param keyName the switch / flag we want to find the value for.
         * @returns {Promise<boolean>} indicating the switch value.
         */
        get(keyName: string, refresh?: boolean): Promise<boolean>;
    }
}
declare module "index" {
    export * from "app-data-client-switch";
    export * from "model/config";
}
