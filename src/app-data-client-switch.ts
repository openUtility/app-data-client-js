import { Config } from "./model/config";

type iFetch = (input: string, init?: RequestInit) => Promise<Response>;

export class AppDataClientSwitch {

    private _fetch: iFetch;
    private _core: { [key: string]: boolean; }

    constructor(private config: Config | Promise<Config> | (() => Config), _fetch: iFetch) {
        this._fetch = _fetch || fetch;
        
        if (!this.config) {
            throw new Error("Config property is required...");
        } 
    }

    /**
     * Gets the config that was passed in...
     * @returns The config as a promise...
     */
    private getConfig(): Promise<Config> {
        if (typeof this.config === "function") {
            // if it's a function
            return new Promise((res, rej) => {
                try {
                    res((<any>this.config)());
                } catch (ex) {
                    rej(ex);
                }
            })
        } else if (typeof (<any>this.config).then === "function") {
            // if it has a then... then it's a promise...
            return (<Promise<Config>>this.config);
        }
        // otherwise return it as the content of a promise...
        return Promise.resolve(this.config);
    }

    /**
     * Generates the Headers and other options for the fetch request.
     * @param config to find passed Headers, and env settings
     * @returns the content
     */
    private getOptions(config: Config): RequestInit {
        const rtnObj: RequestInit = {};
        // attach the passed headers. 
        if (config.header) {
            rtnObj.headers = {
                ...config.header
            };
        }

        // attach the env
        if (config.environment) {
            rtnObj.headers = rtnObj.headers || {};
            (<any>rtnObj.headers)['environment'] = config.environment;
        }
        
        return rtnObj
    }

    /** pulls the switch/key from the host url */
    private async fetchKey(keyName: string): Promise<Boolean> {
        const _config = await this.getConfig();
        let rtnValue = false;
        const _url = _config.endpoint + '/switch/' + keyName;
        try {
            const rply = await this._fetch.call(window, _url, this.getOptions(_config));
            const bdy = await rply.text();
            rtnValue = bdy === 'true';
        } catch (ex) {
            console.warn(`Fetch Request for [${keyName}] failed`);
            console.error(ex);
        }

        return rtnValue;
    }

    /**
     * gets the value for the passed switch 
     * @param keyName the switch / flag we want to find the value for.
     * @returns {Promise<boolean>} indicating the switch value. 
     */
    public async get(keyName: string, refresh: boolean = false): Promise<boolean> {
        // if we are refreshing the value, or it hasn't been looked up yet
        // then pull it from the host
        if (refresh || !(keyName in this._core)) {
            var lookupValue = await this.fetchKey(keyName);
            this._core[keyName] = lookupValue;
        }    
        return this._core[keyName];
    }

}