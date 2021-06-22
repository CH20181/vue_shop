module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // '@': 'src',
        // 别名配置
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',

      }
    }
  }
}
