module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Spring Boot 주소
        changeOrigin: true
      },
      "/swagger-ui.html": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/swagger-ui": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      "/v3/api-docs": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    }
  }
}