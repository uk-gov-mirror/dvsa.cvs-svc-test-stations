"use strict";
exports.__esModule = true;
// @ts-ignore
var yml = require("node-yaml");
var HTTPMethods;
(function (HTTPMethods) {
    HTTPMethods["GET"] = "GET";
    HTTPMethods["POST"] = "POST";
    HTTPMethods["PUT"] = "PUT";
    HTTPMethods["DELETE"] = "DELETE";
})(HTTPMethods || (HTTPMethods = {}));
var Configuration = /** @class */ (function () {
    function Configuration(configPath) {
        this.config = yml.readSync(configPath);
        // Replace environment variable references
        var stringifiedConfig = JSON.stringify(this.config);
        var envRegex = /\${(\w+\b):?(\w+\b)?}/g;
        var matches = stringifiedConfig.match(envRegex);
        if (matches) {
            matches.forEach(function (match) {
                envRegex.lastIndex = 0;
                var captureGroups = envRegex.exec(match);
                // Insert the environment variable if available. If not, insert placeholder. If no placeholder, leave it as is.
                stringifiedConfig = stringifiedConfig.replace(match, (process.env[captureGroups[1]] || captureGroups[2] || captureGroups[1]));
            });
        }
        this.config = JSON.parse(stringifiedConfig);
    }
    /**
     * Retrieves the singleton instance of Configuration
     * @returns Configuration
     */
    Configuration.getInstance = function () {
        if (!this.instance) {
            this.instance = new Configuration("../config/config.yml");
        }
        return Configuration.instance;
    };
    /**
     * Retrieves the entire config as an object
     * @returns any
     */
    Configuration.prototype.getConfig = function () {
        return this.config;
    };
    /**
     * Retrieves the lambda functions declared in the config
     * @returns IFunctionEvent[]
     */
    Configuration.prototype.getFunctions = function () {
        if (!this.config.functions) {
            throw new Error("Functions were not defined in the config file.");
        }
        return this.config.functions.map(function (fn) {
            var _a = Object.entries(fn)[0], name = _a[0], params = _a[1];
            var path = (params.proxy) ? params.path.replace("{+proxy}", params.proxy) : params.path;
            return {
                name: name,
                method: params.method.toUpperCase(),
                path: path,
                "function": require("../functions/" + name)[name]
            };
        });
    };
    /**
     * Retrieves the DynamoDB config
     * @returns any
     */
    Configuration.prototype.getDynamoDBConfig = function () {
        if (!this.config.dynamodb) {
            throw new Error("DynamoDB config is not defined in the config file.");
        }
        // Not defining BRANCH will default to remote
        var env;
        switch (process.env.BRANCH) {
            case "local":
                env = "local";
                break;
            case "local-global":
                env = "local-global";
                break;
            default:
                env = "remote";
        }
        return this.config.dynamodb[env];
    };
    /**
     * Retrieves the test number initial value
     * @returns any
     */
    Configuration.prototype.getTestNumberInitialValue = function () {
        return this.config.testNumberinitialValue;
    };
    return Configuration;
}());
exports.Configuration = Configuration;
