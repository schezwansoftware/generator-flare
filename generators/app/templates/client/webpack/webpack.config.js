const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'STABLE_FEATURE': JSON.stringify(true),
      'EXPERIMENTAL_FEATURE': JSON.stringify(false)
    })
  ],
  devServer: {
    proxy: [{
      context: [
        '/api',
      ],
      target: `http://localhost:5000/`,
      secure: false,
      changeOrigin: true
    }],
    historyApiFallback: true
  }
};