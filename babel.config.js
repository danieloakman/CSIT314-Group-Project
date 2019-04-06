module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      development: {
        plugins: [
          ['module-resolver',
            {
              root: ['./src'
              ],
              alias: {
                '@assets': './assets',
                '@src': './src',
                '@components': './src/components'
              },
            }
          ],
        ],
      },
    },
  };
};
