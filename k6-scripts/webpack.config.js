const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const GlobEntries = require('webpack-glob-entries')

module.exports = env => ({
  mode: 'production',
  entry: GlobEntries(`./${env.suite ?? '**'}/tests/*.ts`), // Generates multiple entry for each test
  output: {
    path: path.join(__dirname, 'build'),
    libraryTarget: 'commonjs',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
      },
    ],
  },
  target: 'web',
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  devtool: 'source-map',
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'assets'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  optimization: {
    minimize: false,
  },
  experiments: {
    outputModule: true,
  },
})
