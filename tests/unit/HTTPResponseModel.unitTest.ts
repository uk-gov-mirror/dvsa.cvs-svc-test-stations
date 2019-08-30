import { HTTPResponse } from "../../src/models/HTTPResponse";
import {expect} from "chai";

describe("HTTP Response Model", () => {
    context("Constructor", () => {
        it("creates Headers (with seed headers)", () => {
            const resp = new HTTPResponse(418, "winning", {thing: true});
            expect(resp.headers["Access-Control-Allow-Origin"]).to.exist;
            expect(resp.headers["Access-Control-Allow-Credentials"]).to.exist;
            expect(resp.headers["X-Content-Type-Options"]).to.exist;
            expect(resp.headers["X-XSS-Protection"]).to.exist;
            expect(resp.headers.thing).to.exist;
            expect(resp.statusCode).to.equal(418);
            expect(resp.body).to.equal(JSON.stringify("winning"));
        });
        it("creates Headers (without  seed headers)", () => {
            const resp = new HTTPResponse(418, "winning");
            expect(resp.headers["Access-Control-Allow-Origin"]).to.exist;
            expect(resp.headers["Access-Control-Allow-Credentials"]).to.exist;
            expect(resp.headers["X-Content-Type-Options"]).to.exist;
            expect(resp.headers["X-XSS-Protection"]).to.exist;
            expect(resp.headers.thing).to.not.exist;
            expect(resp.statusCode).to.equal(418);
            expect(resp.body).to.equal(JSON.stringify("winning"));
        });
    });
});
