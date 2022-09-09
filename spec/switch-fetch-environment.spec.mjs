import service from './dist/app-data-client-switch.js';
import * as fetchUtils from 'node-fetch';


describe(`working with app-data-client-switch`, () => {

    describe('working with environments', function () {

        it(`should send the env header`, async function () {
            const fetchWrapper = {
                'fetch': fetchUtils.default
            };
            const okResponse = new fetchUtils.Response("true", { status: 200, statusText: 'OK', });
            const spyFetch = spyOn(fetchWrapper, 'fetch').and.resolveTo(okResponse);
            const opts = { endpoint: 'https://mock.testing.test', environment: 'development' };
            const test = new service.AppDataClientSwitch(opts, fetchWrapper.fetch);
            await test.get('item', true);
            expect(fetchWrapper.fetch).toHaveBeenCalledWith('https://mock.testing.test/switch/item', jasmine.anything());
            expect(spyFetch.calls.mostRecent().args.length).toBe(2);
            expect(spyFetch.calls.mostRecent().args[1].headers.environment).toEqual(opts.environment);
        });

    });
});