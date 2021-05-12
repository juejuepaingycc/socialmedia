import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    emptyViewContainer: {
      marginTop: height / 5,
    },
    searchBarContainer: {
      width: '100%',
      paddingVertical: 5,
      // ...ifIphoneX(
      //   {
      //     marginTop: 45,
      //   },
      //   {
      //     marginTop: 12,
      //   },
      // ),
      borderBottomWidth: 0.5,
      borderBottomColor: appStyles.colorSet[colorScheme].hairlineColor,
    },
  });
};

export default dynamicStyles;
