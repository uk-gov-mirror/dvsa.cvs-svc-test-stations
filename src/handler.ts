import { HTTPRESPONSE } from "./utils/Enum";
import Path from "path-parser";
import { Configuration } from "./utils/Configuration";
import { HTTPResponse } from "./models/HTTPResponse";
import { APIGatewayEvent, EventBridgeEvent, Context } from "aws-lambda";
import { IFunctionConfig } from "./models";
import { putTestStation } from "./functions/putTestStation";
import { ILogMessage } from "./models/ILogMessage";

const handler = async (
  event: EventBridgeEvent<any, any> | APIGatewayEvent,
  context: Context
): Promise<void | HTTPResponse> => {
  // Request integrity checks
  if (!event) {
    return new HTTPResponse(400, HTTPRESPONSE.AWS_EVENT_EMPTY);
  }

  if ("detail" in event) {
    try {
      await handleEventBridge(event);
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    return handleApiGateway(event, context);
  }
};

async function handleEventBridge(event: EventBridgeEvent<any, any>) {
  if (event.detail) {
    if (event.source !== process.env.AWS_EVENT_BUS_SOURCE) {
      throw new Error(HTTPRESPONSE.INVALID_SOURCE);
    }

    await putTestStation(event.detail);
  }
}

function handleApiGateway(event: APIGatewayEvent, context: Context) {
  // Finding an appropriate λ matching the request
  const config: Configuration = Configuration.getInstance();
  const functions: IFunctionConfig[] = config.getFunctions();
  const serverlessConfig = config.getConfig().serverless;

  const matchingLambdaEvents: IFunctionConfig[] = functions
    .filter((fn: IFunctionConfig) => {
      // Find λ with matching httpMethod
      return event.httpMethod === fn.method;
    })
    .filter((fn: IFunctionConfig) => {
      // Find λ with matching path
      const localPath: Path = new Path(fn.path);
      const remotePath: Path = new Path(
        `${serverlessConfig.basePath}${fn.path}`
      ); // Remote paths also have environment

      return localPath.test(event.path) || remotePath.test(event.path);
    });

  // Exactly one λ should match the above filtering.
  if (matchingLambdaEvents.length === 1) {
    const lambdaEvent = matchingLambdaEvents[0];
    const lambdaFn = lambdaEvent.function;

    const localPath: Path = new Path(lambdaEvent.path);
    const remotePath: Path = new Path(
      `${serverlessConfig.basePath}${lambdaEvent.path}`
    ); // Remote paths also have environment

    const lambdaPathParams =
      localPath.test(event.path) || remotePath.test(event.path);

    Object.assign(event, { pathParameters: lambdaPathParams });

    const logMessage: ILogMessage = {
      HTTP: `${event.httpMethod} ${event.path} -> λ ${lambdaEvent.name}`,
      PATH_PARAMS: `${JSON.stringify(event.pathParameters)}`,
      QUERY_PARAMS: `${JSON.stringify(event.queryStringParameters)}`,
    };

    console.log(logMessage);

    // Explicit conversion because typescript can't figure it out
    return lambdaFn(event, context, () => {
      return;
    });
  }

  // If filtering results in less or more λ functions than expected, we return an error.
  console.error(`Error: Route ${event.httpMethod} ${event.path} was not found.
    Dumping event:
    ${JSON.stringify(event)}
    Dumping context:
    ${JSON.stringify(context)}`);

  return new HTTPResponse(400, {
    error: `Route ${event.httpMethod} ${event.path} was not found.`,
  });
}

export { handler };
