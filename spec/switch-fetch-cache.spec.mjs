import service from './dist/app-data-client-switch.js';
import * as fetchUtils from 'node-fetch';

describe(`working with app-data-client-switch`, () => {

    describe('keeping cache results', function () {
        
        it(`should cache a true result on later calls`, async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("true", { status: 200, statusText: 'OK', });
            spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            const rply1 = await test.get('content');
            const rply2 = await test.get('content');
            expect(fetchWrapper.fetch).toHaveBeenCalledTimes(1);
            
            expect(rply1).toBeTrue();
            expect(rply2).toBeTrue();
        });

        it(`should cache a false result on later calls`, async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("false", { status: 200, statusText: 'OK', });
            spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            const rply1 = await test.get('content');
            const rply2 = await test.get('content');
            expect(fetchWrapper.fetch).toHaveBeenCalledTimes(1);
            
            expect(rply1).toBeFalse();
            expect(rply2).toBeFalse();
        });
    }); 

    describe(`force should trigger refresh`, () => {
        
        it(`should make a second request if refresh is passed`, async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("true", { status: 200, statusText: 'OK', });
            const okResponse2 = new fetchUtils.Response("false", { status: 200, statusText: 'OK', });
            
            const fetchSpy = spyOn(fetchWrapper, 'fetch');
            fetchSpy.and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            const rply1 = await test.get('new-content');
            fetchSpy.and.resolveTo(okResponse2);
            const rply2 = await test.get('new-content', true);
            expect(fetchWrapper.fetch).toHaveBeenCalledTimes(2);
            
            expect(rply1).toBeTrue();
            expect(rply2).toBeFalse();
        });
        
    });
});
