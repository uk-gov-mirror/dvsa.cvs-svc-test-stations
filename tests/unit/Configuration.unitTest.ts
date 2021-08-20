import { Configuration } from "../../src/utils/Configuration";
import { IDBConfig, IFunctionConfig, IInvokeConfig } from "../../src/models";
import { ERRORS } from "../../src/utils/Enum";

describe("ConfigurationUtil", () => {
  const branch = process.env.BRANCH;
  context("when calling getConfig", () => {
    it("returns the full config object", () => {
      const conf = Configuration.getInstance().getConfig();
      expect(Object.keys(conf)).toEqual(
        expect.arrayContaining(["functions", "dynamodb", "serverless"])
      );
      expect(Object.keys(conf.dynamodb)).toEqual(
        expect.arrayContaining(["local", "local-global", "remote"])
      );
    });
  });

  context("when calling the getDynamoDBConfig()", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    context("the config is empty", () => {
      process.env.BRANCH = "local";
      const emptyConfig: Configuration = new Configuration(
        "../../tests/resources/EmptyConfig.yml"
      );
      it("should throw error", () => {
        try {
          emptyConfig.getDynamoDBConfig();
        } catch (e) {
          expect(e.message).toEqual(ERRORS.DYNAMODB_CONFIG_NOT_DEFINED);
        }
      });
    });
    context("the BRANCH environment variable is local", () => {
      process.env.BRANCH = "local";
      const dbConfig: IDBConfig =
        Configuration.getInstance().getDynamoDBConfig();
      it("should return the local invoke config", () => {
        expect(Object.keys(dbConfig.params)).toEqual(
          expect.arrayContaining(["region", "endpoint"])
        );
        expect(dbConfig.table).toEqual("cvs-local-test-stations");
      });
    });

    context("the BRANCH environment variable is local", () => {
      process.env.BRANCH = "local-global";
      const dbConfig: IDBConfig =
        Configuration.getInstance().getDynamoDBConfig();
      it("should return the local invoke config", () => {
        expect(Object.keys(dbConfig)).toEqual(
          expect.arrayContaining(["params", "table"])
        );
        expect(Object.keys(dbConfig.params)).toEqual(
          expect.arrayContaining(["region", "endpoint"])
        );
        expect(Object.keys(dbConfig)).not.toEqual(
          expect.arrayContaining(["keys"])
        );
        expect(dbConfig.table).toEqual("cvs-local-global-test-stations");
      });
    });

    context("the BRANCH environment variable is 'develop'", () => {
      it("should return the remote invoke config", () => {
        process.env.BRANCH = "develop";
        // Switch to mockedConfig to simplify environment mocking
        const dbConfig: IDBConfig = getMockedConfig().getDynamoDBConfig();
        expect(Object.keys(dbConfig)).not.toEqual(
          expect.arrayContaining(["keys"])
        );
        expect(dbConfig.table).toEqual("cvs-develop-test-stations");
        expect(dbConfig.params).toStrictEqual({});
      });
    });
  });

  context("when calling the getFunctions()", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    context("the config is empty", () => {
      process.env.BRANCH = "local";
      const emptyConfig: Configuration = new Configuration(
        "../../tests/resources/EmptyConfig.yml"
      );
      it("should throw error", () => {
        try {
          emptyConfig.getFunctions();
        } catch (e) {
          expect(e.message).toEqual(ERRORS.FUNCTION_CONFIG_NOT_DEFINED);
        }
      });
    });
    context("the config is present", () => {
      process.env.BRANCH = "local";
      const funcConfig: IFunctionConfig[] =
        Configuration.getInstance().getFunctions();
      it("should return the list of specified functions with names and matching paths", () => {
        expect(funcConfig).toHaveLength(4);
        expect(funcConfig[0].name).toEqual("getTestStations");
        expect(funcConfig[0].path).toEqual("/test-stations");
        expect(funcConfig[1].name).toEqual("getTestStationsEmails");
        expect(funcConfig[1].path).toEqual(
          "/test-stations/:testStationPNumber"
        );
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
