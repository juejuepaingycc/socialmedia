import { IMLocalized } from '../../../localization/IMLocalization';
import { firebaseUser } from '../../../firebase';
import { firebaseFriendship } from '../../friendships';
import { firebase } from '../../../firebase/config';
import react from 'react';
import { notificationManager } from '../../../notifications';

export const postsRef = firebase.firestore().collection('SocialNetwork_Posts');
export const storiesRef = firebase.firestore().collection('socialnetwork_stories');
export const userRef = firebase.firestore().collection('users');
export const subscribeToMainFeedPosts = async (userID, callback) => {

  const feedPostsRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('main_feed')
    .orderBy('createdAt', 'desc')
    .limit(10)
  const snapshot = await feedPostsRef.get();
  const posts = [];
    snapshot.forEach(doc => {
      const post = doc.data();
          post.id = doc.id;
          posts.push(post);
    });
  return callback(posts);
};


export const deletePostReaction = async ( postID, authorID, userID, callback ) => {
  try {
    const ref = await postsRef
    .doc(postID);
    const postDoc = await ref.get();
    let reactions = postDoc.data().postReactions;
    reactions = reactions.filter((reaction) => reaction.userID != userID)
    await ref.update({ postReactions: reactions, postReactionsCount: reactions.length})
    setTimeout(() => {
      let result = {
        authorID,
        reactions,
        postReactionsCount: reactions.length,
        postID
     }
      callback(result)
    }, 200);
  } catch (error) {
    callback({})
  }
}

export const subscribePostReactions = async (postID, callback ) => {

  const ref = await postsRef
  .doc(postID);
  const postDoc = await ref.get();
  let reactions = postDoc.data().postReactions;
  console.log("RRRR>."+ JSON.stringify(reactions))
        const nestedPromise = async (reactions = []) => {
          return await Promise.all(
            reactions.map(async reaction => {
                const userDoc = await userRef.doc(reaction.userID).get();
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
          console.log("LatestReactions>>" + JSON.stringify(results))
          return callback(results);
        })


}

export const applyPostReaction = async (post, user, userID, reaction, increaseCount, callback) => {
  try {

    const ref = await postsRef
    .doc(post.id);
    const postDoc = await ref.get();
    console.log("Post>>"+ JSON.stringify(postDoc.data()))

    let newReaction = {
      userID,
      reaction
    }
    let reactions = await postDoc.data().postReactions;
    console.log("post reactions>>"+ JSON.stringify(reactions))
    if(increaseCount){
      console.log("Increase...")

      notificationManager.sendPushNotification(
        post.author,
        'Nine Chat',
        user.firstName + ' ' + IMLocalized('reacted to your post.'),
        'social_reaction',
        { outBound: user },
        post.id,
        0
      );

      if(reactions){
        if(reactions.length > 0)
          reactions.push(newReaction);
        else
          reactions = [newReaction];
      }
      else{
        reactions = [newReaction];
      }
      console.log("reactions>>"+ JSON.stringify(reactions))
      await ref.update({ postReactions: reactions, postReactionsCount: reactions.length })
      setTimeout(() => {
        let result = {
          authorID: post.authorID,
          reactions,
          postID: post.id,
          gaveReaction: reaction,
          postReactionsCount: reactions.length
        }
        console.log("Result>>"+ JSON.stringify(result));
        callback(result);
      }, 300)
    }
    else{
      console.log("No increase...");
      reactions = reactions.filter((reaction) => reaction.userID != userID)
      reactions.push(newReaction);
      await ref.update({ postReactions: reactions, postReactionsCount: reactions.length})
      setTimeout(() => {
        let result = {
          authorID: post.authorID,
          reactions,
          postID: post.id,
          gaveReaction: reaction,
          postReactionsCount: reactions.length
        }
        callback(result);
      }, 300)      
    }
  } catch (error) {
    callback(null)
  }
}

export const subscribeFirstPost = async (userID, callback) => {

  const feedPostsRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('main_feed')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          return callback(post);
        });
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return feedPostsRef;
};


export const subscribeToMoreMainFeedPosts = (userID, date) => {
  return new Promise((resolve) => {
    const feedPostsRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('main_feed')
    .orderBy('createdAt', 'desc')
    
    .startAfter(date)
    .limit(5)
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];

        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        setTimeout(() => {
          resolve(posts);
        }, 4000);
      },
      (error) => {
        resolve(null)
      },
    );
  });
}


