import {
  setMainFeedPosts,
  setDiscoverFeedPosts,
  setFeedPostReactions,
  setMainStories,
  setCurrentUserFeedPosts,
  setFeedListenerDidSubscribe,
  setFeedFirstPost,
  setNewPostStatus,
  insertMainFeedPosts,
  insertMoreMainFeedPosts,
  setNewFeeds,
 // deleteMainFeedPosts
} from './redux';
import * as firebasePost from './firebase/post';
import * as firebaseStory from './firebase/story';
import * as firebaseComment from './firebase/comment';
import { setBannedUserIDs, setBannedUsers } from '../../user-reporting/redux';
import { reportingManager } from '../../user-reporting';

export default class FeedManager {
  constructor(reduxStore, currentUserID) {
    this.reduxStore = reduxStore;
    this.currentUserID = currentUserID;
    this.reduxStore.subscribe(this.syncTrackerToStore);
  }

  syncTrackerToStore = () => {
    // const state = this.reduxStore.getState();
    // const reactionsInRedux = state.feed.feedPostReactions;
    // if (reactionsInRedux
    //   && this.reactions != reactionsInRedux) {
    //   this.reactions = reactionsInRedux;
    //   this.hydratePostsIfNeeded(true);
    // }
  };

  getFirstProfileFeedsFromAPI = (friendsArr, authors, status) => {
    return new Promise((resolve) => {
      const url = 'https://us-central1-ninechat-e0b12.cloudfunctions.net/app/api/v1/posts/me';
      const data = {
        friendsArr,
        authors,
        status
      }
      console.log("Request>>" + JSON.stringify(data))
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data)
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        if(response){
          console.log("getFirstProfileFeedsFromAPI response>>"+ response.length);
          resolve(response);
        }
        else{
          resolve(null);
        }
      })
      .catch(error => {
        console.log("getFirstProfileFeedsFromAPI error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  getFirstFeedsFromAPI = (friendsArr, authors, status, second, nanosecond, endSecond, endNano) => {
    return new Promise((resolve) => {
      const url = 'https://us-central1-ninechat-e0b12.cloudfunctions.net/app/api/v1/posts';
      const data = {
        friendsArr,
        authors,
        status,
        second,
        nanosecond,
        endSecond,
        endNano
      }
      //console.log("Request Data>>" + JSON.stringify(data));
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data)
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        if(response){
          //console.log("getFirstFeedsFromAPI response>>"+ JSON.stringify(response));
          resolve(response);
        }
        else{
          resolve(null);
        }
      })
      .catch(error => {
        console.log("getFirstFeedsFromAPI error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  getMoreFeedsFromAPI = (friendsArr, authors, second, nanosecond, endSecond, endNano, limit, status) => {
    return new Promise((resolve) => {
      const url = 'https://us-central1-ninechat-e0b12.cloudfunctions.net/app/api/v1/pagination/posts';
      const data = {
        friendsArr,
        authors,
        second,
        nanosecond,
        endSecond,
        endNano,
        limit,
        status
      }
      console.log("More>>" + JSON.stringify(data))
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data), 
        // headers: { 
        //     "Content-type": "application/json; charset=UTF-8"
        // } 
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        //console.log("getMoreFeedsFromAPI response>>"+ response.length);
        resolve(response); 
      })
      .catch(error => {
        console.log("getMoreFeedsFromAPI error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  getMoreProfileFeedsFromAPI = (friendsArr, authors, second, nanosecond, limit, status) => {
    return new Promise((resolve) => {
      const url = 'https://us-central1-ninechat-e0b12.cloudfunctions.net/app/api/v1/pagination/posts/me';
      const data = {
        friendsArr,
        authors,
        second,
        nanosecond,
        limit,
        status
      }
      fetch(url, { 
        method: "POST", 
        body: JSON.stringify(data), 
        // headers: { 
        //     "Content-type": "application/json; charset=UTF-8"
        // } 
    }) 
      .then((resp) => resp.json())
      .then(function(response) {
        console.log("getMoreProfileFeedsFromAPI response>>"+ response.length);
        resolve(response); 
      })
      .catch(error => {
        console.log("getMoreProfileFeedsFromAPI error>>"+ JSON.stringify(error));
        resolve(null);
      });
    });
  }

  subscribeMoreFeeds = (date) => {
    firebasePost.subscribeToMoreMainFeedPosts(this.currentUserID, date).then((response) => {
      if(response == null){
        console.log('Error')
        }
        else{
          this.onMoreFeedPostsUpdate(response);
        }
    });  

  }

  subscribeIfNeeded = () => {
    const state = this.reduxStore.getState();
    this.feedUnsubscribe = firebasePost.subscribeToMainFeedPosts(
      this.currentUserID,
      this.onFeedPostsUpdate,
    );
    if (!state.feed.didSubscribeToMainFeed) {
      // this.feedUnsubscribe = firebasePost.subscribeToMainFeedPosts(
      //   this.currentUserID,
      //   this.onFeedPostsUpdate,
      // );
      this.feedFirstUnsubscribe = firebasePost.subscribeFirstPost(
        this.currentUserID,
        this.onFeedFirstPostUpdate
      )
      this.storiesUnsubscribe = firebaseStory.subscribeToStoriesFeed(
        this.currentUserID,
        this.onStoriesUpdate,
      );
      this.reactionsUnsubscribe = firebaseComment.subscribeToUserReactions(
        this.currentUserID,
        this.onReactionsUpdate,
      );
      this.discoverUnsubscribe = firebasePost.subscribeToDiscoverFeedPosts(
        this.onDiscoverPostsUpdate,
      );
      this.currentProfileFeedUnsubscribe = firebasePost.subscribeToProfileFeedPosts(
        this.currentUserID,
        this.onProfileFeedUpdate,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        this.currentUserID,
        this.onAbusesUpdate,
      );
    }
  };

  unsubscribe = () => {
    if (this.feedUnsubscribe) {
      this.feedUnsubscribe();
    }
    if (this.discoverUnsubscribe) {
      this.discoverUnsubscribe();
    }
    if (this.reactionsUnsubscribe) {
      this.reactionsUnsubscribe();
    }
    if (this.storiesUnsubscribe) {
      this.storiesUnsubscribe();
    }
    if (this.currentProfileFeedUnsubscribe) {
      this.currentProfileFeedUnsubscribe();
    }
  };

  applyReaction = (reaction, item, followEnabled = true) => {
    const state = this.reduxStore.getState();
    const reactions = state.feed.feedPostReactions;
    const existingReaction = reactions.find(
      (reaction) => reaction.postID == item.id,
    );
    var newReactions;
    if (followEnabled) {
      if (existingReaction) {
        // like => unlike
        newReactions = reactions.filter(
          (reaction) => reaction.postID != item.id,
        );
      } else {
        // like
        newReactions = reactions.concat([
          {
            postID: item.id,
            reaction: reaction,
          },
        ]);
      }
    } else {
      if (existingReaction) {
        if (reaction == null) {
          // undo previous reaction e.g. angry => null
          newReactions = reactions.filter(
            (reaction) => reaction.postID != item.id,
          );
        } else {
          // replace previous reaction
          newReactions = reactions.filter(
            (reaction) => reaction.postID != item.id,
          ); // remove previous reaction
          newReactions = newReactions.concat([
            // add new different reaction
            {
              postID: item.id,
              reaction: reaction,
            },
          ]);
        }
      } else {
        // got a reaction, with no previous reaction. Add it
        if (reaction != null) {
          newReactions = reactions.concat([
            // add brand new reaction
            {
              postID: item.id,
              reaction: reaction,
            },
          ]);
        }
      }
    }
    this.reactions = newReactions;
    this.hydratePostsIfNeeded();
  };

  hydratePostsWithReduxReactions = (posts) => {
    const state = this.reduxStore.getState();
    const reactions = state.feed.feedPostReactions;
    const bannedUserIDs = state.userReports.bannedUserIDs;
    //console.log("bannedUserIDs>>"+ JSON.stringify(bannedUserIDs));
    return this.hydratedPostsWithReactions(posts, reactions, bannedUserIDs);
  };

  deletePost = (posts) => {
    this.reduxStore.dispatch(setMainFeedPosts(posts));
  }

  onMoreFeedPostsUpdate = (posts) => {
    const state3 = this.reduxStore.getState();
    const mainFeedPosts = state3.feed.mainFeedPosts;
    //console.log("More>>"+ posts.length);
    //console.log("Original Post>>"+ mainFeedPosts.length)

    let tempArr = posts;
    for(let i = 0; i <= mainFeedPosts.length; i++){
      if(i == mainFeedPosts.length){
        //console.log("Final More Posts>>"+ JSON.stringify(tempArr))
        this.reduxStore.dispatch(insertMoreMainFeedPosts(tempArr));
      }
      else{
        let id = mainFeedPosts[i].id;
        let index = 0;
        posts.forEach((post) => {
          if(post.id == id){
            tempArr.splice(index, 1);
            index++;
            //console.log("Duplicate Post>>" + JSON.stringify(post));
          }
          else{
            index++;
          }
        })
      }
    }
  };

  onFeedPostsUpdate = (posts) => {
    this.posts = posts;
    this.hydratePostsIfNeeded();
  };

  onFeedFirstPostUpdate = (post) => {
    this.reduxStore.dispatch(setFeedFirstPost(post));
  }

  onDiscoverPostsUpdate = (posts) => {
    this.discoverPosts = posts;
   this.hydratePostsIfNeeded();
  };

  onStoriesUpdate = (stories) => {
    this.reduxStore.dispatch(setMainStories(stories));
  };

  onReactionsUpdate = (reactions) => {
    this.reactions = reactions;
    this.hydratePostsIfNeeded();
  };

  onProfileFeedUpdate = (posts) => {
    this.reduxStore.dispatch(setCurrentUserFeedPosts(posts));
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
   // abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
   abuses.forEach((abuse) => {
    if(abuse.source == this.currentUserID)
      bannedUserIDs.push(abuse.dest)
    else
      bannedUserIDs.push(abuse.source)
  });
  console.log("bannedUserIDs>>" + bannedUserIDs)
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.reduxStore.dispatch(setBannedUsers(abuses));
    this.bannedUserIDs = bannedUserIDs;
    this.hydratePostsIfNeeded();
  };

  onNewPostUpdate = (post) => {
    const state3 = this.reduxStore.getState();
    if(state3.feed.status != null && state3.feed.status != undefined && state3.feed.status != ''){
      //const arr = state3.feed.mainFeedPosts.splice(0, 0, post);
      this.reduxStore.dispatch(insertMainFeedPosts(post));
      this.reduxStore.dispatch(setNewPostStatus(null));
    }
  }


  insertPost = (posts) => {
    this.reduxStore.dispatch(setMainFeedPosts(posts));
  }

  hydratePostsIfNeeded = (skipReactionReduxUpdate = false) => {
    const state2 = this.reduxStore.getState();

    if(state2.feed.status != null && state2.feed.status != undefined && state2.feed.status != ''){
      this.unsubscribeSinglePost = firebasePost.subscribeToSinglePost(
        state2.feed.status,
        this.onNewPostUpdate,
      );
    }

    if (!this.bannedUserIDs) {
      // we are still waiting to fetch banned users
      return;
    }
    // main feed

    

    if (this.reactions && this.posts) {
      const hydratedPosts = this.hydratedPostsWithReactions(
        this.posts,
        this.reactions,
        this.bannedUserIDs,
      );
      
      if(!state2.feed.didSubscribeToMainFeed){
        this.reduxStore.dispatch(setFeedListenerDidSubscribe());
        this.reduxStore.dispatch(setMainFeedPosts(hydratedPosts));
      }
      // else{
      //   console.log("Old len>>" + state2.feed.mainFeedPosts[0].id);
      //   console.log("New len>>"+ hydratedPosts[0].id)
      //   console.log("Same???"+ state2.feed.mainFeedPosts.length + "  " + hydratedPosts.length)
      // }

      if (!skipReactionReduxUpdate) {
        this.reduxStore.dispatch(setFeedPostReactions(this.reactions));
      }
    }
    else{
     
    }
    // discover feed
    if (this.reactions && this.discoverPosts) {
      this.reduxStore.dispatch(
        setDiscoverFeedPosts(
          this.hydratedPostsWithReactions(
            this.discoverPosts,
            this.reactions,
            this.bannedUserIDs,
          ),
        ),
      );
    }
  };

  hydratedPostsWithReactions = (posts, reactions, bannedUserIDs) => {
    if (reactions && posts) {
      const hydratedPosts = posts
        .map((post) => {
          const reaction = reactions.find(
            (reaction) => reaction.postID == post.id,
          );
          if (reaction) {
            return {
              ...post,
              myReaction: reaction.reaction,
            };
          }
          return {
            ...post,
            myReaction: null, // we need to explicitly remove any previous reaction
          };
        })
        .filter(
          (post) => !bannedUserIDs || !bannedUserIDs.includes(post.authorID),
        );
      return hydratedPosts;
    }
    return posts;
  };
}
