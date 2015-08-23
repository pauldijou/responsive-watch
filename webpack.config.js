var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'responsiveWatch.js',
    library: 'responsiveWatch',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};