export const subscribeToDiscoverFeedPosts = (callback) => {
  const feedPostsRef = postsRef
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return feedPostsRef;
};

export const subscribeToProfileFeedPosts = (userID, callback) => {
  const profilePostsRef = postsRef
    .where('authorID', '==', userID)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          posts.push(post);
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        alert(error);
        callback([]);
      },
    );
  return profilePostsRef;
};


export const testingPotss = (userID, callback) => {
  const profilePostsRef = postsRef
    .where('authorID', '==', userID)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          posts.push(doc.id)
        });
        return callback(posts);
      },
      (error) => {
        console.log(error);
        alert(error);
        callback([]);
      },
    );
  return profilePostsRef;
};

export const subscribeToSinglePost = (postID, callback) => {
  const singlePostRef = postsRef.where('id', '==', postID).onSnapshot(
    { includeMetadataChanges: true },
    (querySnapshot) => {
      if (querySnapshot.docs && querySnapshot.docs.length > 0) {
        let result = querySnapshot.docs[0].data();
        const ref = userRef
        .where('id', '==', querySnapshot.docs[0].data().authorID)
        .onSnapshot({ includeMetadataChanges: true }, (snapShot) => {
          const docs = snapShot.docs;
          if (docs.length > 0) {
            result['author'] = docs[0].data();
            callback(result);
          }
        });
      }
    },
    (error) => {
      console.log(error);
      callback(null);
    },
  );
  return singlePostRef;
};


export const getSinglePost = async (postID, callback) => {
  const postDoc = await postsRef.doc(postID).get();
  let post = postDoc.data();
      if (post) {
        const ref = userRef
          .where('id', '==', post.authorID)
          .onSnapshot({ includeMetadataChanges: true }, (snapShot) => {
            const docs = snapShot.docs;
            if (docs.length > 0) {
              post['author'] = docs[0].data();
              callback(post);
            }
        });
      }
      else{
        callback(null)
      }
};

export const hydrateFeedForNewFriendship = async (destUserID, sourceUserID) => {
  // we take all posts & stories from sourceUserID and populate the feed & stories of destUserID
  const mainFeedDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('main_feed');

  const unsubscribeToSourcePosts = postsRef
    .where('authorID', '==', sourceUserID)
    .onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          if (post.id) {
            mainFeedDestRef.doc(post.id).set(post);
          }
        });
        unsubscribeToSourcePosts();
      },
      (error) => {
        console.log(error);
      },
    );
};

export const removeFeedForOldFriendship = async (destUserID, oldFriendID) => {
  // We remove all posts authored by oldFriendID from destUserID's feed
  const mainFeedDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('main_feed');

  const unsubscribeToSourcePosts = postsRef
    .where('authorID', '==', oldFriendID)
    .onSnapshot(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          if (post.id) {
            mainFeedDestRef.doc(post.id).delete();
          }
        });
        unsubscribeToSourcePosts();
      },
      (error) => {
        console.log(error);
      },
    );
};

// const filterForReactions = (reactions, post) => {
//   reactions.forEach(reaction => {
//     if (reaction.postID === post.id && reaction.reaction === 'like') {
//       // post.iReact = true;
//       post.reactionType = reaction.reaction;
//     }
//     // else {
//     //   post.iLikePost = false;
//     // }
//   });
// };

