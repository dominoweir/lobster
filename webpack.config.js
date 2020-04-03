const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/LobsterLogView.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css'
    })
  ]
};
