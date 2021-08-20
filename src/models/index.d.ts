import { Handler } from "aws-lambda";

interface IInvokeConfig {
  params: { apiVersion: string; endpoint?: string };
  functions: {
    testResults: { name: string };
    techRecords: { name: string; mock: string };
  };
}

interface IDBConfig {
  params: { region: string; endpoint: string; convertEmptyValues: boolean };
  table: string;
}

interface IFunctionConfig {
  name: string;
  path: string;
  function: Handler;
  method: string;
}

export { IInvokeConfig, IDBConfig, IFunctionConfig };
