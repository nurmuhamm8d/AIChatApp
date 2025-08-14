/*
 * Babel configuration for AIChatApp
 *
 * Используется preset Expo, загружает переменные из .env через
 * react-native-dotenv и гарантирует, что плагин Reanimated указан последним.
 */

module.exports = function (api) {
  // Кэшируем конфигурацию, чтобы Babel не пересчитывал её на каждый файл
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Загрузка переменных окружения из .env в модули, импортирующие из '@env'
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: true,
          allowUndefined: true,
        },
      ],

      // Плагин Reanimated (должен быть последним)
      'react-native-reanimated/plugin',
    ],
  };
};
