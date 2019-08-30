import {expect} from "chai";
import {Configuration} from "../../src/utils/Configuration";
import {IDBConfig, IFunctionConfig, IInvokeConfig} from "../../src/models";
import {ERRORS} from "../../src/utils/Enum";

describe("ConfigurationUtil", () => {
    const branch = process.env.BRANCH;
    context("when calling getConfig", () => {
        it("returns the full config object", () => {
            const conf = Configuration.getInstance().getConfig();
            expect(conf).to.contain.keys("functions", "dynamodb", "serverless");
            expect(conf.dynamodb).to.contain.keys("local", "local-global", "remote");
        });
    });

    context("when calling the getDynamoDBConfig()", () => {
        beforeEach(() => {jest.resetModules(); });

        context("the config is empty", () => {
            process.env.BRANCH = "local";
            const emptyConfig: Configuration = new Configuration("../../tests/resources/EmptyConfig.yml");
            it("should throw error", () => {
                try {
                    emptyConfig.getDynamoDBConfig();
                    expect.fail();
                } catch (e) {
                    expect(e.message).to.equal(ERRORS.DYNAMODB_CONFIG_NOT_DEFINED);
                }
            });
        });
        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local";
            const dbConfig: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
            it("should return the local invoke config", () => {
                expect(dbConfig).to.contain.keys("params", "table");
                expect(dbConfig.table).to.equal("cvs-local-test-stations");
            });
        });

        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local-global";
            const dbConfig: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
            it("should return the local invoke config", () => {
                expect(dbConfig).to.contain.keys("params", "table");
                expect(dbConfig).to.not.contain.keys("keys");
                expect(dbConfig.table).to.equal("cvs-local-global-test-stations");
                expect(dbConfig.params).to.contain.keys("region", "endpoint");
            });
        });

        context("the BRANCH environment variable is 'develop'", () => {
            it("should return the remote invoke config", () => {
                process.env.BRANCH = "develop";
                // Switch to mockedConfig to simplify environment mocking
                const dbConfig: IDBConfig = getMockedConfig().getDynamoDBConfig(); expect(dbConfig).to.contain.keys("params", "table");
                expect(dbConfig).to.not.contain.keys("keys");
                expect(dbConfig.table).to.equal("cvs-develop-test-stations");
                expect(dbConfig.params).to.deep.equal({});
            });
        });
    });

    context("when calling the getFunctions()", () => {
        beforeEach(() => {jest.resetModules(); });

        context("the config is empty", () => {
            process.env.BRANCH = "local";
            const emptyConfig: Configuration = new Configuration("../../tests/resources/EmptyConfig.yml");
            it("should throw error", () => {
                try {
                    emptyConfig.getFunctions();
                    expect.fail();
                } catch (e) {
                    expect(e.message).to.equal(ERRORS.FUNCTION_CONFIG_NOT_DEFINED);
                }
            });
        });
        context("the config is present", () => {
            process.env.BRANCH = "local";
            const funcConfig: IFunctionConfig[] = Configuration.getInstance().getFunctions();
            it("should return the list of specified functions with names and matching paths", () => {
                expect(funcConfig).to.have.length(2);
                expect(funcConfig[0].name).to.equal("getTestStations");
                expect(funcConfig[0].path).to.equal("/test-stations");
                expect(funcConfig[1].name).to.equal("getTestStationsEmails");
                expect(funcConfig[1].path).to.equal("/test-stations/:testStationPNumber");
            });
        });
    });


    afterAll(() => {
        process.env.BRANCH = branch;
    });
});

/**
 * Configuration does the token replacement for ${BRANCH} on instantiation, so in order to
 * catch this early enough, need to use jest.resetModules() and a "require" import
 * of Configuration again
 */
const getMockedConfig: () => Configuration = () => {
    jest.resetModules();
    const ConfImp = require("../../src/utils/Configuration");
    return ConfImp.Configuration.getInstance();
};
