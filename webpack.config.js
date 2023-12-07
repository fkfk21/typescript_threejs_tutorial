const nodeExternals = require('webpack-node-externals');

// webpackの設定ファイル
const commonConfig = {
  mode: 'development',
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    // 拡張子を配列で指定
    extensions: [ '.ts', '.js'],
  },
};

const clientConfig = {
  ...commonConfig,
  entry: {"index": './src/index.ts'},
};

const serverConfig = {
  ...commonConfig,
  externals: [nodeExternals()],
  entry: {"server": './src/webserver.ts'},
  target: 'node',
  resolve: {
    fallback: {
      // "path": require.resolve("path-browserify"),
      // "http": require.resolve("stream-http"),
      // "url": require.resolve("url/"),
    }
  },
};

module.exports = [clientConfig, serverConfig];