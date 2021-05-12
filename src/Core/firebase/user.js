import { firebase } from './config';

export const usersRef = firebase.firestore().collection('users');

export const getUserData2 = async (userId) => {
  try {
    const user = await usersRef.doc(userId).get();

    return { data: { ...user.data(), id: user.id }, success: true };
  } catch (error) {
    console.log(error);
    return {
      error: 'Oops! an error occured. Please try again',
      success: false,
    };
  }
};

export const getUserWithEmail = async (email) => {
  try {
    const userDoc = await usersRef.where('email', '==', email).get();
    const docs = userDoc.docs;
    if (docs.length > 0) {
      //console.log("User>>"+ JSON.stringify(docs[0].data()));
      return docs[0].data();
    }
    else{
      return null;
    }
  } catch (error) {
    return { error, success: false };
  }
}

export const updateUserData = async (userId, userData) => {
  try {
    const userRef = usersRef.doc(userId);

    await userRef.update({
      ...userData,
    });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export const subscribeUsers222 = async () => {
  usersRef.onSnapshot((querySnapshot) => {
    querySnapshot.forEach(async (doc) => {
      const userRef = usersRef.doc(doc.id);
      await userRef.update({
        push_notifications_enabled: true
      });
  
    });
  });
};

export const subscribeUsers = (userId, callback) => {
  return usersRef.onSnapshot((querySnapshot) => {
    const data = [];
    const completeData = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      data.push({ ...user, id: doc.id });
      completeData.push({ ...user, id: doc.id });
    });
    return callback(data, completeData);
  });
};

export const subscribeCurrentUser = (userId, callback) => {
  const ref = usersRef
    .where('id', '==', userId)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        callback(docs[0].data());
      }
    });
  return ref;
};

export const subscribeUser = (userId) => {
  const ref = usersRef
    .where('id', '==', userId)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        return docs[0].data();
      }
    });
};

export const unblockUser = async (id, dest, callback) => {
  try {
    await firebase.firestore().collection('reports').doc(id).delete();
    callback(dest);
  } catch (error) {
    console.log("unblockUser error>>" + JSON.stringify(error));
    callback(null)
  }
}

export const getBlockedUsers = async (userId, callback) => {
  const userDoc = await firebase.firestore().collection('reports')
  .where('source', '==', userId)
  .where('type', '==', 'block')
  .get();
  
  const docs = userDoc.docs;
  if (docs.length > 0) {
    let temp = []
    for(let i=0;i<docs.length;i++){
      const doc2 = await usersRef
      .where('id', '==', docs[i].data().dest)
      .get();
      const user = doc2.docs[0].data();
      user['blockID'] = docs[i].id; 
      temp.push(user)
    }
    setTimeout(()=> {
      callback(temp)
    }, 2000)
  }
  else{
    callback(null)
  }
};

export const getBlockedInfo = async (id) => {
  const reportDoc = await 
  firebase.firestore().collection('reports')
  .where('id', '==', id)
  .where('type', '==', 'block')
  .get();
  
  const docs = reportDoc.docs;
  if (docs.length > 0) {
    return docs[0].data().dest;
  }
  else{
    return null;
  }
};


export const getUserData = async (userId) => {
  const userDoc = await usersRef
  .where('id', '==', userId)
  .get();
  
  const docs = userDoc.docs;
  if (docs.length > 0) {
    return docs[0].data();
  }
  else{
    return null;
  }
};