const filterForReactions = (reactions, post) => {
  reactions.forEach((reaction) => {
    if (reaction.postID === post.id) {
      post.userReactions = reaction.reactions.sort((a, b) => {
        a = new Date(a.createdAt.seconds);
        b = new Date(b.createdAt.seconds);
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }
  });
};

export const getNewPosts = async (body) => {
  let {
    feedBatchLimit,
    lastVisibleFeed,
    acceptedFriends,
    morePostRef,
    appUser,
    allUsers,
    reactions,
  } = body;

  let postsSortRef;
  let userPosts = [];
  if (morePostRef) {
    postsSortRef = morePostRef;
  } else if (appUser) {
    postsSortRef = postsRef
      .where('authorID', '==', appUser.id)
      .orderBy('createdAt', 'desc')
      .limit(feedBatchLimit);
  } else {
    postsSortRef = postsRef.orderBy('createdAt', 'desc').limit(feedBatchLimit);
  }

  try {
    const documentSnapshots = await postsSortRef.get();

    if (documentSnapshots.docs.length > 0) {
      // Get the last visible post document
      lastVisibleFeed =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      let posts = documentSnapshots.docs.map((doc) => {
        return doc.data();
      });

      if (acceptedFriends) {
        posts = posts.filter((post) => {
          return acceptedFriends.find((friend) => {
            return (
              friend.id === post.authorID || friend.userID === post.authorID
            );
          });
        });

        posts = posts.map((post) => {
          const existingFriend = acceptedFriends.find((friend) => {
            return (
              friend.id === post.authorID || friend.userID === post.authorID
            );
          });

          if (reactions) {
            filterForReactions(reactions, post);
          }

          return {
            ...post,
            profilePictureURL: existingFriend.profilePictureURL,
            firstName: existingFriend.firstName || existingFriend.fullname,
            lastName: existingFriend.lastName || '',
          };
        });
      }

      if (allUsers) {
        posts = posts.map((post) => {
          const existingUser = allUsers.find((user) => {
            return user.id === post.authorID || user.userID === post.authorID;
          });

          if (reactions) {
            filterForReactions(reactions, post);
          }

          if (existingUser) {
            return {
              ...post,
              profilePictureURL: existingUser.profilePictureURL,
              firstName: existingUser.firstName || existingUser.fullname,
              lastName: existingUser.lastName || '',
            };
          }
          return {
            ...post,
          };
        });
      }

      if (appUser) {
        userPosts = posts.filter((post) => {
          return appUser.id === post.authorID;
        });

        userPosts = userPosts.map((post) => {
          if (reactions) {
            filterForReactions(reactions, post);
          }

          return {
            ...post,
            profilePictureURL: appUser.profilePictureURL,
            firstName: appUser.firstName || appUser.fullname,
            lastName: appUser.lastName || '',
          };
        });
      }

      // Construct a new query starting at this document,
      if (appUser) {
        postsSortRef = postsRef
          .where('authorID', '==', appUser.id)
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisibleFeed)
          .limit(feedBatchLimit);
      } else {
        postsSortRef = postsRef
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisibleFeed)
          .limit(feedBatchLimit);
      }

      return {
        success: true,
        posts,
        lastVisibleFeed,
        morePostRef: postsSortRef,
        userPosts,
      };
    } else {
      return { success: true, posts: [], lastVisibleFeed, noMorePosts: true };
    }
  } catch (error) {
    console.log('get post error', error);
    return {
      error: 'Oops! an occured while trying to get post. Please try again.',
      success: false,
    };
  }
};

export const subscribeNewPost = (users, callback) => {
  return postsRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      post.id = doc.id;
      users.forEach((user) => {
        if (user.id === post.authorID || user.userID === post.authorID) {
          post.profilePictureURL = user.profilePictureURL;
          post.firstName = user.firstName || user.fullname;
          post.lastName = user.lastName || '';
          post.reactionType = 'thumbsupUnfilled';
          const date = new Date();
          const seconds = date.getTime() / 1000;
          const createdAtDate = post.createdAt && post.createdAt.seconds;
          const differenceInMin = (seconds - createdAtDate) / 60;
          if (differenceInMin < 1 && post.createdAt) {
            posts.push(post);
          }
        }
      });
    });
    return callback(posts);
  });
};

export const editPost = async (post, callback) => {
  //console.log("editpost>>"+ JSON.stringify(post));
  try {
    await postsRef.doc(post.id).update({ ...post });
    callback(post);
  } catch (error) {
    console.log(error);
    callback(post);
  }
};

export const addPost = async (post, callback) => {
  post.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  //post.author = author;
  try {
    const ref = await postsRef.add(post);
    console.log("addPost id>>"+ ref.id);
    const finalPost = { ...post, id: ref.id };
    await postsRef.doc(ref.id).update(finalPost);
    callback(finalPost);
    // Update posts count
    // const postsForThisAuthor = await postsRef
    //   .where('authorID', '==', author.id)
    //   .get();
    // const postsCount = postsForThisAuthor.docs
    //   ? postsForThisAuthor.docs.length
    //   : 0;
    // await firebaseUser.updateUserData(author.id, { postsCount: postsCount });
    

  } catch (error) {
    console.log("addPost error>>" + JSON.stringify(error))
    callback({})
  }
};

