module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Spring Boot 주소
        changeOrigin: true
      }
    }
  }
}