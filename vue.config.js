module.exports = {
  devServer: {
    proxy: {
      '/*/_mapping': {
        target: 'http://192.168.0.107:9200/',
        changeOrigin: true
      }
    }
  }
}