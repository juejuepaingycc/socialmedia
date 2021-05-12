export { groupBy } from '../../../helpers/collections';
import { firebaseFriendship } from '../../friendships/';
import { friends } from '../../friendships/redux';
import FriendshipManager from '../../friendships/firebase/friendshipManager';
import { notificationManager } from '../../../notifications';
import { IMLocalized } from '../../../localization/IMLocalization';
import { firebase } from '../../../firebase/config';

export const commentsRef = firebase
  .firestore()
  .collection('socialnetwork_comments');

export const reactionsRef = firebase
  .firestore()
  .collection('socialnetwork_reactions');

export const postsRef = firebase.firestore().collection('SocialNetwork_Posts');

const usersRef = firebase.firestore().collection('users');

export const subscribeToUserReactions = (userID, callback) => {
  const reactionsRef = firebase
    .firestore()
    .collection('socialnetwork_reactions')
    .where('reactionAuthorID', '==', userID)
    .onSnapshot(
      (querySnapshot) => {
        const reactions = [];
        querySnapshot.forEach((doc) => {
          const reaction = doc.data();
          reactions.push(reaction);
        });
        return callback(reactions);
      },
      (error) => {
        console.log(error);
        callback([]);
      },
    );
  return reactionsRef;
};

const onQueryReplyUpdate = (querySnapshot) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return data;
};

const onQueryCollectionUpdate = (querySnapshot, postId) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    if (postId === temp.postID) {
      data.push(temp);
    }
  });
  return data;
};

const onCollectionUpdate = (querySnapshot, postId) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return data;
};

const getReplies = async (commentID) => {
  console.log("CommentID>>"+ commentID);

  // const nestedPromise = async (replies = []) => {
  //   return await Promise.all(
  //     replies.map(async reply => {
        
  //         console.log("Reply>>"+ JSON.stringify(reply))
  //         const userDoc = await usersRef.doc(reply.authorID).get();
  //         const promiseReply = {
  //           ...reply,
  //           firstName: userDoc.data().firstName +
  //           (userDoc.data().lastName ? ' ' + userDoc.data().lastName : ''),
  //           profilePictureURL: userDoc.data().profilePictureURL,
  //         };
  //         return promiseReply;
  //     })
  //   )
  // }

  // const replyRef = firebase
  // .firestore()
  // .collection('socialnetwork_comments')
  // .doc(commentID)
  // .collection('comment_replies');

  //  await replyRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
  //   let replies = onQueryReplyUpdate(querySnapshot);
  //   //console.log("Replies>>"+ JSON.stringify(replies))
  //   replies = replies.filter((reply) => reply.authorID);

  //   nestedPromise(replies).then(results => {
  //     console.log("LatestReplies>>" + JSON.stringify(results))
  //     return results;
  //   })
  // })

  const replyRef = firebase
  .firestore()
  .collection('socialnetwork_comments')
  .doc(commentID)
  .collection('comment_replies');
  replyRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
    let replies = onQueryReplyUpdate(querySnapshot);
    //console.log("Replies>>"+ JSON.stringify(replies))
    replies = replies.filter((reply) => reply.authorID);

    const nestedPromise = async (replies = []) => {
      return await Promise.all(
        replies.map(async reply => {
          
           // console.log("Reply>>"+ JSON.stringify(reply))
            const userDoc = await usersRef.doc(reply.authorID).get();
            const promiseReply = {
              ...reply,
              firstName: userDoc.data().firstName +
              (userDoc.data().lastName ? ' ' + userDoc.data().lastName : ''),
              profilePictureURL: userDoc.data().profilePictureURL,
            };
            return promiseReply;
        })
      )
    }

    nestedPromise(replies).then(results => {
     // console.log("LatestReplies>>" + JSON.stringify(results))
      return results;
    })

})

}

