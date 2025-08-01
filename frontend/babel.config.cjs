module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
    [
      'babel-preset-vite',
      {
        env: true,
        glob: false,
      },
    ],
  ],
  plugins: [],
}
