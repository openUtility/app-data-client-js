import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/core.esm.js',
            format: 'es',
        },
        {
            file: 'dist/core.umd.js',
            format: 'umd',
            name: 'app-data-client'
        },
        {
            file: 'dist/core.js',
            format: 'cjs'
        }
    ],
    plugins: [typescript()],
};