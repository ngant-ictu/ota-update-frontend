
  module.exports = {
    configureWebpack: {
        performance: {
          hints: false
        },
        plugins: [],
        optimization: {
          splitChunks: {
            minSize: 50000,
            maxSize: 250000
          }
        }
      },
  }