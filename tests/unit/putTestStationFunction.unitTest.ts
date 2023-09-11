import stations from "../resources/test-stations.json";
import { ITestStation } from "../../src/models/ITestStation";
import { putTestStation } from "../../src/functions/putTestStation";
import { TestStationService } from "../../src/services/TestStationService";

jest.mock("../../src/services/TestStationService");

let testStation: ITestStation;

describe("putTestStation Handler", () => {
  beforeEach(() => {
    testStation = Object.assign({}, stations[0]);
  });

  context("Service puts without exception", () => {
    it("resolves without exception", async () => {
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });
  });

  context("Service throws error", () => {
    it("should throw that error upwards and ultimately return it", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementationOnce(() => {
          return Promise.reject(new Error(errorMessage));
        });
      expect.assertions(2);
      try {
        await putTestStation(testStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual(errorMessage);
      }
    });
  });

  context("Test station object validation", () => {
    it("An unknown key should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.invalidKey = "invalidValue";
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"invalidKey" is not allowed');
      }
    });

    it("An invalid status should throw an error.", async () => {
      const invalidTestStation = testStation;
      invalidTestStation.testStationStatus = "on holiday";
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual(
          '"testStationStatus" must be one of [pending, active, suspended, termination requested, terminated]'
        );
      }
    });

    it("An invalid type should throw an error.", async () => {
      const invalidTestStation = testStation;
      invalidTestStation.testStationType = "school";
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual(
          '"testStationType" must be one of [atf, tass, gvts, potf, hq, other]'
        );
      }
    });

    it("An invalid longitude should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationLongitude = "north a bit";
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationLongitude" must be a number');
      }
    });

    it("A missing testStationAccessNotes should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationAccessNotes = undefined;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A null testStationAccessNotes should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationAccessNotes = null;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A missing testStationAddress should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationAddress = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationAddress" is required');
      }
    });

    it("A missing testStationContactNumber should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationContactNumber = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationContactNumber" is required');
      }
    });

    it("A missing testStationEmails should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationEmails = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationEmails" is required');
      }
    });

    it("A missing testStationGeneralNotes should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationGeneralNotes = undefined;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A null testStationGeneralNotes should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationGeneralNotes = null;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A missing testStationId should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationId = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationId" is required');
      }
    });

    it("A missing testStationLatitude should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationLatitude = undefined;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A null testStationLatitude should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationLatitude = null;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A missing testStationLongitude should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationLongitude = undefined;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A null testStationLongitude should not throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationLongitude = null;
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation(testStation)).resolves;
    });

    it("A missing testStationName should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationName = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationName" is required');
      }
    });

    it("A missing testStationPNumber should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationPNumber = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationPNumber" is required');
      }
    });

    it("A missing testStationPostcode should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationPostcode = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationPostcode" is required');
      }
    });

    it("A missing testStationStatus should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationStatus = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationStatus" is required');
      }
    });

    it("A missing testStationTown should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationTown = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationTown" is required');
      }
    });

    it("A missing testStationType should throw an error.", async () => {
      const invalidTestStation: any = testStation;
      invalidTestStation.testStationType = undefined;
      expect.assertions(2);
      try {
        await putTestStation(invalidTestStation);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toEqual('"testStationType" is required');
      }
    });
  });
});
