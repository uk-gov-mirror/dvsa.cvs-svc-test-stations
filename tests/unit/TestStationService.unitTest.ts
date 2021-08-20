import { ITestStation } from "../../src/models/ITestStation";
import { HTTPError } from "../../src/models/HTTPError";
import { TestStationService } from "../../src/services/TestStationService";
import stations from "../resources/test-stations.json";
import { ERRORS } from "../../src/utils/Enum";
const stationIds = stations.map((station) => station.testStationId);

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
              expect(returnedRecords.length).toEqual(20);
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
            expect(returnedRecords.length).toEqual(3);
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

  describe("insertTestStation", () => {
    context("database call inserts items", () => {
      it("should return nothing", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            createItem: () => {
              return Promise.resolve({});
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .insertTestStation(stations[0])
          .then((data: any) => {
            expect(data).toEqual(undefined);
          })
          .catch((e: any) => {
            expect.assertions(1); // should have thrown an error, test failed
          });
      });

      it("should return the unprocessed items", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            createItem: () => {
              return Promise.resolve({ UnprocessedItems: [...stations] });
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );
        return testStationService
          .insertTestStation(stations[0])
          .then((data: any) => {
            expect(data).toHaveLength(20);
          });
      });
    });

    context("database call fails inserting items", () => {
      it("should return error 500, irrespective of the error", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            createItem: () => {
              return Promise.reject();
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .insertTestStation(stations[0])
          .then(() => {
            return;
          })
          .catch((errorResponse: any) => {
            expect(spy.mock.calls).toHaveLength(0);
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual("Internal Server Error");
          });
      });

      it("should console log the error message, if a error is passed", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            createItem: () => {
              return Promise.reject(new Error("It broke"));
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .insertTestStation(stations[0])
          .then(() => {
            return;
          })
          .catch((errorResponse: any) => {
            expect(spy.mock.calls).toHaveLength(1);
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual("Internal Server Error");
          });
      });
    });
  });

  describe("updateTestStation", () => {
    context("database call updates items", () => {
      it("should return nothing", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            transactWrite: () => {
              return Promise.resolve({});
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .updateTestStation(stations[0], "123")
          .then((data: any) => {
            expect(data).toEqual(undefined);
          })
          .catch((e: any) => {
            expect.assertions(1); // should have thrown an error, test failed
          });
      });

      it("should return the unprocessed items", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            transactWrite: () => {
              return Promise.resolve({ UnprocessedItems: [...stations] });
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );
        return testStationService
          .updateTestStation(stations[0], "123")
          .then((data: any) => {
            expect(data).toHaveLength(20);
          });
      });
    });
    context("database call fails updating items", () => {
      it("should return error 500, irrespective of the error", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            transactWrite: () => {
              return Promise.reject();
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .updateTestStation(stations[0], "123")
          .then(() => {
            return;
          })
          .catch((errorResponse: any) => {
            expect(spy.mock.calls).toHaveLength(0);
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual(undefined);
          });
      });

      it("should console log the error message, if a error is passed", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });
        const error = new Error("It broke");
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            transactWrite: () => {
              return Promise.reject(error);
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .updateTestStation(stations[0], "123")
          .then(() => {
            return;
          })
          .catch((errorResponse: any) => {
            expect(spy.mock.calls).toHaveLength(1);
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual(error);
          });
      });
    });
  });

  describe("deleteTestStationsList", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    context("database call deletes items", () => {
      it("should return nothing", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            deleteMultiple: () => {
              return Promise.resolve({ UnprocessedItems: null });
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );
        return testStationService
          .deleteTestStationsList(stationIds)
          .then((data: ITestStation[]) => {
            expect(data).toEqual(undefined);
          });
      });

      it("should return the unprocessed items", () => {
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            deleteMultiple: () => {
              return Promise.resolve({ UnprocessedItems: [...stations] });
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );
        return testStationService
          .deleteTestStationsList(stationIds)
          .then((data: ITestStation[]) => {
            return expect(data.length).toEqual(20);
          })
          .catch(() => {
            expect.assertions(1); // should have thrown an error, test failed
          });
      });
    });

    context("database call fails deleting items", () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it("should return error 500, irrespective of the error", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });

        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            deleteMultiple: () => {
              return Promise.reject();
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .deleteTestStationsList(stationIds)
          .then(() => {
            expect.assertions(1); // should have thrown an error, test failed
          })
          .catch((errorResponse: HTTPError) => {
            expect(spy.mock.calls).toHaveLength(0);
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual("Internal Server Error");
          });
      });

      it("should console log the error message, if a error is passed", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {
          return;
        });
        const TestStationDAOMock = jest.fn().mockImplementation(() => {
          return {
            deleteMultiple: () => {
              return Promise.reject(new Error("It broke"));
            },
          };
        });

        const testStationService = new TestStationService(
          new TestStationDAOMock()
        );

        return testStationService
          .deleteTestStationsList(stationIds)
          .then(() => {
            expect.assertions(1); // should have thrown an error, test failed
          })
          .catch((errorResponse: HTTPError) => {
            expect(spy.mock.calls).toHaveLength(1);
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect(errorResponse.statusCode).toEqual(500);
            expect(errorResponse.body).toEqual("Internal Server Error");
          });
      });
    });
  });
});
