import * as getTestStations from "../../src/functions/getTestStations";
import * as putTestStation from "../../src/functions/putTestStation";
import mockContext, { Context} from "aws-lambda";
import sinon from "sinon";
import stations from "../resources/test-stations.json";
import { handler } from "../../src/handler";
import { TestStationService } from "../../src/services/TestStationService";
import { TestStationDAO } from "../../src/models/TestStationDAO";
import { Configuration } from "../../src/utils/Configuration";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { APIGatewayEvent, EventBridgeEvent } from "aws-lambda";
const ctx = mockContext as Context;
const sandbox = sinon.createSandbox();

describe("The lambda function handling EventBridgeEvent", () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {
    return;
  });
  context("should correctly handle incoming events", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    afterEach(() => {
      sinon.restore();
    });
    process.env.AWS_EVENT_BUS_SOURCE = "cvs.update.test.stations";

    it("should process events from correct source", async () => {
      const event = {
        source: "cvs.update.test.stations",
        detail: stations[0],
      } as EventBridgeEvent<any, any>;

      const putTestStationStub = sinon.stub(putTestStation);
      putTestStationStub.putTestStation.returns(Promise.resolve());

      const result = await handler(event, ctx);
      expect(result).toBeUndefined;
    });

    it("should reject events from wrong source", async () => {
      const event = {
        source: "some.other.source",
        detail: stations[0],
      } as EventBridgeEvent<any, any>;

      let err;
      try {
        await handler(event, ctx);
      } catch (error) {
        err = error;
      }

      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toBeCalledWith(
        new Error("Invalid event source for PUT.")
      );
      expect(err).toEqual(new Error("Invalid event source for PUT."));
    });

    it("should throw the correct error if put fails in models/TestStationDAO", async () => {
      const event = {
        source: "cvs.update.test.stations",
        detail: stations[0],
      } as EventBridgeEvent<any, any>;

      jest.spyOn(TestStationDAO.prototype, "putItem").mockImplementation(() => {
        return Promise.reject("Oh no, it broke in models/TestStationDAO!");
      });

      let err;
      try {
        await handler(event, ctx);
      } catch (error) {
        err = error;
      }

      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toBeCalledWith(
        "Oh no, it broke in models/TestStationDAO!"
      );
      expect(err).toEqual("Oh no, it broke in models/TestStationDAO!");
    });

    it("should throw the correct error if put fails in services/TestStationService", async () => {
      const event = {
        source: "cvs.update.test.stations",
        detail: stations[0],
      } as EventBridgeEvent<any, any>;

      jest
        .spyOn(TestStationService.prototype, "putTestStation")
        .mockImplementation(() => {
          return Promise.reject(
            "Oh no, it broke in services/TestStationService!"
          );
        });

      let err;
      try {
        await handler(event, ctx);
      } catch (error) {
        err = error;
      }

      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toBeCalledWith(
        "Oh no, it broke in services/TestStationService!"
      );
      expect(err).toEqual("Oh no, it broke in services/TestStationService!");
    });

    it("should throw the correct error if put fails in functions/putTestStation", async () => {
      const event = {
        source: "cvs.update.test.stations",
        detail: stations[0],
      } as EventBridgeEvent<any, any>;

      const putTestStationStub = sinon.stub(putTestStation);
      putTestStationStub.putTestStation.returns(
        Promise.reject("Oh no, it broke in functions/putTestStation!")
      );

      let err;
      try {
        await handler(event, ctx);
      } catch (error) {
        err = error;
      }

      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toBeCalledWith(
        "Oh no, it broke in functions/putTestStation!"
      );
      expect(err).toEqual("Oh no, it broke in functions/putTestStation!");
    });

    it("should reject events with invalid test station object", async () => {
      const event = {
        source: "cvs.update.test.stations",
        detail: stations[1],
      } as EventBridgeEvent<any, any>;
      event.detail.testStationId = undefined;

      let err;
      try {
        await handler(event, ctx);
      } catch (error) {
        err = error;
      }

      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toBeCalledWith(
        new Error('"testStationId" is required')
      );
      expect(err).toEqual(new Error('"testStationId" is required'));
    });
  });
});

