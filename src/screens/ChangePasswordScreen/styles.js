import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Scales } from '@common';
import AppStyles from '../../AppStyles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    InputContainer: {
      height: 42,
      borderWidth: 1,
      borderColor: AppStyles.colorSet['light'].grey3,
      paddingLeft: 20,
      color: AppStyles.colorSet['light'].mainTextColor,
      width: Scales.deviceWidth * 0.8,
      alignSelf: 'center',
      marginTop: 10,
      alignItems: 'center',
      borderRadius: 25,
      textAlign: 'left',
    },
    postInput: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'lightgray',
        borderRadius: 8,
        width: Dimensions.get('window').width * 0.85,
        marginBottom: 10,
        alignSelf: 'center'
    },
    loginBtnText: {
        color: Colors.WHITE,
        fontSize: Scales.moderateScale(17),
       // fontWeight: '700',
        paddingLeft: Scales.moderateScale(8),
        fontFamily: AppStyles.customFonts.klavikaMedium
      },
      loginBtnSection: {
        width: Scales.deviceWidth,
        marginTop: Scales.deviceHeight * 0.02,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      loginBtn: {
        flexDirection: 'row',
        width: Scales.deviceWidth * 0.45,
        height: Scales.deviceHeight * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
      },
      loginBtnContainer: {
        width: Scales.deviceWidth * 0.6,
        height: Scales.deviceHeight * 0.06,
        backgroundColor: '#3494c7',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Scales.deviceHeight * 0.06,
      //  borderBottomLeftRadius: Scales.deviceHeight * 0.06,
        overflow: 'hidden',
        alignSelf: 'center',
      },    
      eyeView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 42,
        paddingTop: 18
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Scales.deviceWidth * 0.9,
        alignSelf: 'center'
      }
})

export default styles;