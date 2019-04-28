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
                "@assets": "./assets",
                "@src": "./src",
                "@components": "./src/components",
                "@constants": "./src/constants",
                "@atoms": "./src/components/atoms",
                "@molecules": "./src/components/molecules",
                "@templates": "./src/components/templates",
                "@screens": "./src/components/screens",
                "@pages": "./src/components/screens",
                "@lib": "./src/lib"
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
                "@assets": "./assets",
                "@src": "./src",
                "@components": "./src/components",
                "@constants": "./src/constants",
                "@atoms": "./src/components/atoms",
                "@molecules": "./src/components/molecules",
                "@templates": "./src/components/templates",
                "@screens": "./src/components/screens",
                "@pages": "./src/components/screens",
                "@lib": "./src/lib"
              },
            }
          ],
        ],
      },
    },
  };
};
