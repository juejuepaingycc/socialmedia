import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  noresult: {
    fontSize: hp(3.5),
    fontWeight: 'bold',
    alignSelf: 'center',
  }
})