export const subscribeCommentReplies = (commentID, callback) => {

    const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies');

  return replyRef.orderBy('createdAt', 'asc').onSnapshot((querySnapshot) => {
    let replies = onQueryReplyUpdate(querySnapshot);
    replies = replies.filter((reply) => reply.authorID);
  
    const nestedPromise = async (replies = []) => {
      return await Promise.all(
        replies.map(async reply => {
          
          const userDoc = await usersRef.doc(reply.authorID).get();

          let reactionsArr = [];
          await replyRef.doc(reply.replyID).collection('reactions').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              reactionsArr.push(doc.data());
            });
          })
  
         const promiseReply = {
          ...reply,
          firstName: userDoc.data().firstName +
          (userDoc.data().lastName ? ' ' + userDoc.data().lastName : ''),
          profilePictureURL: userDoc.data().profilePictureURL,
          reactions: reactionsArr
        };
        return promiseReply;
        })
      )
    }

    nestedPromise(replies).then(results => {
      return callback(results)
    })

  });
};

export const subscribeSubReplies = (commentID, replyID, callback) => {
  console.log("IDS>>" + commentID + ' ' + replyID)
  const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies');

  return replyRef.orderBy('createdAt', 'asc').onSnapshot((querySnapshot) => {
    let replies = onQueryReplyUpdate(querySnapshot);
    replies = replies.filter((reply) => reply.authorID);
  
    const nestedPromise = async (replies = []) => {
      return await Promise.all(
        replies.map(async reply => {
          
          const userDoc = await usersRef.doc(reply.authorID).get();

          let reactionsArr = [];
          await replyRef.doc(reply.subReplyID).collection('reactions').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              reactionsArr.push(doc.data());
            });
          })
  
         const promiseReply = {
          ...reply,
          firstName: userDoc.data().firstName +
          (userDoc.data().lastName ? ' ' + userDoc.data().lastName : ''),
          profilePictureURL: userDoc.data().profilePictureURL,
          reactions: reactionsArr
        };
        return promiseReply;
        })
      )
    }

    nestedPromise(replies).then(results => {
      console.log("LatestReplies>>"+ JSON.stringify(results))
      return callback(results)
    })

  });
};

export const subscribeComments = (postId, callback) => {
  console.log("postID>>"+ postId)
  return commentsRef.orderBy('createdAt', 'asc').onSnapshot((querySnapshot) => {
    let comments = onQueryCollectionUpdate(querySnapshot, postId);
    comments = comments.filter((comment) => comment.authorID);

    const nestedPromise = async (comments = []) => {
      return await Promise.all(
        comments.map(async comment => {
          
        const userDoc = await usersRef.doc(comment.authorID).get();
        //const replyDoc = await commentsRef.doc(comment.commentID).collection('comment_replies').get();
        
        let reactionsArr = [];
        await commentsRef.doc(comment.commentID).collection('reactions').get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            reactionsArr.push(doc.data());
          });
        })
     
       // console.log('reactionsArr>>' + JSON.stringify(reactionsArr));
        //return reactionsDoc.docs.map(doc => doc.data());

         const promiseComment = {
          ...comment,
          firstName: userDoc.data().firstName +
          (userDoc.data().lastName ? ' ' + userDoc.data().lastName : ''),
          profilePictureURL: userDoc.data().profilePictureURL,
          reactions: reactionsArr
         // repliesCount: replyDoc.size
        };
        return promiseComment;
        })
      )
    }

    nestedPromise(comments).then(results => {
      return callback(results)
    })

  });
};

export const subscribeReactions = (callback, postId) => {
  return reactionsRef.onSnapshot((querySnapshot) => {
    let reactions = [];
    if (postId) {
      reactions = onQueryCollectionUpdate(querySnapshot, postId);
    } else {
      reactions = onCollectionUpdate(querySnapshot);
    }

    const groupedByReaction = groupBy('reaction');
    const groupedReactions = groupedByReaction(reactions);
    const formattedReactions = [];

    for (var key of Object.keys(groupedReactions)) {
      const rawReaction = groupedReactions[key];
      const formattedReaction = {
        type: rawReaction[0].reaction,
        count: rawReaction.length,
        reactionAuthorID: rawReaction[0].reactionAuthorID,
        postID: rawReaction[0].postID,
      };
      formattedReactions.push(formattedReaction);
    }

    return callback(formattedReactions);
  });
};

