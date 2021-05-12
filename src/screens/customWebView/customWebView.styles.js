import {StyleSheet} from 'react-native';
import {Scales, Colors} from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  nameText: {
    fontSize: Scales.moderateScale(12),
    fontWeight: '700',
    color: Colors.GRAY,
  },
  WebView: {
    width: '100%',
   // position: 'absolute'
    //height: '100%',
  },
  selectView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 0
    //height: '100%',
  },
  modalbg: {
    //marginTop: 100
    borderRadius: 10,
    marginTop: 100
  },
  selectImg: {
    width: '15%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 3
  },
  selectImg2: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 3
  },
  choiceView: {
    width: '20%',
    height: '12%',
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  }
});
