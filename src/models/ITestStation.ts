export interface ITestStation {
    testStationId: string;
    testStationPNumber: string;
    testStationStatus?: string | null;
    testStationName: string;
    testStationContactNumber: string;
    testStationAccessNotes: string;
    testStationGeneralNotes: string;
    testStationTown: string;
    testStationAddress: string;
    testStationPostcode: string;
    testStationLongitude: number;
    testStationLatitude: number;
    testStationType: string;
    testStationEmails: string[];
}
