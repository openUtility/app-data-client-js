import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";

export default [{
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/bundle.esm.js',
            format: 'es',
        },
        {
            file: 'dist/bundle.umd.js',
            format: 'umd',
            name: 'app-data-client'
        },
        {
            file: `dist/bundle.js`,
            format: 'cjs',
            sourcemap: true,
            exports: 'default',
        },
    ],
    plugins: [typescript()],
},
{
    input: 'src/index.ts',
    output: [{ file: "dist/bundle.d.ts", format: "es" }],
    plugins: [dts()],
  }];