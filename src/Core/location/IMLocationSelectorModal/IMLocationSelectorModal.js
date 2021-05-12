import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import { useColorScheme } from 'react-native-appearance';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Geolocation from '@react-native-community/geolocation';
import dynamicStyles from './styles';
import Geocoder from 'react-native-geocoder';

const locationDelta = { latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
// Geocoder.init('AIzaSyCc-7cU3-_x1VTV5eW3g2pVnl3vi9lvv7w');
//const googleApiKey = 'AIzaSyCc-7cU3-_x1VTV5eW3g2pVnl3vi9lvv7w';
const googleApiKey = 'AIzaSyBDU8e4C855ZJPaBC9JDBc9wDUacuqYdM8';

function IMLocationSelectorModal(props) {
  const { onCancel, isVisible, onChangeLocation, onDone, appStyles } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [address, setAddress] = useState(' ');

  useEffect(() => {
      getCurrentPosition();
  }, []);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setRegion(position.coords);
        onLocationChange(position.coords);
      },
      (error) => {
        alert(error.message);
      },
    );
  };

  const onLocationChange = async (location) => {
    console.log("onLocationChange>>"+ JSON.stringify(location));
      try {
        let json = await Location.reverseGeocodeAsync(location);
  
        const choosenIndex = Math.floor(json.length * 0.8);
        const formatted_address = `${json[choosenIndex].city}, ${json[choosenIndex].region}.`;
        setAddress(formatted_address);
        onChangeLocation(formatted_address);
      } catch (error) {
        console.log(error);
        setAddress('');
      }
  };

  const setLocationDetails = (data, details) => {
    const { geometry, name } = details;
    
    if (geometry) {
      setRegion({
        longitude: geometry.location.lng,
        latitude: geometry.location.lat,
      });
    }
    else{
      //get LatLng
      Geocoder.geocodeAddress(details.formatted_address).then(res => {
        //console.log("Geocode>>"+ JSON.stringify(res))
        setRegion({
          longitude: res[0].position.lng,
          latitude: res[0].position.lat,
        });
      })

    .catch(err =>  console.log("Geocode err>>"+ JSON.stringify(err)))
    }

    if (name) {
      console.log("setAddress setLocationDetails>>" + name);
      setAddress(name);
      onChangeLocation(name);
    }
  };

  const onMapMarkerDragEnd = (location) => {
    const region = location.nativeEvent.coordinate;
    setRegion(region);
    onLocationChange(region);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onCancel}>
      <SafeAreaView style={styles.container}>

        <View style={styles.navBarContainer}>
            <TouchableOpacity style={styles.btn} onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => onDone(address)}>
              <Text style={styles.btnText}>Done</Text>
            </TouchableOpacity>
        </View>

        <GooglePlacesAutocomplete
          placeholder={'Enter location address'}
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={(row) => row.description} // custom description render
          onPress={(data, details = null) => {
           // console.log("pressed..." + JSON.stringify(data))
            const { formatted_address } = details;
            console.log("setAddress 2>>" + JSON.stringify(details));
            setAddress(formatted_address);
            onChangeLocation(formatted_address);
            setLocationDetails(data, details);
          }}
          getDefaultValue={() => ''}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: googleApiKey,
            language: 'en',
          }}
          styles={{
            container: styles.placesAutocompleteContainer,
            textInputContainer: styles.placesAutocompleteTextInputContainer,
            textInput: styles.placesAutocompleteTextInput,
            description: styles.placesAutocompletedDescription,
            predefinedPlacesDescription: styles.predefinedPlacesDescription,
            poweredContainer: styles.predefinedPlacesPoweredContainer,
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
        <MapView
          style={styles.mapContainer}
          region={{
            ...region,
            ...locationDelta,
          }}>
          <Marker
            draggable={true}
            onDragEnd={onMapMarkerDragEnd}
            coordinate={region}
          />
        </MapView>
      </SafeAreaView>
    </Modal>
  );
}

IMLocationSelectorModal.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onDone: PropTypes.func,
  onChangeLocation: PropTypes.func,
};

export default IMLocationSelectorModal;
