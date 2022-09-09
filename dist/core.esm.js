/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var AppDataClientSwitch = /** @class */ (function () {
    function AppDataClientSwitch(config, _fetch) {
        this.config = config;
        this._core = {};
        if (_fetch) {
            this._fetch = _fetch;
        }
        else if (!fetch) {
            throw new Error("Environment doesn't have fetch, and a fetch replacement was not passed");
        }
        if (!this.config) {
            throw new Error("Config property is required...");
        }
    }
    /**
     * Gets the config that was passed in...
     * @returns The config as a promise...
     */
    AppDataClientSwitch.prototype.getConfig = function () {
        var _this = this;
        if (typeof this.config === "function") {
            // if it's a function
            return new Promise(function (res, rej) {
                try {
                    res(_this.config());
                }
                catch (ex) {
                    rej(ex);
                }
            });
        }
        else if (typeof this.config.then === "function") {
            // if it has a then... then it's a promise...
            return this.config;
        }
        // otherwise return it as the content of a promise...
        return Promise.resolve(this.config);
    };
    /**
     * Generates the Headers and other options for the fetch request.
     * @param config to find passed Headers, and env settings
     * @returns the content
     */
    AppDataClientSwitch.prototype.getOptions = function (config) {
        var rtnObj = {};
        // attach the passed headers. 
        if (config.header) {
            rtnObj.headers = __assign({}, config.header);
        }
        // attach the env
        if (config.environment) {
            rtnObj.headers = rtnObj.headers || {};
            rtnObj.headers['environment'] = config.environment;
        }
        return rtnObj;
    };
    /** pulls the switch/key from the host url */
    AppDataClientSwitch.prototype.fetchKey = function (keyName) {
        return __awaiter(this, void 0, void 0, function () {
            var _config, rtnValue, _url, rply, bdy, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConfig()];
                    case 1:
                        _config = _a.sent();
                        rtnValue = false;
                        _url = _config.endpoint + '/switch/' + keyName;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (this._fetch || fetch)(_url, this.getOptions(_config))];
                    case 3:
                        rply = _a.sent();
                        return [4 /*yield*/, rply.text()];
                    case 4:
                        bdy = _a.sent();
                        rtnValue = bdy === 'true';
                        return [3 /*break*/, 6];
                    case 5:
                        ex_1 = _a.sent();
                        console.warn("Fetch Request for [".concat(keyName, "] failed"));
                        console.error(ex_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, rtnValue];
                }
            });
        });
    };
    /**
     * gets the value for the passed switch
     * @param keyName the switch / flag we want to find the value for.
     * @returns {Promise<boolean>} indicating the switch value.
     */
    AppDataClientSwitch.prototype.get = function (keyName, refresh) {
        if (refresh === void 0) { refresh = false; }
        return __awaiter(this, void 0, void 0, function () {
            var lookupValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(refresh || !(keyName in this._core))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchKey(keyName)];
                    case 1:
                        lookupValue = _a.sent();
                        this._core[keyName] = lookupValue;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._core[keyName]];
                }
            });
        });
    };
    return AppDataClientSwitch;
}());

export { AppDataClientSwitch };