export const subscribeSubReplyReactions = async ( commentID, replyID, subReplyID, callback ) => {
  const reactionsRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies')
    .doc(subReplyID)
    .collection('reactions')
    .onSnapshot(
      (querySnapshot) => {
        const reactions = onCollectionUpdate(querySnapshot);
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

export const subscribeReplyReactions = async ( commentID, replyID, callback ) => {
  const reactionsRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('reactions')
    .onSnapshot(
      (querySnapshot) => {
        const reactions = onCollectionUpdate(querySnapshot);
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

export const getUserReactions = (userId, callback) => {
  return reactionsRef
    .where('reactionAuthorID', '==', userId)
    .onSnapshot((querySnapshot) => {
      const date = new Date();
      const seconds = date.getTime() / 1000;

      const reactions = querySnapshot.docs.map((doc) => {
        const temp = doc.data();
        temp.id = doc.id;
        return temp;
      });

      const groupedByPostId = groupBy('postID');
      const groupedReactionsByPostId = groupedByPostId(reactions);
      const formattedReactions = [];

      for (var key of Object.keys(groupedReactionsByPostId)) {
        const rawReaction = groupedReactionsByPostId[key];
        const formattedReaction = {
          reactionAuthorID: rawReaction[0].reactionAuthorID,
          postID: rawReaction[0].postID,
          reactions: rawReaction.map((item) => {
            return {
              type: item.reaction,
              reactionAuthorID: item.reactionAuthorID,
              postID: item.postID,
              createdAt: item.createdAt || { seconds },
              id: item.id,
            };
          }),
        };
        formattedReactions.push(formattedReaction);
      }

      callback({ reactions: formattedReactions, fetchCompleted: true });
    });
};

export const subscribeCommentReactions = async ( commentID, callback ) => {
  const reactionsRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('reactions')
    .onSnapshot(
      (querySnapshot) => {
        const reactions = onCollectionUpdate(querySnapshot);
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

export const deleteCommentReplyReaction = async ( commentID, replyID, userID ) => {
  const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('reactions');

  const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID);

    const replyDoc = await replyRef.get();
    await replyRef.update({ ...replyDoc.data(), reactionsCount: replyDoc.data().reactionsCount - 1 })

    await reactionRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().userID == userID){
          doc.ref.delete();
          return true;
        }
      });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}

export const decreaseSubReplyReactionCount = async ( commentID, replyID, subReplyID ) => {
  const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies')
    .doc(subReplyID);

  const replyDoc = await replyRef.get();
  await replyRef.update({ ...replyDoc.data(), reactionsCount: replyDoc.data().reactionsCount - 1 })
  return true;
}

export const decreaseReplyReactionCount = async ( commentID, replyID ) => {
  const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID);

  const replyDoc = await replyRef.get();
  await replyRef.update({ ...replyDoc.data(), reactionsCount: replyDoc.data().reactionsCount - 1 })
  return true;
}

export const deleteSubReplyReaction = async ( commentID, replyID, subReplyID, userID ) => {
  const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies')
    .doc(subReplyID)
    .collection('reactions')

  await reactionRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().userID == userID){
          console.log("deleteSubReplyReaction>>"+ JSON.stringify(doc.data()))
          doc.ref.delete();
          return true;
        }
      });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

}

export const deleteReplyReaction = async ( commentID, replyID, userID ) => {
  const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('reactions')

  await reactionRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().userID == userID){
          console.log("deleteReplyReaction>>"+ JSON.stringify(doc.data()))
          doc.ref.delete();
          return true;
        }
      });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

}

export const deleteCommentReaction = async ( commentID, userID ) => {
  const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('reactions');

  const cmtRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID);

    const cmtDoc = await cmtRef.get();
    await cmtRef.update({ ...cmtDoc.data(), reactionsCount: cmtDoc.data().reactionsCount - 1 })

  await reactionRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().userID == userID){
          doc.ref.delete();
          return true;
        }
      });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });

}

