import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Scales } from '@common';
import AppStyles from '../../AppStyles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(1.2),
        backgroundColor: Colors.WHITE,
    },
    error: {
        fontSize: 30,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    color: 'black',
    },
    card: {
        //shadowColor: 'white',
        // shadowOpacity: 0.26,
        // shadowOffset: {width: 0, height: 2},
        // shadowRadius: 8,
        // elevation: 5,
        // borderRadius: 10,
        backgroundColor: 'white',
        width: wp(93),
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: hp(0.8)
      },
      block: {
        flexDirection: 'row',
        padding: hp(0),
        width: wp(93),
        borderRadius: 5
      },
      img: {
        width: hp(7),
        height: hp(7),
        borderRadius: 50,
        marginRight: hp(2)
      },
      name: {
        fontWeight: 'bold',
        fontSize: hp(1.8),
        //paddingBottom: hp(0.7)
      },
      time: {
        fontSize: hp(1.8),
        color: 'gray'
      },
      rightView: {
        justifyContent: 'center'
      },
      unblockView: {
        backgroundColor: '#3494c7',
        borderRadius: hp(1),
        paddingVertical: hp(1),
        paddingHorizontal: hp(1.5),
        alignSelf: 'center',
        position: 'absolute',
        right: hp(1)
      },
      unblock: {
        fontSize: hp(2),
        color: 'white',
        textAlign: 'center'
      }
})

export default styles;