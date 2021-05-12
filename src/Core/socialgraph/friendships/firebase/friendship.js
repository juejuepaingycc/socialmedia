import { firebaseUser } from '../../../firebase';
import { firebasePost, firebaseStory } from '../../feed/firebase';
import { notificationManager } from '../../../notifications';
import { IMLocalized } from '../../../localization/IMLocalization';
import { firebase } from '../../../firebase/config';

const usersRef = firebase.firestore().collection('users');

const friendshipsRef = firebase.firestore().collection('friendships');

const onCollectionUpdate = (querySnapshot, callback) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return callback(data, usersRef);
};

export const subscribeToInboundFriendships = (userId, callback) => {
  return friendshipsRef
    .where('user2', '==', userId)
    .onSnapshot((querySnapshot) => onCollectionUpdate(querySnapshot, callback));
};

export const subscribeToOutboundFriendships = (userId, callback) => {
  return friendshipsRef
    .where('user1', '==', userId)
    .onSnapshot((querySnapshot) => onCollectionUpdate(querySnapshot, callback));
};

export const addFriendRequest = (
  outBound,
  toUser,
  persistFriendshipsCounts,
  extendFollowers,
  enableFeedUpdates,
  notiMessage,
  notiType,
  callback,
) => {
  const outBoundID = outBound.id;
  const toUserID = toUser.id;
  if (outBoundID == toUserID) {
    callback(null);
    return;
  }

  friendshipsRef
    .add({
      user1: outBoundID,
      user2: toUserID,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      if (persistFriendshipsCounts) {
        updateFriendshipsCounts(outBoundID);
        updateFriendshipsCounts(toUserID);
      }
      if (enableFeedUpdates) {
        if (extendFollowers) {
          // We followed someone so we populate our own feed with posts from that person
          firebasePost.hydrateFeedForNewFriendship(outBoundID, toUserID);
          firebaseStory.hydrateStoriesForNewFriendship(outBoundID, toUserID);
        }
      }
      var notificationBody =
        outBound.firstName +
        ' ' +
        notiMessage
        // outBound.lastName +
        // ' ' +
        // (extendFollowers
        //   ? IMLocalized('just followed you.')
        //   : IMLocalized('sent you a friend request.'));
      notificationManager.sendPushNotification(
        toUser,
        outBound.firstName + ' ' + outBound.lastName,
        notificationBody,
        notiType,
        { outBound },
        0,
        0
      );
      callback({ success: true });
    })
    .catch((error) => {
      callback({ error: error });
    });
};

export const cancelMainFeedsOnUnfriend = (
  currentUserID, 
  toUserID,
  callback
) => {
  if (currentUserID == toUserID) {
    callback(null);
    return;
  }

  const feedRef = firebase
  .firestore()
  .collection('social_feeds')
  .doc(currentUserID)
  .collection('main_feed');

  const query = firebase
          .firestore()
          .collection('social_feeds')
          .doc(currentUserID)
          .collection('main_feed')
          .where('authorID', '==', toUserID);

          const db = firebase.firestore();
          let batch = db.batch();
          const unsubscribe = query.onSnapshot((querySnapshot) => {
            if (querySnapshot) {
              querySnapshot.forEach((doc) => {
                let ref = feedRef.doc(doc.id);
                batch.delete(ref);
              });
              // Commit the batch
              if (batch) {
                batch
                  .commit()
                  .then(function () {
                    unsubscribe();

                    callback({ success: true });
                  })
                  .catch((error) => {
                    console.warn(error);
                  });
                batch = null;
              }
            } else {
              callback({ success: true });
            }
          });  
}

export const cancelFriendRequest = (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  if (currentUserID == toUserID) {
    callback(null);
    return;
  }
  const query = friendshipsRef
    .where('user1', '==', currentUserID)
    .where('user2', '==', toUserID);

  const db = firebase.firestore();
  let batch = db.batch();
  const unsubscribe = query.onSnapshot((querySnapshot) => {
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        let ref = friendshipsRef.doc(doc.id);
        batch.delete(ref);
      });
      // Commit the batch
      if (batch) {
        batch
          .commit()
          .then(function () {
            unsubscribe();
            if (persistFriendshipsCounts) {
              updateFriendshipsCounts(currentUserID);
              updateFriendshipsCounts(toUserID);
            }

            if (enableFeedUpdates) {
              // currentUserID is not following toUserID anymore, so we remove feed posts and stories
              firebasePost.removeFeedForOldFriendship(currentUserID, toUserID);
              firebaseStory.removeStoriesForOldFriendship(
                currentUserID,
                toUserID,
              );
            }
            callback({ success: true });
          })
          .catch((error) => {
            console.warn(error);
          });
        batch = null;
      }
    } else {
      callback({ success: true });
    }
  });
};

export const unfriend = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  if (currentUserID == toUserID) {
    callback(null);
    return;
  }
  console.log("IDddd>>"+ toUserID)
  if (enableFeedUpdates) {
    // This is in fact an unfollow, for a mutual follow relationship
    cancelFriendRequest(
      currentUserID,
      toUserID,
      persistFriendshipsCounts,
      enableFeedUpdates,
      (response) => {
        let res = response;
        res['id'] = toUserID;
        callback(res);
      },
    );
  } else {
    cancelFriendRequest(
      currentUserID,
      toUserID,
      persistFriendshipsCounts,
      enableFeedUpdates,
      (_response) => {
        cancelFriendRequest(
          toUserID,
          currentUserID,
          persistFriendshipsCounts,
          enableFeedUpdates,
          (response1) => {
            //callback(response);

            cancelMainFeedsOnUnfriend(
              currentUserID,
              toUserID,
              (response2) => {
                cancelMainFeedsOnUnfriend(
                  toUserID,
                  currentUserID,
                  (response) => {
                    let res = response;
                    res['id'] = toUserID;
                    callback(res);
                  },
                );
              },
            );
          },
        );
      },
    );
  }
};

export const updateFeedsForNewFriends = (userID1, userID2) => {
  firebasePost.hydrateFeedForNewFriendship(userID1, userID2);
  firebaseStory.hydrateStoriesForNewFriendship(userID1, userID2);
  firebasePost.hydrateFeedForNewFriendship(userID2, userID1);
  firebaseStory.hydrateStoriesForNewFriendship(userID2, userID1);
};

const updateFriendshipsCounts = async (userID) => {
  // inbound
  const inbound = await friendshipsRef.where('user2', '==', userID).get();
  const inboundCount = inbound.docs ? inbound.docs.length : 0;
  firebaseUser.updateUserData(userID, { inboundFriendsCount: inboundCount });

  // outbound
  const outbound = await friendshipsRef.where('user1', '==', userID).get();
  const outboundCount = outbound.docs ? outbound.docs.length : 0;
  firebaseUser.updateUserData(userID, { outboundFriendsCount: outboundCount });
};
