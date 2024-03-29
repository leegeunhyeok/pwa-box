module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'PWA Box';
      return args;
    });
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'PWA Box',
        appId: 'dev.geundung.pwa',
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 130,
              y: 150,
              type: 'file',
            },
          ],
        },
        mac: {
          icon: 'build/icons/icon.icns',
        },
        win: {
          icon: 'build/icons/icon.ico',
        },
        linux: {
          icon: 'build/icons',
        },
      },
    },
  },
};
