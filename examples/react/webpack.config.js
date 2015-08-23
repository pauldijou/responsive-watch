var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, 'app')
  ],

  output: {
    path: __dirname,
    filename: 'app.bundle.js'
  },

  resolve: {
    alias: {
      'responsive-watch': path.join(__dirname, '..', '..', 'src')
    },
    extensions: ['', '.js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: [__dirname, path.join(__dirname, '..', '..', 'src')]
    }]
  }
};
