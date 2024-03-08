const isRemoveConsole = process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : []
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset', ['@babel/preset-env', { modules: false }]],
  plugins: [
    ...isRemoveConsole,
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ],
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
