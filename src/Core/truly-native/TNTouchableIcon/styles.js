import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    headerButtonContainer: {
      padding: 10,
    },
    icon: {
      margin: 6
    },
    Image: {
      width: 20,
      height: 20,
      margin: 6,
    },
    title: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 12,
    },
    label: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 14,
      paddingRight: 2,
      color: '#595b5e'
    },
    row: {
      flexDirection: 'row'
    }
  });
};

export default dynamicStyles;
