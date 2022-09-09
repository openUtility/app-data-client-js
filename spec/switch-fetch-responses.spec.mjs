import service from './dist/app-data-client-switch.js';
import * as fetchUtils from 'node-fetch';


describe(`working with app-data-client-switch`, () => {

    describe('working with fetch responses', function () {

        it(`should return true when 'true' returned`, async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("true", { status: 200, statusText: 'OK', });
            spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            expect(await test.get('value')).toBeTrue();
        });

        it(`should return false when 'false' returned`, async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("false", { status: 200, statusText: 'OK', });
            spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            expect(await test.get('value')).toBeFalse();
        });
        describe(`failed responses`, () => {

            it(`should return false when endpoint timesout`, async () => {
                const fetchWrapper = {
                    'fetch': fetchUtils.default
                };
                spyOn(fetchWrapper, 'fetch').and.throwError("Timeout");
                spyOn(console, 'error');
                spyOn(console, 'warn');
                const opts = { endpoint: 'https://mock.testing.test' };
                const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
                const rply = await test.get('content');
                expect(console.error).toHaveBeenCalledTimes(1);
                expect(console.warn).toHaveBeenCalledTimes(1);
                expect(rply).toBeFalse();
            });

            it(`should return false when endpoint returns 500`, async () => {
                const fetchWrapper = {
                    'fetch': fetchUtils.default
                };
                const okResponse = new fetchUtils.Response("", { status: 500, statusText: 'Server error', });
                spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
                spyOn(console, 'error');
                const opts = { endpoint: 'https://mock.testing.test' };
                const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
                expect(await test.get('value')).toBeFalse();
                expect(console.error).toHaveBeenCalledTimes(0);
            });

            it(`should return false when endpoint returns 404`, async () => {
                const fetchWrapper = {
                    'fetch': fetchUtils.default
                };
                const okResponse = new fetchUtils.Response("", { status: 404, statusText: 'File not found', });
                spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
                spyOn(console, 'error');
                const opts = { endpoint: 'https://mock.testing.test' };
                const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
                expect(await test.get('value')).toBeFalse();
                
                expect(console.error).toHaveBeenCalledTimes(0);
            });
        });
    });
});