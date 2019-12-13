module.exports = {
    configureWebpack: {
      resolve: {
        // extensions: []
        alias: {
          'assets': '@/assets',
          'components': '@/components',
          'views': '@/views',
        }
      }
    }
  };