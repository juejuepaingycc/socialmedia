import { StyleSheet } from 'react-native';
import { Scales, Colors } from '@common';

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#3494c7',
    flex: 1
  },
  card: {
    paddingVertical: 13,
    paddingLeft: 16,
    width: Scales.deviceWidth * 0.9,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: '5%',
    backgroundColor: '#3494c7',
    borderRadius: 20,
    alignSelf: 'center',
    height: 55,
    //flexDirection: 'row',
    //justifyContent: 'space-between'
    //marginHorizontal: 20,
  },
  text: {
      fontSize: 18,
      color: 'white',
      paddingLeft: 8,
      //alignSelf: 'center'
  },
  btn: {
    marginTop: -13,
  },
  dateView: {
    paddingTop: 30,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  date: {
    fontSize: 17,
    color: 'white'
  },
  titleView: {
    flexDirection: 'row',
   // flex: 1,
    marginTop: 20,
    marginBottom: -20
  },
  title: {
    color: 'white',
    flex: 0.45,
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    //flex: 1,
    //height: 60,
  },
  titleLeft: {
    flexDirection: 'row',
    flex: 0.4,

  },
  leftView1: {
    flexDirection: 'row',
    flex: 0.4,
    paddingTop: 10
  },
  titleRight: {
    flexDirection: 'row',
    flex: 0.6,
    height: 50,
  },
  rightView: {
    flexDirection: 'row',
    flex: 0.6,
    height: 50,
  },
  image: {
    width: 50,
    height: 30,
   // borderRadius: 50
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center'
  },
  btn: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'white',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.45,
    marginLeft: 5
  },
  price: {
    color: 'white',
    fontSize: 17
  }
})