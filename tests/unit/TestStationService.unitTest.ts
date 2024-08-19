import { HTTPError } from "../../src/models/HTTPError";
import { TestStationService } from "../../src/services/TestStationService";
import stations from "../resources/test-stations.json";
import { ERRORS } from "../../src/utils/Enum";
import { ITestStation } from "../../src/models/ITestStation";

describe("TestStationService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("getTestStationList", () => {
    describe("when database is on", () => {
      context("database call returns valid data", () => {
        it("should return the expected data", () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getAll: () => {
                return Promise.resolve({
                  Items: [...stations],
                  Count: 20,
                  ScannedCount: 20,
                });
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );
          return testStationService
            .getTestStationList()
            .then((returnedRecords: any) => {
              expect(returnedRecords.length).toEqual(27);
            });
        });
      });
      context("database call returns empty data", () => {
        it("should return error 404", () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getAll: () => {
                return Promise.resolve({
                  Items: [],
                  Count: 0,
                  ScannedCount: 0,
                });
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );
          return testStationService
            .getTestStationList()
            .then(() => {
              expect.assertions(1); // should have thrown an error, test failed
            })
            .catch((errorResponse: any) => {
              expect(errorResponse).toBeInstanceOf(HTTPError);
              expect(errorResponse.statusCode).toEqual(404);
              expect(errorResponse.body).toEqual(
                "No resources match the search criteria."
              );
            });
        });
      });
    });

    describe("when database is off", () => {
      it("should return error 500", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.reject(new Error());
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );
        return testStationService
          .getTestStationList()
          .then(() => {
            return;
          })
          .catch((errorResponse: any) => {
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual("Internal Server Error");
          });
      });
    });
  });

  describe("getTestStationEmail", () => {
    describe("when database is on", () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

      context("database call returns valid data", () => {
        it("should return the expected data", async () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationEmailByPNumber: () => {
                return Promise.resolve({
                  Items: [...stations][0].testStationEmails,
                });
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );
          try {
            const returnedRecords =
              await testStationService.getTestStationEmails("87-1369569");
            expect(returnedRecords.length).toEqual(2);
          } catch (e) {
            expect.assertions(1); // should have thrown an error, test failed
          }
        });
      });
      context("database call returns no data", () => {
        it("should throw error", () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationEmailByPNumber: () => {
                return Promise.resolve({ Count: 0 });
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );
          return testStationService
            .getTestStationEmails("")
            .then(() => {
              return;
            })
            .catch((errorResponse: HTTPError) => {
              expect(errorResponse).toBeInstanceOf(HTTPError);
              expect(errorResponse.statusCode).toEqual(404);
              expect(errorResponse.body).toEqual(
                "No resources match the search criteria."
              );
            });
        });
      });

      context("Database throws a predicted error (HTTPError)", () => {
        it("should return the error as is", () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationEmailByPNumber: () => {
                return Promise.reject(new HTTPError(418, "It broke"));
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );
          return testStationService
            .getTestStationEmails("")
            .then(() => {
              return;
            })
            .catch((errorResponse: HTTPError) => {
              expect(errorResponse).toBeInstanceOf(HTTPError);
              expect(errorResponse.statusCode).toEqual(418);
              expect(errorResponse.body).toEqual("It broke");
            });
        });
      });

      context("Database throws an unexpected error (not HTTPError)", () => {
        it("should return a generic 500 error", () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationEmailByPNumber: () => {
                return Promise.reject(new Error("Oh no!"));
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );
          return testStationService
            .getTestStationEmails("")
            .then(() => {
              return;
            })
            .catch((errorResponse: HTTPError) => {
              expect(errorResponse).toBeInstanceOf(HTTPError);
              expect(errorResponse.statusCode).toEqual(500);
              expect(errorResponse.body).toEqual(ERRORS.INTERNAL_SERVER_ERROR);
            });
        });
      });
    });
  });

  describe("getTestStation", () => {
    describe("when database is on", () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

      context("database call returns valid data", () => {
        it("should return the expected data", async () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationByPNumber: () => {
                return Promise.resolve({
                  ...stations[0],
                });
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );

          const returnedRecords: ITestStation =
            (await testStationService.getTestStation(
              "87-1369569"
            )) as ITestStation;
          expect(returnedRecords).not.toBeNull();
          expect(returnedRecords.testStationPNumber).toEqual("87-1369569");
        });
      });

      context("database call returns no data", () => {
        it("should throw error", async () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationByPNumber: () => {
                return Promise.resolve({
                  ...stations[0],
                });
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );

          try {
            await testStationService.getTestStation("");
          } catch (errorResponse: any) {
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(404);
            expect(errorResponse.body).toEqual(
              "No resources match the search criteria."
            );
          }
        });
      });

      context("Database throws a predicted error (HTTPError)", () => {
        it("should return the error as is", async () => {
          const TestStationDAOMock = jest.fn().mockImplementation(() => {
            return {
              getTestStationByPNumber: () => {
                return Promise.reject(new HTTPError(418, "It broke"));
              },
            };
          });

          const testStationService = new TestStationService(
            new TestStationDAOMock()
          );

          try {
            await testStationService.getTestStation("");
          } catch (errorResponse: any) {
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(418);
            expect(errorResponse.body).toEqual("It broke");
          }
        });
      });
    });
  });

  describe("putTestStation", () => {
    context("database call inserts items", () => {
      it("should return nothing", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            putItem: () => {
              return Promise.resolve({});
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .putTestStation(stations[0])
          .then((data: any) => {
            expect(data).toEqual(undefined);
          })
          .catch((e: any) => {
            expect.assertions(1); // should have thrown an error, test failed
          });
      });

      it("should log an error if an unprocessed item is returned", async () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            putItem: () => {
              return Promise.resolve({ UnprocessedItems: [...stations] });
            },
          };
        });
        const consoleSpy = jest
          .spyOn(console, "error")
          .mockImplementation(() => {
            return;
          });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        let err;
        try {
          await testStationService.putTestStation(stations[0]);
        } catch (error) {
          err = error;
        }

        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy).toBeCalledWith(
          `Item not added: ${JSON.stringify([...stations])}`
        );
        expect(err).toEqual(new Error("Failed to add item to dynamo table."));
      });
    });

    context("database call fails inserting items", () => {
      it("should throw an error", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            putItem: () => {
              return Promise.reject(new Error("DynamoDB goes bang!"));
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .putTestStation(stations[0])
          .then(() => {
            return;
          })
          .catch((error: any) => {
            expect(spy.mock.calls).toHaveLength(0);
            expect(error).toEqual(new Error("DynamoDB goes bang!"));
          });
      });
    });
  });
});
