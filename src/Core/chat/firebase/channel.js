import uuidv4 from 'uuidv4';
import { firebase } from '../../firebase/config';

const channelsRef = firebase.firestore().collection('channels');
const usersRef = firebase.firestore().collection('users');

const channelPaticipationRef = firebase
  .firestore()
  .collection('channel_participation');

const onCollectionUpdate = (querySnapshot, userId, callback) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    user.id = doc.id;
    if (user.id != userId) {
      data.push(user);
    }
  });
  return callback(data, channelsRef);
};

export const subscribeChannelParticipation = (userId, callback) => {
  return channelPaticipationRef
    .where('user', '==', userId)
    .onSnapshot((querySnapshot) =>
      onCollectionUpdate(querySnapshot, userId, callback),
    );
};

export const subscribeChannels = (callback) => {
  return channelsRef.onSnapshot((snapshot) =>
    callback(snapshot.docs.map((doc) => doc.data())),
  );
};

export const fetchChannelParticipantIDs = async (channel, callback) => {
  channelPaticipationRef
    .where('channel', '==', channel.id)
    .get()
    .then((snapshot) => {
      callback(snapshot.docs.map((doc) => doc.data().user));
    })
    .catch((error) => {
      console.log(error);
      callback([]);
    });
};

export const applyMessageReaction = async (channelID, messageID, reaction, userID, increaseCount) => {
  try {
    const reactionRef = channelsRef
    .doc(channelID)
    .collection('thread')
    .doc(messageID)
    .collection('reactions');

    if(increaseCount){
      const ref = await reactionRef.add({
        reaction,
        userID,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await reactionRef
        .doc(ref.id)
        .update({ reactionID: ref.id });
    }
    else{
      await reactionRef
      .where('userID', '==', userID)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc2) => { 
          reactionRef.doc(doc2.id).update({ reaction });  
          });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  } catch (error) {
    console.log("Err>>"+ JSON.stringify(error))
  }
}

export const subscribeThreadReactions = (channelID, threads, callback) => {
  const threadsRef = channelsRef
  .doc(channelID)
  .collection('thread');

  var promises = threads.map((thread) => {
    return new Promise((resolve, _reject) => {
      
      const reactionsRef = threadsRef
        .doc(thread.id)
        .collection('reactions')
        .onSnapshot( async (querySnapshot) => {
            const reactions = await onQueryThreadUpdate(querySnapshot);
            const promiseReaction = {
              ...thread,
              reactions
            };
            resolve(promiseReaction);
          })
    });
  });

  Promise.all(promises).then((_values) => {
    callback(_values)
  })
}


export const subscribeThreadReactionsDetail = async ( channelID, threadID, callback ) => {
  const reactionsRef = channelsRef
    .doc(channelID)
    .collection('thread')
    .doc(threadID)
    .collection('reactions')
    .onSnapshot(
      (querySnapshot) => {
        const reactions = onQueryThreadUpdate(querySnapshot);

        const nestedPromise = async (reactions = []) => {
          return await Promise.all(
            reactions.map(async reaction => {
                const userDoc = await usersRef.doc(reaction.userID).get();
                const promiseReaction = {
                  ...reaction,
                  userName: userDoc.data().firstName +
                  (userDoc.data().lastName ? ' ' + userDoc.data().lastName : ''),
                  profileURL: userDoc.data().profilePictureURL,
                };
                return promiseReaction;
            })
          )
        }
    
        nestedPromise(reactions).then(results => {
          //console.log("LatestReactions>>" + JSON.stringify(results))
          return callback(results);
        })
      },
      (error) => {
        console.log(error);
        return callback(error);
      },
    );
  return reactionsRef;
}

const onQueryThreadUpdate = (querySnapshot) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return data;
};

export const updateMessageReactionsCount = async (channelID, messageID, increaseCount) => {
  try {
    const messageRef = channelsRef
    .doc(channelID)
    .collection('thread')
    .doc(messageID)
    if(increaseCount){
      const messageDoc = await messageRef.get();
      if(messageDoc.data().reactionsCount == null || messageDoc.data().reactionsCount == undefined || messageDoc.data().reactionsCount == 0){
        await messageRef.update({ ...messageDoc.data(), reactionsCount: 1 })
      }
      else{
        await messageRef.update({ ...messageDoc.data(), reactionsCount: messageDoc.data().reactionsCount + 1 })
      }
    }
  } catch (error) {
    console.log("Err>>"+ JSON.stringify(error))
  }
}

