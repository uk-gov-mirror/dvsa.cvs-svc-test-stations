import sinon from "sinon";
import { handler } from "../../src/handler";
import * as getTestStations from "../../src/functions/getTestStations";
import { Configuration } from "../../src/utils/Configuration";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import mockContext from "aws-lambda-mock-context";
const ctx = mockContext();

describe("The lambda function handler", () => {
  context("With correct Config", () => {
    const event = { path: "/test-stations", httpMethod: "GET", body: "" };
    context("should correctly handle incoming events", () => {
      it("should call functions with correct event payload", async () => {
        // Specify your event, with correct path, payload etc

        // Stub out the actual functions
        const getTestStationsStub = sinon.stub(getTestStations);
        getTestStationsStub.getTestStations.returns(
          Promise.resolve(new HTTPResponse(200, {}))
        );

        const result = await handler(event, ctx);
        expect(result.statusCode).toEqual(200);
        sinon.assert.called(getTestStationsStub.getTestStations);
      });

      it("should return error on empty event", async () => {
        const result = await handler(null, ctx);

        expect(result).toBeInstanceOf(HTTPResponse);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
          JSON.stringify("AWS event is empty. Check your test event.")
        );
      });

      it("should return error on invalid body json", async () => {
        event.body = '{"hello":}';

        const result = await handler(event, ctx);
        expect(result).toBeInstanceOf(HTTPResponse);
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
          JSON.stringify("Body is not a valid JSON.")
        );
      });

      it("should return a Route Not Found error on invalid path", async () => {
        const invalidPathEvent = {
          path: "/something/that/doesntExist",
          httpMethod: "GET",
        };

        const result = await handler(invalidPathEvent, ctx);
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
      const event = { httpMethod: "GET", path: "" };
      const result = await handler(event, ctx);
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
      expect(functions.length).toEqual(4);
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
      expect(functions.length).toEqual(4);
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
      expect(functions.length).toEqual(4);
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
        expect(e.message).toEqual(
          "Functions were not defined in the config file."
        );
      }
    });

    it("should return an error for missing DB Config from getDynamoDBConfig", () => {
      const config = new Configuration("../../tests/resources/EmptyConfig.yml");
      try {
        config.getDynamoDBConfig();
      } catch (e) {
        expect(e.message).toEqual(
          "DynamoDB config is not defined in the config file."
        );
      }
    });
  });

  afterEach(() => {
    // process.env.BRANCH = 'local'
  });
});
