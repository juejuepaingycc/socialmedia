import { StyleSheet } from 'react-native';
import AppStyles from '../../../AppStyles';
import {Scales, Colors} from '@common';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    feedContainer: {
      flex: 1,
      //backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    //  backgroundColor: '#cdcfd1',
    //  marginBottom: 30,
    //  width: Scales.deviceWidth
    },
    emptyStateView: {
      marginTop: 50,
    },
    loadMoreBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 15,
      paddingBottom: 10
    },
    btnText2: {
      color: '#3494c7',
      fontSize: 15,
      textAlign: 'center',
    },
    moreBtn: {
      alignItems: 'center',
      paddingBottom: 7,
      paddingTop: 0
    },
    moreIcon: {
      fontWeight: 'bold'
    },
    loadmore: {
      color: 'gray',
      fontSize: 11,
      margin: 0
    },
    loadmoreBtn: {
      alignItems: 'center',
      paddingVertical: 4,
      width: 130,
      alignSelf: 'center',
      borderRadius: 6,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 8,

      backgroundColor: '#3494c7',
      //borderWidth: 1,
      //borderColor: '#3494c7'
    },
    loadmoreText: {
      fontSize: 15,
      paddingRight: 5,
      color: 'white',
    },
    nomore: {
      color: 'gray',
      fontSize: 13,
      marginBottom: 10,
      textAlign: 'center'
    }
  });
};

export default dynamicStyles;
