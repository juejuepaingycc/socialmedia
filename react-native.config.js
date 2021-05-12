module.exports = {
  dependencies: {
    // 'react-native-image-filter-kit': {
    //   platforms: {
    //     android: null, // disable Android platform, other platforms will still autolink if provided
    //   },
    // },
    '@react-native-community/cameraroll': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};

module.exports = {
  project: {
      ios: {},
      android: {},
  },
  assets: ['./src/assets/fonts/'],
};