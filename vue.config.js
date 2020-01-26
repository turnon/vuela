module.exports = {
  devServer: {
    proxy: {
      '/*/_search': {
        target: 'http://192.168.0.107:9200/',
        changeOrigin: true
      },
      '/*/_mapping': {
        target: 'http://192.168.0.107:9200/',
        changeOrigin: true
      }
    }
  }
}