export const applySubReplyReaction = async (commentID, replyID, subReplyID, userID, reaction, increaseCount) => {
  try {
    const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies')
    .doc(subReplyID)
    .collection('reactions');

    const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies')
    .doc(subReplyID);

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
        querySnapshot.forEach( async (document) => { 
          const ref = reactionRef.doc(document.id);
          await ref.update({ ...document.data(), reaction })
      })
      .catch((error) => {
        console.log(error);
      });
    })
  }
  
    if(increaseCount){
      const replyDoc = await replyRef.get();
      if(replyDoc.data().reactionsCount == null || replyDoc.data().reactionsCount == undefined || replyDoc.data().reactionsCount == 0){
        await replyRef.update({ ...replyDoc.data(), reactionsCount: 1 })
      }
      else{
        await replyRef.update({ ...replyDoc.data(), reactionsCount: replyDoc.data().reactionsCount + 1 })
      }
    }
    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
}

export const applyCommentReplyReaction = async (commentID, replyID, userID, reaction, increaseCount) => {
  try {
    const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('reactions');

    const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID);

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
        querySnapshot.forEach( async (document) => { 
          const ref = reactionRef.doc(document.id);
          await ref.update({ ...document.data(), reaction })
      })
      .catch((error) => {
        console.log(error);
      });
    })
  }
  
    if(increaseCount){
      const replyDoc = await replyRef.get();
      if(replyDoc.data().reactionsCount == null || replyDoc.data().reactionsCount == undefined || replyDoc.data().reactionsCount == 0){
        await replyRef.update({ ...replyDoc.data(), reactionsCount: 1 })
      }
      else{
        await replyRef.update({ ...replyDoc.data(), reactionsCount: replyDoc.data().reactionsCount + 1 })
      }
    }
    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
}

export const applyCommentReaction = async (commentID, userID, reaction, increaseCount) => {
  try {

    const reactionRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('reactions');

    const cmtRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID);

    if(increaseCount){ //add new reaction to reactions collection
      const ref = await reactionRef.add({
        reaction,
        userID,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await reactionRef
        .doc(ref.id)
        .update({ reactionID: ref.id });
    }
    else{ //update reaction in reactions collection
      await reactionRef
      .where('userID', '==', userID)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach( async (document) => { 
          const ref = reactionRef.doc(document.id);
          await ref.update({ ...document.data(), reaction })
          });
      })
      .catch((error) => {
        console.log(error);
      });
    }

     
    if(increaseCount){
      const cmtDoc = await cmtRef.get();
      if(cmtDoc.data().reactionsCount == null || cmtDoc.data().reactionsCount == undefined || cmtDoc.data().reactionsCount == 0){
        await cmtRef.update({ ...cmtDoc.data(), reactionsCount: 1 })
      }
      else{
        await cmtRef.update({ ...cmtDoc.data(), reactionsCount: cmtDoc.data().reactionsCount + 1 })
      }
    }
    

    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
}