export const updateEditedStatus = async (channelID, messageID, content) => {
  try {
    channelsRef
    .doc(channelID)
    .collection('thread')
    .doc(messageID)
    .update({ edited: true, content })
  } catch (error) {
    console.log("Err>>"+ JSON.stringify(error))
  }
}

export const insertSeenUsers = async (channelID, userID, enterChat) => {
  //if enterChat => If enter chat, insert current userID into seenUsers array
  //if not enterChat (sendMessage) => remove other userIDs and insert current UserID only into seenUsers array
  const doc = await channelsRef.doc(channelID).get();
  if(doc.data().seenUsers == null || doc.data().seenUsers == undefined || doc.data().seenUsers == ''){
      channelsRef
      .doc(channelID)
      .update({ seenUsers: [userID] });
  }
  else{
    if(enterChat && !doc.data().seenUsers.includes(userID)){
      channelsRef
      .doc(channelID)
      .update({ seenUsers: [...doc.data().seenUsers, userID] });
    }
    else if(!enterChat){
      channelsRef
      .doc(channelID)
      .update({ seenUsers: [userID] });
    }
  }

}
export const deleteConversationForSingleUser = async (channel, userId) => {

  const documentSnapshots = await channelsRef.doc(channel.id).collection('thread').get();

  const doc = await channelsRef.doc(channel.id).get();
  if(doc.data().deletedUsers == null || doc.data().deletedUsers == undefined || doc.data().deletedUsers == ''){
      channelsRef
      .doc(channel.id)
      .update({ deletedUsers: userId });
  }
  else{
      channelsRef
      .doc(channel.id)
      .update({ deletedUsers: doc.data().deletedUsers + userId });
  }

  documentSnapshots.docs.forEach((doc) => {
              if(doc.data().deletedUsers == null || doc.data().deletedUsers == undefined || doc.data().deletedUsers.length == 0){
                channelsRef
                .doc(channel.id)
                .collection('thread')
                .doc(doc.id)
                .update({ deletedUsers: [userId] });
              }
              else{
                channelsRef
                .doc(channel.id)
                .collection('thread')
                .doc(doc.id)
                .update({ deletedUsers: [ ...doc.data().deletedUsers, userId] });
              }
  });

  // await channelsRef
  //   .doc(channel.id)
  //   .collection('thread')
  //   .onSnapshot(
  //     (querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         if(doc.data().deletedUsers == null || doc.data().deletedUsers == undefined || doc.data().deletedUsers.length == 0){
  //           channelsRef
  //           .doc(channel.id)
  //           .collection('thread')
  //           .doc(doc.id)
  //           .update({ deletedUsers: [userId] });
  //         }
  //         else{
  //           channelsRef
  //           .doc(channel.id)
  //           .collection('thread')
  //           .doc(doc.id)
  //           .update({ deletedUsers: [ ...doc.data().deletedUsers, userId] });
  //         }
  //       });
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
}

export const subscribeThreadSnapshot = (channel, callback) => {
  return channelsRef
    .doc(channel.id)
    .collection('thread')
    .orderBy('created', 'desc')
    .onSnapshot(callback);
};

export const deleteMessage = (channel, messageId, callback) => {
  return channelsRef
  .doc(channel.id)
  .collection('thread')
  .doc(messageId)
  .delete();
}

export const deleteMessageForSingleUser = async (channel, messageId, userId) => {
    const doc = await channelsRef
    .doc(channel.id)
    .collection('thread')
    .doc(messageId)
    .get();
    if(doc.data().deletedUsers == null || doc.data().deletedUsers == undefined || doc.data().deletedUsers.length == 0){
      return await channelsRef
      .doc(channel.id)
      .collection('thread')
      .doc(messageId)
      .update({ deletedUsers: [userId] });
    }
    else{
      return await channelsRef
      .doc(channel.id)
      .collection('thread')
      .doc(messageId)
      .update({ deletedUsers: [ ...doc.data().deletedUsers, userId] });
    }
}

