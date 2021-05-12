import { StyleSheet } from 'react-native';
import { Colors, Scales } from '@common';
import AppStyles from '../../AppStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const navIconSize = 25;

const styles = new StyleSheet.create({
  doubleNavIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    paddingLeft: hp(1.2)
  },
  container: {
    flex: 1,  
   // width: Scales.deviceWidth
  },
  navIcon: {
    width: navIconSize,
    height: navIconSize,
    margin: 6,
  },
  noticount: {
    color: 'white', 
    fontSize: hp(1.2)
  },
  notiCount: {
    backgroundColor: 'green',
    width: hp(3.2),
    height: hp(2.2),
    borderRadius: hp(0.8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#216a91',
    position: 'absolute',
    marginTop: hp(-1.1),
    marginLeft: hp(1.3),
    zIndex: 2,
  },
  bell: {
    marginRight: hp(2.5)
  },
  navIconMenuOptions: {
    flexDirection: 'row',
    width: null,
  },
  slideContainer: {
       height: Scales.deviceHeight * 0.09,
       bottom: -4,
       position: 'absolute',
     },
     image: {
      width: hp(2.7),
      height: hp(2.7),
    },
    title1: {
      color:'#e6c262', 
      fontSize:35 ,
       paddingLeft: 10, 
       paddingRight: 15, fontFamily: AppStyles.customFonts.vegan,
      width: Scales.deviceWidth * 0.7
    },
    navIconMenuOptions: {
      flexDirection: 'row',
      width: null,
      padding: 15,
      paddingRight: 50,
      borderRadius: 10,
      marginTop: 40,
      marginRight: 6
    },
    row: {
      flexDirection: 'row',
      paddingBottom: 5,
    },
    name: {
      fontSize: 17,
      paddingLeft: 10,
      color: '#546d7a'
    },
    name3: {
      fontSize: hp(2),
      paddingLeft: 10,
      color: '#546d7a'
    },
    name2: {
      fontSize: hp(1.6),
      color: '#83888a',
      paddingBottom: hp(1),
    },
    storyView: {
      backgroundColor: '#fafcfc',
      width: 67,
      paddingVertical: 8,
      borderRadius: 9,
      alignSelf: 'flex-end',
      position: 'absolute',
      zIndex: 2,
      right: 10
    }
});

export default styles;
