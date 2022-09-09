import service from './dist/app-data-client-switch.js';
import * as fetchUtils from 'node-fetch';


describe(`working with app-data-client-switch`, () => {

    describe('working with window fetch', function () {
        describe(`working with messages`, () => {
            it(`should error when no global fetch, or fetch passed`, () => {
                const opts = { endpoint: 'https://mock.testing.test' };
                expect(() => new service.AppDataClientSwitch(opts)).toThrowError();
            });

            it(`should error when no url was passed`, () => {
                const opts = null;
                expect(() => new service.AppDataClientSwitch(opts, fetchUtils.default)).toThrowError();
            });
        });
        
        it('should attempt to call a passed endpoint', async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("true", { status: 200, statusText: 'OK', });
            spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            await test.get('testing');
            expect(fetchWrapper.fetch).toHaveBeenCalledWith(opts.endpoint + '/switch/testing', jasmine.anything());
        });
    });
});