describe("The lambda function handling APIGatewayEvent", () => {
  context("With correct Config", () => {
    const event = {
      path: "/test-stations",
      httpMethod: "GET",
      body: "",
    } as APIGatewayEvent;
    context("should correctly handle incoming events", () => {
      it("should call functions with correct event payload", async () => {
        // Specify your event, with correct path, payload etc

        // Stub out the actual functions
        const getTestStationsStub = sinon.stub(getTestStations);
        getTestStationsStub.getTestStations.returns(
          Promise.resolve(new HTTPResponse(200, {}))
        );

        const result = (await handler(event, ctx)) as HTTPResponse;
        expect(result.statusCode).toEqual(200);
        sinon.assert.called(getTestStationsStub.getTestStations);
      });

      it("should return error on empty event", async () => {
        const result = (await handler(
          null as unknown as APIGatewayEvent,
          ctx
        )) as HTTPResponse;

        expect(result).toBeInstanceOf(HTTPResponse);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
          JSON.stringify("AWS event is empty. Check your test event.")
        );
      });

      it("should return a Route Not Found error on invalid path", async () => {
        const invalidPathEvent = {
          path: "/something/that/doesntExist",
          httpMethod: "GET",
        } as APIGatewayEvent;

        const result = (await handler(invalidPathEvent, ctx)) as HTTPResponse;
        expect(result.statusCode).toEqual(400);
        expect(result.body).toStrictEqual(
          JSON.stringify({
            error: `Route ${invalidPathEvent.httpMethod} ${invalidPathEvent.path} was not found.`,
          })
        );
      });
    });
  });

  context("With no routes defined in config", () => {
    it("should return a Route Not Found error", async () => {
      // Stub Config getFunctions method and return empty array instead
      const configStub = sinon
        .stub(Configuration.prototype, "getFunctions")
        .returns([]);
      const event = { httpMethod: "GET", path: "" } as APIGatewayEvent;
      const result = (await handler(event, ctx)) as HTTPResponse;
      expect(result.statusCode).toEqual(400);
      expect(result.body).toStrictEqual(
        JSON.stringify({
          error: `Route ${event.httpMethod} ${event.path} was not found.`,
        })
      );
      configStub.restore();
    });
  });
});

describe("The configuration service", () => {
  context("with good config file", () => {
    it("should return local versions of the config if specified", () => {
      process.env.BRANCH = "local";
      const configService = Configuration.getInstance();
      const functions = configService.getFunctions();
      expect(functions.length).toEqual(2);
      expect(functions[0].name).toEqual("getTestStations");
      expect(functions[1].name).toEqual("getTestStationsEmails");

      const DBConfig = configService.getDynamoDBConfig();
      expect(DBConfig).toEqual(configService.getConfig().dynamodb.local);

      // No Endpoints for this service
    });

    it("should return local-global versions of the config if specified", () => {
      process.env.BRANCH = "local-global";
      const configService = Configuration.getInstance();
      const functions = configService.getFunctions();
      expect(functions.length).toEqual(2);
      expect(functions[0].name).toEqual("getTestStations");

      const DBConfig = configService.getDynamoDBConfig();
      expect(DBConfig).toEqual(
        configService.getConfig().dynamodb["local-global"]
      );

      // No Endpoints for this service
    });

    it("should return remote versions of the config by default", () => {
      process.env.BRANCH = "CVSB-XXX";
      const configService = Configuration.getInstance();
      const functions = configService.getFunctions();
      expect(functions.length).toEqual(2);
      expect(functions[0].name).toEqual("getTestStations");

      const DBConfig = configService.getDynamoDBConfig();
      expect(DBConfig).toEqual(configService.getConfig().dynamodb.remote);

      // No Endpoints for this service
    });
  });

  context("with bad config file", () => {
    it("should return an error for missing functions from getFunctions", () => {
      const config = new Configuration("../../tests/resources/EmptyConfig.yml");
      try {
        config.getFunctions();
      } catch (e) {
        expect((e as Error).message).toEqual(
          "Functions were not defined in the config file."
        );
      }
    });

    it("should return an error for missing DB Config from getDynamoDBConfig", () => {
      const config = new Configuration("../../tests/resources/EmptyConfig.yml");
      try {
        config.getDynamoDBConfig();
      } catch (e) {
        expect((e as Error).message).toEqual(
          "DynamoDB config is not defined in the config file."
        );
      }
    });
  });

  afterEach(() => {
    // process.env.BRANCH = 'local'
  });
});