export const updatePost = async (postId, post, followerIDs) => {
  try {
    await postsRef.doc(postId).update({ ...post });
    followerIDs.forEach((userID) => {
      const otherUserMainFeedRef = firebase
        .firestore()
        .collection('social_feeds')
        .doc(userID)
        .collection('main_feed');
      otherUserMainFeedRef.doc(postId).update({ ...post });
    });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};

export const getPost = async (postId) => {
  try {
    const post = await postsRef.doc(postId).get();
    return { data: { ...post.data(), id: post.id }, success: true };
  } catch (error) {
    console.log(error);
    return {
      error: 'Oops! an error occured. Please try again',
      success: false,
    };
  }
};

export const onUpdateReactionForFriends = async (reaction, item, userID, increaseCount, friends) => {
  //console.log("friends>>"+ JSON.stringify(friends))
  try {
     const db = firebase.firestore();
      let batch = db.batch();
      friends.forEach((friend) => {
        const mainFeedRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(friend.userID)
          .collection('main_feed')
          .doc(item.id)
          .collection('reactions')
          .doc()

        batch.set(
            mainFeedRef,
            { 
              reaction, 
              userID, 
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });  
      });
      await batch.commit().then(function () {
        console.log("success....");
      });

  //   if(increaseCount){
  //     let promises = [];
  //     let batch2 = db.batch();

  //     friends.forEach(async (friend) => {
  //       promises.push(
  //         new Promise(async (resolve, reject) => {
  //           const mainRef = firebase
  //           .firestore()
  //           .collection('social_feeds')
  //           .doc(friend.userID)
  //           .collection('main_feed')
  //           .doc(item.id);
      
  //           const postDoc = await mainRef.get();
  //           console.log("2222"+ JSON.stringify(postDoc.data()))
  //           if(postDoc.data().reactionsCount == null || postDoc.data().reactionsCount == undefined || postDoc.data().reactionsCount == 0){
  //             console.log("null")
  //             batch2.update(
  //               mainRef,
  //               { ...postDoc.data(), reactionsCount: 1 });
  //             resolve();
  //           }
  //           else{
  //             console.log("value..")
  //             batch2.update(
  //               mainRef,
  //               { ...postDoc.data(), reactionsCount: postDoc.data().reactionsCount + 1 });
  //               resolve();
  //             }
  //         })
  //         );
  //   });

  //     Promise.all(promises).then(async () => {
  //       await batch2.commit().then(function () {
  //         console.log("success 2....");
  //         return { success: true };
  //       });
  //     });    
  // }

  } catch (error) {
    console.log("errrrr>>"+ JSON.stringify(error))
    return { error, success: false };
  }
}

export const onReaction = async (reaction, item, userID, increaseCount) => {
  //console.log("friends>>"+ JSON.stringify(friends))
  try {
    const reactionRef = firebase
    .firestore()
    .collection('SocialNetwork_Posts')
    .doc(item.id)
    .collection('reactions');

    const ref = await reactionRef.add({
      reaction,
      userID,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await reactionRef
      .doc(ref.id)
      .update({ reactionID: ref.id });
     
    if(increaseCount){
      const postRef = firebase
      .firestore()
      .collection('SocialNetwork_Posts')
      .doc(item.id);

      const postDoc = await postRef.get();
      if(postDoc.data().reactionsCount == null || postDoc.data().reactionsCount == undefined || postDoc.data().reactionsCount == 0){
        await postRef.update({ ...postDoc.data(), reactionsCount: 1 })
      }
      else{
        await postRef.update({ ...postDoc.data(), reactionsCount: postDoc.data().reactionsCount + 1 })
      }
    }
    return { success: true, id: ref.id };
  } catch (error) {
    console.log("error>>"+ JSON.stringify(error))
    return { error, success: false };
  }
}

export const reportPost = async (userID, post) => {
  try {

    const reportRef = firebase
    .firestore()
    .collection('SocialNetwork_Posts')
    .doc(post.id)
    .collection('reports');

    const ref = await reportRef.add({
        userID,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

    await reportRef
        .doc(ref.id)
        .update({ reportID: ref.id });

    const postRef = firebase
        .firestore()
        .collection('SocialNetwork_Posts')
        .doc(post.id);
    
    const postDoc = await postRef.get();
    const count = postDoc.data().reportsCount;
    console.log("count>>"+ count)
      if(count == null || count == NaN || count == undefined || count == 0){
        await postRef.update({ reportsCount: 1 })
        return { success: true, id: ref.id };
      }
      {
        await postRef.update({ reportsCount: count + 1 })
        return { success: true, id: ref.id };
      }
  } catch (error) {
    return { error, success: false };
  }
};

export const deletePostFromUser = async (userID, post) => {
  try {
    
    const feedPostRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
    await feedPostRef.doc(post.id).delete();

    return {
      message: IMLocalized('Post was successfully reported'),
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: IMLocalized('Oops! an error occured. Please try again'),
      success: false,
    };
  }
};


export const deleteStory = async (src, followEnabled) => {
  try {

    // const storyRef = await storiesRef
    //   .where('storyMediaURL', '==', 'https://firebasestorage.googleapis.com/v0/b/ninechat-e0b12.appspot.com/o/8a98fe76-cfeb-4edc-91e2-83cd97b82167.jpg?alt=media&token=90f0b97f-942e-44c0-a127-f65acf2260cb')
    //   .get();



    await storiesRef
      .where('storyMediaURL', '==', src)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach( async (doc) => { 
          console.log("ref>>"+ doc.id);
          await storiesRef.doc(doc.id).delete();
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // return {
    //   message: IMLocalized('Post was successfully deleted.'),
    //   success: true,
    // };
  } catch (error) {
    console.log(error);
    return {
      error: IMLocalized('Oops! an error occured. Please try again'),
      success: false,
    };
  }
};

export const deletePost = async (post, callback) => {
  try {
    await postsRef.doc(post.id).delete();
    callback(post.id);
    // Update posts count
    // const postsForThisAuthor = await postsRef
    //   .where('authorID', '==', post.authorID)
    //   .get();
    // const postsCount = postsForThisAuthor.docs.length;
    // firebaseUser.updateUserData(post.authorID, { postsCount: postsCount });
  } catch (error) {
    console.log("deletePost error>>" + JSON.stringify(error));
    callback(post.id)
  }
};

export const olDeletePost = async (post, followEnabled) => {
  try {
    await postsRef.doc(post.id).delete();
    // Update posts count
    const postsForThisAuthor = await postsRef
      .where('authorID', '==', post.authorID)
      .get();
    const postsCount = postsForThisAuthor.docs.length;
    firebaseUser.updateUserData(post.authorID, { postsCount: postsCount });

    if (followEnabled) {
      removePostFromAllTimelines(post);
    } else {
      removePostFromAllFriendsTimelines(post);
    }
    return {
      message: IMLocalized('Post was successfully deleted.'),
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: IMLocalized('Oops! an error occured. Please try again'),
      success: false,
    };
  }
};

const removePostFromAllTimelines = async (post) => {
  // We fetch all users who follow the author of the post and update their timelines
  const unsubscribe = firebaseFriendship.subscribeToInboundFriendships(
    post.authorID,
    (inboundFriendships) => {
      const inboundUserIDs = inboundFriendships.map(
        (friendship) => friendship.user1,
      );
      const allUserIDsToBeUpdated = [post.authorID].concat(inboundUserIDs);

      const db = firebase.firestore();
      let batch = db.batch();
      allUserIDsToBeUpdated.forEach((userID) => {
        const feedPostsRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(post.id);
        batch.delete(feedPostsRef);
      });
      // Commit the batch
      batch.commit();
      unsubscribe();
    },
  );
};

const removePostFromAllFriendsTimelines = async (post) => {
  // We fetch all users who follow the author of the post and update their timelines
  const unsubscribeInbound = firebaseFriendship.subscribeToInboundFriendships(
    post.authorID,
    (inboundFriendships) => {
      const unsubscribeOutbound = firebaseFriendship.subscribeToInboundFriendships(
        post.authorID,
        (outboundFriendships) => {
          const inboundUserIDs = inboundFriendships.map(
            (friendship) => friendship.user1,
          );
          const outboundUserIDs = outboundFriendships.map(
            (friendship) => friendship.user2,
          );
          const allUserIDsToBeUpdated = [post.authorID].concat(
            inboundUserIDs.filter((id) => outboundUserIDs.includes(id)),
          );

          const db = firebase.firestore();
          let batch = db.batch();
          allUserIDsToBeUpdated.forEach((userID) => {
            const feedPostsRef = firebase
              .firestore()
              .collection('social_feeds')
              .doc(userID)
              .collection('main_feed')
              .doc(post.id);
            batch.delete(feedPostsRef);
          });
          // Commit the batch
          batch.commit();
          unsubscribeInbound();
          unsubscribeOutbound();
        },
      );
    },
  );
};
