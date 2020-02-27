import typescript from 'rollup-plugin-typescript2'

const input = 'src/index.ts'

export default {
  input: input,
  output: {
    dir: 'lib',
    format: 'cjs'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: true,
          sourceMap: true
        },
        files: [input]
      },
      useTsconfigDeclarationDir: false
    })
  ]
}
