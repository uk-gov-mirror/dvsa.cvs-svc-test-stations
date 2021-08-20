export enum ERRORS {
  RESOURCE_NOT_FOUND = "No resources match the search criteria.",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  DYNAMODB_CONFIG_NOT_DEFINED = "DynamoDB config is not defined in the config file.",
  FUNCTION_CONFIG_NOT_DEFINED = "Functions were not defined in the config file.",
}

export enum HTTPRESPONSE {
  AWS_EVENT_EMPTY = "AWS event is empty. Check your test event.",
  NOT_VALID_JSON = "Body is not a valid JSON.",
}

export enum TEST_STATION_STATUS {
  ACTIVE = "active",
}

export enum RESPONSE_STATUS {
  SUCCESS = "success",
}
