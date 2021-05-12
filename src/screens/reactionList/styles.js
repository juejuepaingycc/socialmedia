import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

const styles = () => {
  return new StyleSheet.create({
    detailPostContainer: {
      flex: 1,
      backgroundColor: 'red'
      //backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    image: {
      width: 50,
      height: 50,
      //borderRadius: 100
    },
    reactIcon: {
      width: 15,
      height: 15,
      //margin: 6,
    },
    name: {
      fontSize: 50
    }
  });
};

export default styles;