export const sendMessage = (
  sender,
  channel,
  message,
  downloadURL,
  inReplyToItem,
  duration,
  shareStatus,
  shareName,
  sharePostInfo
) => {
  return new Promise((resolve) => {
    const { userID, profilePictureURL } = sender;
    const timestamp = currentTimestamp();
    const data = {
      content: message,
      created: timestamp,
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName: sender.firstName || sender.fullname,
      senderID: userID,
      senderLastName: '',
      senderProfilePictureURL: profilePictureURL,
      url: downloadURL,
      inReplyToItem: inReplyToItem,
      duration,
      shareStatus,
      shareName,
      sharePostInfo
    };
    const channelID = channel.id;
    channelsRef.doc(channel.id).update({ deletedUsers: '' });

    let latest;
    if(message && message.length){
      latest = message;
    }
    else{
      latest = downloadURL;
    }

    channelsRef
      .doc(channelID)
      .collection('thread')
      .add({ ...data })
      .then(() => {
        channelsRef
          .doc(channelID)
          .update({
            lastMessage: latest,
            lastMessageDate: timestamp,
          })
          .then((response) => {
            resolve({ success: true });
          })
          .catch((error) => {
            resolve({ success: false, error: error });
          });
      })
      .catch((error) => {
        resolve({ success: false, error: error });
      });
  });
};

export const createChannel = (creator, otherParticipants, name, groupStatus) => {
  //console.log("Other p>>"+ JSON.stringify(otherParticipants));
  return new Promise((resolve) => {
    var channelID = uuidv4();
    const id1 = creator.id || creator.userID;
    if (otherParticipants.length == 1) {
      const id2 = otherParticipants[0].id || otherParticipants[0].userID;
      if (id1 == id2) {
        // We should never create a self chat
        resolve({ success: false });
        return;
      }
      channelID = id1 < id2 ? id1 + id2 : id2 + id1;
    }
    const channelData = {
      creator_id: id1,
      creatorID: id1,
      group: true,
      id: channelID,
      channelID,
      name: name || '',
      lastMessageDate: currentTimestamp(),
      group: groupStatus
    };
    console.log("New channelID.." + channelID)
    channelsRef
      .doc(channelID)
      .set({
        ...channelData,
      })
      .then((channelRef) => {
        persistChannelParticipations(
          [...otherParticipants, creator],
          channelID,
        ).then((response) => {
          resolve({ success: response.success, channel: channelData });
        });
      })
      .catch(() => {
        resolve({ success: false });
      });
  });
};

export const persistChannelParticipations = (users, channelID) => {
  return new Promise((resolve) => {
    const db = firebase.firestore();
    let batch = db.batch();
    users.forEach((user) => {
      let ref = channelPaticipationRef.doc();
      batch.set(ref, {
        channel: channelID,
        user: user.id,
      });
    });
    // Commit the batch
    batch.commit().then(function () {
      resolve({ success: true });
    });
  });
};

export const addMember = (channelId, members, callback) => {
  persistChannelParticipations(
    members,
    channelId,
  ).then((response) => {
    callback({ success: true });
  })   
  .catch((error) => {
    console.log(error);
    callback({ success: false, error: 'An error occured, please try gain.' });
  });
};

export const onDeleteGroup = async (channelId, callback) => {
  try {
    await channelsRef.doc(channelId).delete();
    callback({ success: true });
  } catch (error) {
    console.log("DeleteGroup error>>" + JSON.stringify(error));
    callback({ success: false, error: 'An error occured, please try gain.' });
  }
};

export const onLeaveGroup = (channelId, userId, callback) => {
  channelPaticipationRef
    .where('channel', '==', channelId)
    .where('user', '==', userId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
        callback({ success: true });
      });
    })
    .catch((error) => {
      console.log(error);
      callback({ success: false, error: 'An error occured, please try gain.' });
    });
};

export const onRenameGroup = (text, channel, callback) => {
  channelsRef
    .doc(channel.id)
    .set(channel)
    .then(() => {
      const newChannel = channel;
      newChannel.name = text;
      callback({ success: true, newChannel });
    })
    .catch((error) => {
      console.log(error);
      callback({ success: false, error: 'An error occured, please try gain.' });
    });
};

export const currentTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

export const subscribeToSingleChannel = (channelId, callback) => {
  const singleChannelRef = channelsRef.where('channelID', '==', channelId).onSnapshot(
    (querySnapshot) => {
      if (querySnapshot.docs && querySnapshot.docs.length > 0) {
        callback(querySnapshot.docs[0].data());
      }
    },
    (error) => {
      console.log(error);
      callback(null);
    },
  );
  return singleChannelRef;
};