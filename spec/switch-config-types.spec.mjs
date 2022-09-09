import service from './dist/app-data-client-switch.js';
import * as fetchUtils from 'node-fetch';


describe(`working with app-data-client-switch2`, () => {

    const fetchWrapper = {
        'fetch': fetchUtils.default
    };
    let fetchSpy = null;
    let okResponse = null;

    beforeEach(() => {
        fetchSpy = spyOn(fetchWrapper, 'fetch');
        okResponse = new fetchUtils.Response("true", { status: 200, statusText: 'OK', });    
    });

    describe('working with config promise', () => {
        let conPrm = null;
        beforeEach(() => {
            conPrm = new Promise((res, _) => {
                setTimeout(() => res({ endpoint: 'https://mock.testing.test' }), 10);
            });
        })

        it(`should accept a config in a promise wrapper`, async () => {
            fetchSpy.and.resolveTo(okResponse);

            const test = new service.AppDataClientSwitch(conPrm, fetchWrapper.fetch);
            await test.get('data');
            expect(fetchWrapper.fetch).toHaveBeenCalledWith('https://mock.testing.test/switch/data', jasmine.anything());
        });

        it(`should be able to handle multiple request with a promise`, async () => {
            fetchSpy.and.resolveTo(okResponse);
            const test = new service.AppDataClientSwitch(conPrm, fetchWrapper.fetch);
            await test.get('data');
            fetchSpy.and.resolveTo(new fetchUtils.Response("false", { status: 200, statusText: 'OK', }));
            await test.get('data2');
            expect(fetchWrapper.fetch).toHaveBeenCalledTimes(2);
        });

        it(`should throw an error when the promise rejects`, async () => { 
            conPrm = new Promise((_, rej) => {
                setTimeout(() => rej(new Error('FAILED!!!')), 10);
            });
            const test = new service.AppDataClientSwitch(conPrm, fetchWrapper.fetch);
            await expectAsync(test.get('data')).toBeRejectedWithError('FAILED!!!');
        });
    });

    describe('working with config function', () => {
        let conFn = null;
        let cnt = 0;
        beforeEach(() => {
            cnt = 0;
            conFn = () => {
                let _cnt = ++cnt;
                return { endpoint: `https://mock.testing.test_${_cnt}` };
            };
        });

        it(`should return a new config on every function call`, async () => {
            fetchSpy.and.resolveTo(okResponse);
            const test = new service.AppDataClientSwitch(conFn, fetchWrapper.fetch);
            await test.get('data');
            fetchSpy.and.resolveTo(new fetchUtils.Response("false", { status: 200, statusText: 'OK', }));
            await test.get('data2');
            fetchSpy.and.resolveTo(new fetchUtils.Response("true", { status: 200, statusText: 'OK', }));
            await test.get('data3');
            expect(fetchWrapper.fetch).toHaveBeenCalledTimes(3);
            expect(fetchWrapper.fetch).toHaveBeenCalledWith('https://mock.testing.test_1/switch/data', jasmine.anything());
            expect(fetchWrapper.fetch).toHaveBeenCalledWith('https://mock.testing.test_2/switch/data2', jasmine.anything());
            expect(fetchWrapper.fetch).toHaveBeenCalledWith('https://mock.testing.test_3/switch/data3', jasmine.anything());
            expect(cnt).toBe(3);

        })

    });
});