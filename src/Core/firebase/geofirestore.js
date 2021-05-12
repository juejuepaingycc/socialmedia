import { firebase } from './config';
import * as geofirestore from 'geofirestore';
import { firebaseUser } from '../firebase';

const firestore = firebase.firestore();

// Create a GeoFirestore reference
const GeoFirestore = geofirestore.initializeApp(firestore);

// Create a GeoCollection reference
export const geocollection = GeoFirestore.collection('locations');

// Add a GeoDocument to a GeoCollection
export const addGeolocation = async (id, latitude, longitude) => {
  try{

    let data = {
        name: 'Geofirestore',
        score: 100,
        // The coordinates field must be a GeoPoint!
        coordinates: new firebase.firestore.GeoPoint(latitude, longitude)
      }

    geocollection.doc(id).set(data).then(() => {
      //console.log('Provided document has been added in Firestore');
    }, (error) => {
      console.log('Error: ' + error);
    });

    return { success: true };
  } catch (error) {
    console.log("ERROR LOC >>" + JSON.stringify(error))
    return { error, success: false };
  }
};


export const getNearbyFriends2 = async (latitude, longitude, radius) => {

  try{
    // Create a GeoQuery based on a location
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: radius });
    //1 mile = 1.609344 km
    query.get().then((value) => {
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      console.log("getNearbyFriends>>" + JSON.stringify(value.docs));
      return { success: true, data: value.docs };
    })
    
  } catch (error) {
    return { error, success: false };
  }

};

export const getNearbyFriends = (latitude, longitude, radius) => {
  return new Promise((resolve) => {

    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: radius });
    //1 mile = 1.609344 km

    query.get().then((value) => {
     // console.log("getNearbyFriends>>" + JSON.stringify(value.docs));
      resolve(value.docs); 
    })
    .catch(error => {
      console.log("getNearbyFriends error>>"+ JSON.stringify(error));
      resolve(null);
    });

  });
}
