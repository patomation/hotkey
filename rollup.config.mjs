//@ts-check
import typescript from 'rollup-plugin-typescript2'
import fs from 'fs'

const input = 'src/index.ts'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

export default {
  input: input,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: true,
          sourceMap: true,
        },
        files: [input],
      },
      useTsconfigDeclarationDir: false,
    }),
  ],
}
