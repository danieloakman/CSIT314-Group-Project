module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      development: {
        plugins: [
          ["module-resolver",
            {
              root: ["./src"
              ],
              alias: {
                "@src": "./src",
                "@components": "./src/components",
                "@atoms": "./src/components/atoms",
                "@molecules": "./src/components/molecules",
                "@templates": "./src/components/templates",
                "@screens": "./src/components/screens",
                "@pages": "./src/components/screens",
                "@lib": "./src/lib",
                "@model": "./src/lib/model",
                "@database": "./src/lib/services/database",
                "@constants": "./src/constants",
                "@assets": "./assets",
              },
            }
          ],
        ],
      },
      production: {
        plugins: [
          ["module-resolver",
            {
              root: ["./src"
              ],
              alias: {
                "@src": "./src",
                "@components": "./src/components",
                "@atoms": "./src/components/atoms",
                "@molecules": "./src/components/molecules",
                "@templates": "./src/components/templates",
                "@screens": "./src/components/screens",
                "@pages": "./src/components/screens",
                "@lib": "./src/lib",
                "@model": "./src/lib/model",
                "@database": "./src/lib/services/database",
                "@constants": "./src/constants",
                "@assets": "./assets",
              },
            }
          ],
        ],
      },
    },
  };
};
