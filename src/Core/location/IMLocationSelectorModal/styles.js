import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    //
    navBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      //paddingVertical: 10,
      height: 40,
      width: '100%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      paddingHorizontal: 10
      //zIndex: 1,
    },

    btnText: {
      color: '#3494c7',
      fontSize: 14
    },
    btn: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
    }
    ,
    // GooglePlacesAutocomplete
    placesAutocompleteContainer: {
      ...ifIphoneX(
        {
          marginTop: 46,
        },
        {
          marginTop: 40,
        },
      ),
      //height: '40%',
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      position: 'absolute',
      width: '100%',
      zIndex: 2
    },
    placesAutocompleteTextInputContainer: {
      width: '100%',
      backgroundColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
    placesAutocompleteTextInput: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    placesAutocompletedDescription: {
      fontWeight: '400',
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
    },
    predefinedPlacesDescription: {
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
    },
    predefinedPlacesPoweredContainer: {
     // backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,

    },
    mapContainer: {
      width: '100%',
      height: '88%',
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      zIndex: 1
    },
  });
};

export default dynamicStyles;
