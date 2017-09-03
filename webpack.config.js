const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const historyApiFallback = require('connect-history-api-fallback')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PRODUCTION = process.env.NODE_ENV === 'production'
const filterFalsy = arr => arr.filter(e => e)
const ROOT_PATH = path.resolve(__dirname)

console.log('Building for:', process.env.NODE_ENV)

const extractSass = new ExtractTextPlugin({
  filename: 'vexed.css'
})

const autoprefix = () => {
  return {
    loader: 'postcss-loader',
    options: {
      plugins: () => [require('autoprefixer')],
    },
  }
}

const createPlugins = () =>
  filterFalsy([
    PRODUCTION &&
      new webpack.optimize.UglifyJsPlugin({
        ecma: 8,
        compress: {
          warnings: false,
          drop_console: false,
        },
        mangle: {
          screw_ie8: true,
        },
        sourceMap: true,
      }),

    new HtmlWebpackPlugin({
      title: 'Vexed',
      template: path.join(ROOT_PATH, './src/template/index.ejs'),
      filename: 'index.html',
      scriptName: 'bundle.js',
      cssName: 'vexed.css'
    }),

    new CopyWebpackPlugin([
      {
        from: path.join(ROOT_PATH, './src/favicon.ico'),
        to: path.join(ROOT_PATH, './public'),
      },
      {
        from: path.join(ROOT_PATH, './src/json/topo.json'),
        to: path.join(ROOT_PATH, './public/'),
      }
    ]),

    PRODUCTION && extractSass,

    !PRODUCTION &&
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: {
          baseDir: 'public',
          middleware: [historyApiFallback()],
        },
        files: 'public/**',
      }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ])

const getCssLoader = () =>
  PRODUCTION
    ? extractSass.extract({
      fallback: 'style-loader',
      use: ['css-loader', autoprefix(), 'sass-loader'],
    })
    : ['style-loader', 'css-loader', 'sass-loader']

const getImageLoader = () =>
  PRODUCTION
   ? 'file-loader'
    : 'url-loader'

module.exports = {
  entry: ['babel-polyfill', './src/js/app.js'],
  output: {
    path: path.join(ROOT_PATH, '/public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: [
              'env',
            ],
            plugins: ['transform-object-rest-spread'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: getCssLoader(),
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: getImageLoader(),
      }
    ],
  },
  devtool: 'inline-source-map',
  plugins: createPlugins(),
}
