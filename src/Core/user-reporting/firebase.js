import { firebase } from '../firebase/config';

const abuseDBRef = firebase.firestore().collection('reports');

export const unmarkAbuse = async (id, callback) => {
  try {
    await abuseDBRef.doc(id).delete();
    callback(true);
  } catch (error) {
    console.log("unmarkAbuse error>>" + JSON.stringify(error));
    callback(false)
  }
};

export const markAbuse = (outBoundID, toUserID, abuseType) => {
  if (outBoundID == toUserID) {
    return Promise((r) => {
      r();
    });
  }
  return new Promise((resolve) => {
    const data = {
      dest: toUserID,
      source: outBoundID,
      type: abuseType,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    abuseDBRef
      .add(data)
      .then(() => {
        resolve({ success: true });
      })
      .catch((error) => {
        resolve({ error: error });
      });
  });
};

export const unsubscribeAbuseDB = (userID, callback) => {
  abuseDBRef.onSnapshot((querySnapshot) => {
    //.where('source', '==', userID)
    const abuses = [];
    querySnapshot.forEach((doc) => {
      if(doc.data().source == userID || doc.data().dest == userID){
        let temp = doc.data();
        temp['blockID'] = doc.id;
        abuses.push(temp);
      }
    });
    return callback(abuses);
  });
};