export const addSubReply = async (
  reply,
  commentAuthor,
  post,
  commentID,
  replyID
) => {
  try {

    const subReplyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies');

    const ref = await subReplyRef.add({
      ...reply,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await subReplyRef
      .doc(ref.id)
      .update({ ...reply, subReplyID: ref.id, id: ref.id });

      const cmtRef = firebase
      .firestore()
      .collection('socialnetwork_comments')
      .doc(commentID);

      const replyRef = firebase
      .firestore()
      .collection('socialnetwork_comments')
      .doc(commentID)
      .collection('comment_replies')
      .doc(replyID)

      const cmtDoc = await cmtRef.get();
      if(cmtDoc.data().replyCount == null || cmtDoc.data().replyCount == undefined || cmtDoc.data().replyCount == 0){
        await cmtRef.update({ ...cmtDoc.data(), replyCount: 1 })
      }
      else{
        await cmtRef.update({ ...cmtDoc.data(), replyCount: cmtDoc.data().replyCount + 1 })
      }

      const replyDoc = await replyRef.get();
      if(replyDoc.data().replyCount == null || replyDoc.data().replyCount == undefined || replyDoc.data().replyCount == 0){
        await replyRef.update({ ...replyDoc.data(), replyCount: 1 })
      }
      else{
        await replyRef.update({ ...replyDoc.data(), replyCount: replyDoc.data().replyCount + 1 })
      }

    // Send push notification to author
    notificationManager.sendPushNotification(
      post.author,
      'Nine Chat',
      commentAuthor.firstName + ' ' + IMLocalized('replied on your post.'),
      'social_comment',
      { outBound: commentAuthor },
      post.id,
      0
    );

    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const addReply = async (
  reply,
  commentAuthor,
  post,
  commentID
) => {
  try {

    const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies');

    const ref = await replyRef.add({
      ...reply,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await replyRef
      .doc(ref.id)
      .update({ ...reply, replyID: ref.id, id: ref.id });

      const cmtRef = firebase
      .firestore()
      .collection('socialnetwork_comments')
      .doc(commentID);

    const cmtDoc = await cmtRef.get();
    console.log("cmtDoc>>" + JSON.stringify(cmtDoc.data()));
    if(cmtDoc.data().replyCount == null || cmtDoc.data().replyCount == undefined || cmtDoc.data().replyCount == 0){
      await cmtRef.update({ ...cmtDoc.data(), replyCount: 1 })
    }
    else{
      await cmtRef.update({ ...cmtDoc.data(), replyCount: cmtDoc.data().replyCount + 1 })
    }
    

    // Send push notification to author
    notificationManager.sendPushNotification(
      post.author,
      'Nine Chat',
      commentAuthor.firstName + ' ' + IMLocalized('replied on your post.'),
      'social_comment',
      { outBound: commentAuthor },
      post.id,
      0
    );

    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const addComment = async (
  comment,
  commentAuthor,
  post,
  followEnabled,
) => {
  try {
    const ref = await commentsRef.add({
      ...comment,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await commentsRef
      .doc(ref.id)
      .update({ ...comment, commentID: ref.id, id: ref.id });

    // Send push notification to author
    notificationManager.sendPushNotification(
      post.author,
      'Nine Chat',
      commentAuthor.firstName + ' ' + IMLocalized('commented on your post.'),
      'social_comment',
      { outBound: commentAuthor },
      post.id,
      0
    );

    const allCommentsForThisPost = await commentsRef
    .where('postID', '==', comment.postID)
    .get();
    const commentCount = allCommentsForThisPost.docs.length;
    postsRef.doc(comment.postID).update({ commentCount: commentCount });

    // if (followEnabled) {
    //   updateCommentCountOnAllTimelines(comment);
    // } else {
    //   updateCommentCountOnAllFriendsTimelines(comment);
    // }
    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const handleReaction = async (
  reaction,
  user,
  post,
  followEnabled,
  users = [],
) => {
  try {
    const postId = post.id;
    const documentSnapshots = await reactionsRef
      .where('reactionAuthorID', '==', user.id)
      .where('postID', '==', postId)
      .get();

    if (documentSnapshots.docs.length > 0) {
      if (followEnabled || reaction == null) {
        // this is simply an unlike
        documentSnapshots.docs.forEach(async (docRef) => {
          await reactionsRef.doc(docRef.id).delete();
        });
      } else {
        // this is modifying a previous reaction into a different reaction, facebook style (e.g. angry into love)
        documentSnapshots.docs.forEach(async (docRef) => {
          await reactionsRef.doc(docRef.id).update({ reaction });
        });
      }
    } else {
      const newReaction = {
        postID: postId,
        reaction,
        reactionAuthorID: user.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await reactionsRef.add(newReaction);

      // Send push notification to author
      const message = followEnabled
        ? user.firstName + ' ' + IMLocalized('liked your post.')
        : user.firstName + ' ' + IMLocalized('reacted to your post.');

      console.log("Send Push>>"+ JSON.stringify(post.author))

      notificationManager.sendPushNotification(
        post.author,
        'Nine Chat',
        message,
        'social_reaction',
        { outBound: user, reaction },
        postId,
        0
      );
    }
  } catch (error) {
    console.log("Handle Reaction>>" + JSON.stringify(error));
  }
};

export const decreaseSubReplyCount = async (commentID, replyID) => {
  const cmtRef = firebase
  .firestore()
  .collection('socialnetwork_comments')
  .doc(commentID);
  const cmtDoc = await cmtRef.get();
  await cmtRef.update({ ...cmtDoc.data(), replyCount: cmtDoc.data().replyCount - 1 })

  const replyRef = firebase
  .firestore()
  .collection('socialnetwork_comments')
  .doc(commentID)
  .collection('comment_replies')
  .doc(replyID)
  const replyDoc = await replyRef.get();
  await replyRef.update({ ...replyDoc.data(), replyCount: replyDoc.data().replyCount - 1 })

  return true;
};

export const decreaseCommentReplyCount = async (commentID) => {
  const cmtRef = firebase
  .firestore()
  .collection('socialnetwork_comments')
  .doc(commentID);
  const cmtDoc = await cmtRef.get();
  await cmtRef.update({ ...cmtDoc.data(), replyCount: cmtDoc.data().replyCount - 1 })
  return true;
};

export const deleteSubReply = async (commentID, replyID, subReplyID) => {
  try {
    const replyRef = firebase
    .firestore()
    .collection('socialnetwork_comments')
    .doc(commentID)
    .collection('comment_replies')
    .doc(replyID)
    .collection('sub_replies');
    await replyRef.doc(subReplyID).delete();
    return true;
  } catch (error) {
    console.log("deleteSubReply error>>" + JSON.stringify(error));
    return false;
  }
};

export const deleteCommentReply = async (commentID, replyID) => {

  const replyRef = firebase
  .firestore()
  .collection('socialnetwork_comments')
  .doc(commentID)
  .collection('comment_replies');

  await replyRef
    .where('replyID', '==', replyID)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
        return true;
      });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const editComment = async (comment, commentText) => {
  try{
    await commentsRef.doc(comment.commentID).update({ commentText, edited: true });
    return true;
  } catch (error) {
    console.log("Edit err>>"+ JSON.stringify(error));
    return false;
  }
};

export const editReply = async (comment, reply, replyText) => {
  try{
    await commentsRef.doc(comment.commentID).collection('comment_replies').doc(reply.replyID).update({ replyText, edited: true });
    return true;
  } catch (error) {
    console.log("Edit err>>"+ JSON.stringify(error));
    return false;
  }
};

export const editSubReply = async (comment, reply, subreply, subReplyText) => {
  try{
    await commentsRef.doc(comment.commentID).collection('comment_replies').doc(reply.replyID)
    .collection('sub_replies').doc(subreply.subReplyID)
    .update({ subReplyText, edited: true });
    return true;
  } catch (error) {
    console.log("Edit err>>"+ JSON.stringify(error));
    return false;
  }
};

export const deleteComment = async (comment) => {
  try{
    await commentsRef.doc(comment.commentID).delete();
    const allCommentsForThisPost = await commentsRef
    .where('postID', '==', comment.postID)
    .get();
    const commentCount = allCommentsForThisPost.docs.length;
    postsRef.doc(comment.postID).update({ commentCount: commentCount });
    return { success: true, id: ref.id };
  } catch (error) {
    return { error, success: false };
  }
};

export const deleteReaction = async (userId, postId) => {
  await reactionsRef
    .where('reactionAuthorID', '==', userId)
    .where('postID', '==', postId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateReactionsCountForFollowers = async (post) => {
  // After we added the reaction to the reactions table (the main source of truth for reactions), update the counts in the timeline of all people seeing this post
  // We compute the canonical reactions count
  const allReactions = await reactionsRef.where('postID', '==', post.id).get();
  const allReactionsCount = allReactions.docs.length;

  // We update the canonical entry
  postsRef.doc(post.id).update({ reactionsCount: allReactionsCount });

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
        batch.set(
          feedPostsRef,
          {
            reactionsCount: allReactionsCount,
          },
          {
            merge: true,
          },
        );
      });
      // Commit the batch
      batch.commit();
      unsubscribe();
    },
  );
};

const updateReactionsCountForFriends = async (post, users) => {
  // After we added the reaction to the reactions table (the main source of truth for reactions), update the counts in the timeline of all people seeing this post
  // We compute the canonical reactions count
  const allReactions = await reactionsRef.where('postID', '==', post.id).get();
  const allReactionsCount = allReactions.docs.length;

  // We update the canonical entry
  postsRef.doc(post.id).update({ reactionsCount: allReactionsCount });

  // We get all friends of the author and update their timelines
  const manager = new FriendshipManager(
    users,
    false,
    (friendships, inbound, outbound) => {
      const friendsUserIDs = friendships.map(
        (friendship) => friendship.user.id,
      );
      const allUserIDsToBeUpdated = [post.authorID].concat(friendsUserIDs);
      const db = firebase.firestore();
      let batch = db.batch();
      allUserIDsToBeUpdated.forEach((userID) => {
        const feedPostsRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(post.id);
            batch.set(
              feedPostsRef,
              {
                reactionsCount: allReactionsCount,
              },
              {
                merge: true,
              },
            );
          });
      // Commit the batch
      batch.commit();
      manager.unsubscribe();
    },
  );
  manager.fetchFriendships(post.authorID);
};

const updateCommentCountOnAllTimelines = async (comment) => {
  // Fetch the current comment count
  const allCommentsForThisPost = await commentsRef
    .where('postID', '==', comment.postID)
    .get();
  const commentCount = allCommentsForThisPost.docs.length;
  postsRef.doc(comment.postID).update({ commentCount: commentCount });

  // We fetch all users who follow the author of the post and update their timelines
  const unsubscribe = firebaseFriendship.subscribeToInboundFriendships(
    comment.authorID,
    (inboundFriendships) => {
      const inboundUserIDs = inboundFriendships.map(
        (friendship) => friendship.user1,
      );
      const allUserIDsToBeUpdated = [comment.authorID].concat(inboundUserIDs);

      const db = firebase.firestore();
      const batch = db.batch();
      allUserIDsToBeUpdated.forEach((userID) => {
        const otherUserMainFeedRef = firebase
          .firestore()
          .collection('social_feeds')
          .doc(userID)
          .collection('main_feed')
          .doc(comment.postID);
        batch.set(
          otherUserMainFeedRef,
          {
            commentCount: commentCount,
          },
          {
            merge: true,
          },
        );
      });
      batch.commit();
      unsubscribe();
    },
  );
};

const updateCommentCountOnAllFriendsTimelines = async (comment) => {
  // Fetch the current comment count
  const allCommentsForThisPost = await commentsRef
    .where('postID', '==', comment.postID)
    .get();
  const commentCount = allCommentsForThisPost.docs.length;

  // Update canonical posts table
  postsRef.doc(comment.postID).update({ commentCount: commentCount });

  // We fetch all friends of the author of the post and update their timelines
  const unsubscribeInbound = firebaseFriendship.subscribeToInboundFriendships(
    comment.authorID,
    (inboundFriendships) => {
      const unsubscribeOutbound = firebaseFriendship.subscribeToOutboundFriendships(
        comment.authorID,
        (outboundFriendships) => {
          const inboundUserIDs = inboundFriendships.map(
            (friendship) => friendship.user1,
          );
          const outboundUserIDs = outboundFriendships.map(
            (friendship) => friendship.user2,
          );
          const allUserIDsToBeUpdated = [comment.authorID].concat(
            inboundUserIDs.filter((id) => outboundUserIDs.includes(id)),
          ); // author + all mutual friendships
          const db = firebase.firestore();
          const batch = db.batch();
          allUserIDsToBeUpdated.forEach((userID) => {
            const otherUserMainFeedRef = firebase
              .firestore()
              .collection('social_feeds')
              .doc(userID)
              .collection('main_feed')
              .doc(comment.postID);
            batch.set(
              otherUserMainFeedRef,
              {
                commentCount: commentCount,
              },
              {
                merge: true,
              },
            );
          });
          batch.commit();
          unsubscribeInbound();
          unsubscribeOutbound();
        },
      );
    },
  );
};
