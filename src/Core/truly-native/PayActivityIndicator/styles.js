import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  text: {
    color: 'gray',
    padding: 0,
    marginTop: -20
  },
  activityIndicatorWrapper: {
    backgroundColor: '#f5efed',
    height: 100,
    width: 120,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  indicatorContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  text: {
    color: '#3494c7',
    fontSize: 15,
    marginBottom: 10,
  },
});

export default styles;
