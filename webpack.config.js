const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const esLintPlugin = (isDev) => (!isDev ? [new ESLintPlugin({ extensions: ['ts', 'js'] })] : []);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

// const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`) для расширения 'js' 'css'
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
  // добавляет карты для удобства разработки
  // devtool: isDev ? 'source-map' : '',
  devServer: {
    port: 8080,
    hot: isDev,
  },
  plugins: [
    ...esLintPlugin(isDev),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    // копировать из одного места в другое !!!
    // new CopyWebpackPlugin([
    // 	{
    // 		from: '',
    // 		to: ''
    // 	}
    // ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg)$/i,
        use: ['file-loader'],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        use: ['file-loader'],
      },
    ],
  },
};
