export enum ERRORS {
  RESOURCE_NOT_FOUND = "No resources match the search criteria.",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  FAILED_TO_ADD_ITEM = "Failed to add item to dynamo table.",
  DYNAMODB_CONFIG_NOT_DEFINED = "DynamoDB config is not defined in the config file.",
  FUNCTION_CONFIG_NOT_DEFINED = "Functions were not defined in the config file.",
}

export enum HTTPRESPONSE {
  AWS_EVENT_EMPTY = "AWS event is empty. Check your test event.",
  INVALID_SOURCE = "Invalid event source for PUT.",
  MISSING_PARAMETERS = "Missing parameter value."
}

export enum TEST_STATION_STATUS {
  ACTIVE = "active",
  TERMINATION_REQUESTED = "termination requested",
}

export enum RESPONSE_STATUS {
  SUCCESS = "success",
}
