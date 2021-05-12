import React, { useEffect, useContext, useState, useRef } from 'react';
import { Platform, TouchableOpacity, Modal, View, Alert, Image, Text, ToastAndroid } from 'react-native';
import { useSelector, ReactReduxContext, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Feed } from '../../components';
import FeedManager from '../../Core/socialgraph/feed/FeedManager';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import { friendshipUtils } from '../../Core/socialgraph/friendships';
import { firebaseStorage } from '../../Core/firebase/storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  firebasePost,
  firebaseStory,
} from '../../Core/socialgraph/feed/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { groupBy } from '../../Core/helpers/collections';
import AppStyles from '../../AppStyles';
import styles from './styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { reportingManager } from '../../Core/user-reporting';
import SocialNetworkConfig from '../../SocialNetworkConfig';
import * as FacebookAds from 'expo-ads-facebook';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import PTRView from 'react-native-pull-to-refresh';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { firebase } from '../../Core/firebase/config';
import { 
  setNewFeeds, 
  removePost, 
  setEditedProfileStatus, 
  removeProfilePost, 
  editPostReactions,
  editProfilePostReactions, 
  setProfileEditedPost } from '../../Core/socialgraph/feed/redux';

const FeedScreen = (props) => {
  const currentUser = useSelector((state) => state.auth.user);
  const friends = useSelector((state) => state.friends.friends);
  const friendships = useSelector((state) => state.friends.friendships);
  const mainFeedPosts = useSelector((state) => state.feed.mainFeedPosts);
  const reduxNewFeeds = useSelector((state) => state.feed.newFeeds);
  const reduxProfileFeeds = useSelector((state) => state.feed.profileFeeds);
  const firstPost = useSelector((state) => state.feed.firstPost);
  const mainStories = useSelector((state) => state.feed.mainStories);
  const notiCount = useSelector((state) => state.notifications.notiCount);
  const dispatch = useDispatch();
  const { store } = useContext(ReactReduxContext);
  const followTracker = new FriendshipTracker(
    store,
    currentUser.id || currentUser.userID,
    true,
    false,
    true,
  );
  const feedManager = new FeedManager(store, currentUser.id);

  const [myRecentStory, setMyRecentStory] = useState(null);
  const [groupedStories, setGroupedStories] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFeedItems, setSelectedFeedItems] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [shouldEmptyStories, setShouldEmptyStories] = useState(false);
  const [isStoryUpdating, setIsStoryUpdating] = useState(false);
  const [adsManager, setAdsManager] = useState(null);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const navMenuRef = useRef();
  const [swipable, setSwipable] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [called, setCalled] = useState(false)
  const [storyLen, setStoryLen] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [latestDate, setLatestDate] = useState('');
  const [friendsArr, setFriendsArr] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [index, setIndex] = useState(0);
  const [upIndex, setUpIndex] = useState(0);
  const [infoArr, setInfoArr] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(()=> {
    if(notiCount == 0){
      props.navigation.setParams({ showCount: false });
    }
    else{
      props.navigation.setParams({ showCount: true });
    }
    props.navigation.setParams({ notiCount });
  },[notiCount])

  useEffect(() => {
    if(reduxNewFeeds){
      console.log("Changed...")
      setFeeds(reduxNewFeeds);
    }
  }, [reduxNewFeeds]);

  useEffect(() => {
    //Subscribe stories
    feedManager.subscribeIfNeeded();
  }, [friends]);

  useEffect(() => {
    setSwipable(true);
    followTracker.subscribeIfNeeded();
    props.navigation.setParams({
      toggleCamera: toggleCamera,
      openDrawer: openDrawer,
      openCamera: openCamera,
      openVideoRecorder: openVideoRecorder,
      openMediaPicker: openMediaPicker,
      createPost: createPost,
      uploadStory: uploadStory,
      navMenuRef: navMenuRef,
      storyOnly: false
    });
  }, []);

  useEffect(()=> {
    AsyncStorage.setItem("currentUser", JSON.stringify(currentUser));
  },[])

  useEffect(() => {
    //console.log("friendships changed..." + JSON.stringify(friendships))
    if(firstTime){
      setFirstTime(false);

    let allFriendsArr = friendships.filter((friendShip) => friendShip.type == "reciprocal");
    let allAuthors = allFriendsArr.map(friend => friend.user.id);
    allFriendsArr.push({ "user": { ...currentUser } });
    allAuthors.push(currentUser.id);

     console.log("All Friends LEn>>"+ allFriendsArr.length);

    if(allFriendsArr.length % 10 == 0){
      console.log("Here...")
      let arr = [];
      let arr2 = [];
      let info = [];
      let len = allFriendsArr.length / 10;
      for(let i = 0; i < len; i++){
        let tempArr = allFriendsArr.slice(i*10, (i+1)*10); 
        arr.push(tempArr);
        let tempArr2 = allAuthors.slice(i*10, (i+1)*10); 
        arr2.push(tempArr2);
        let obj = {
          pagination: false,
          latestDateTime: null,
          upPagination: false,
          upLatestDateTime: null
        }
        info.push(obj);
      }
      setTimeout(()=> {
        console.log("Condition1...")
        console.log("Final Arr>>" + JSON.stringify(arr));
        // console.log("Final Arr2>>" + arr2.length);
        // console.log("Final Info>>" + JSON.stringify(info));  
        setFriendsArr(arr);
        setAuthors(arr2);
        setInfoArr(info);
        getFirstFeeds(arr, arr2, info, false, 0);
      },500)
    }
    else if(allFriendsArr.length < 10){
      let arr = [allFriendsArr];
      let arr2 = [allAuthors];
      let info = [{
        pagination: false,
        latestDateTime: null,
        upPagination: false,
        upLatestDateTime: null
      }];
      setTimeout(()=> {
        console.log("Condition2...")
        console.log("Final Arr>>" + JSON.stringify(arr));
        // console.log("Final Arr2>>" + arr2.length);
        // console.log("Final Info>>" + JSON.stringify(info));
        setFriendsArr(arr);
        setAuthors(arr2);
        setInfoArr(info);
        getFirstFeeds(arr, arr2, info, false, 0);
      },500)
    }
    else{ //93
      let len = parseInt(allFriendsArr.length / 10) + 1; //10
      let end = (len-2) * 10; //80
      let arr = [];
      let arr2 = [];
      let info = [];
      for(let j=0;j<=len;j++){
        if(j == len){
          setInfoArr(info);
        }
        else{
          let obj = {
            pagination: false,
            latestDateTime: null,
            upPagination: false,
            upLatestDateTime: null
          }
          info.push(obj);
        }
      }

      if(len == 2){
        let len1 = parseInt(allFriendsArr.length / 2); //6
        console.log("Extra Lengths>>" + len1);
        let extraFriendsArr1 = allFriendsArr.slice(0, len1); 
        let extraFriendsArr2 = allFriendsArr.slice(len1, allFriendsArr.length); 
        //console.log("Extra Friends 2>>" + extraFriendsArr1.length + ' ' + extraFriendsArr2.length)
        let extraAuthors1 = allAuthors.slice(0, len1); 
        let extraAuthors2 = allAuthors.slice(len1, allAuthors.length); 
        arr.push(extraFriendsArr1);
        arr.push(extraFriendsArr2);
        arr2.push(extraAuthors1);
        arr2.push(extraAuthors2);
        setTimeout(()=> {
          setFriendsArr(arr);
          setAuthors(arr2);
          console.log("Condition3...")
          console.log("Final Arr>>" + arr.length);
         // console.log("Final Arr2>>" + arr2.length);
          //console.log("Final Info>>" + JSON.stringify(info));
          getFirstFeeds(arr, arr2, info, false, 0);
        },500)
      }
      else{
        for(let i = 0; i < len-2; i++){
          let tempArr = allFriendsArr.slice(i*10, (i+1)*10); 
          arr.push(tempArr);
          let tempArr2 = allAuthors.slice(i*10, (i+1)*10);
          arr2.push(tempArr2);
        }
        let extraLen = allFriendsArr.length - end; // 93-80 = 13
        let len1 = extraLen / 2; //6
        let len2 = extraLen - len1; //7
        console.log("Extra Lengths>>" + len1 + " " + len2);
        let extraFriendsArr1 = allFriendsArr.slice(end, end+len1); 
        let extraFriendsArr2 = allFriendsArr.slice(end+len1, allFriendsArr.length); 
        let extraAuthors1 = allAuthors.slice(end, end+len1); 
        let extraAuthors2 = allAuthors.slice(end+len1, allFriendsArr.length); 
        arr.push(extraFriendsArr1);
        arr.push(extraFriendsArr2);
        arr2.push(extraAuthors1);
        arr2.push(extraAuthors2);
        setTimeout(()=> {
          setFriendsArr(arr);
          setAuthors(arr2);
          console.log("Condition4...")
          console.log("Final Arr>>" + arr.length);
          // console.log("Final Arr2>>" + arr2.length);
          // console.log("Final Info>>" + JSON.stringify(info));
          getFirstFeeds(arr, arr2, info, false, 0);
        },500)
      }

    } 
  }
  }, [friendships]);

  const getUpdateFeeds = () => {
    const today = new Date();
    const yesterday = new Date(today);
    today.setDate(today.getDate());
    yesterday.setDate(yesterday.getDate() - 3);
    let start = firebase.firestore.Timestamp.fromDate(today);
    let end = firebase.firestore.Timestamp.fromDate(yesterday);

    console.log("Up Index>>" + (upIndex + 1))

    if(friendsArr.length == upIndex){
      setUpIndex(0);
      getRealUpdateFeeds(0, start, end);
    }
    else{
      getRealUpdateFeeds(upIndex, start, end)
    }

    
  }

  const getRealUpdateFeeds = (tempIndex, start, end) => {
  feedManager.getFirstFeedsFromAPI(friendsArr[tempIndex], authors[tempIndex], "Normal", start.seconds, start.nanoseconds, end.seconds, end.nanoseconds).then((response) => {
    if(response && response.length > 0){
      //console.log("getFirst
        var tempArr = response.splice(0, response.length-1); 
        let ids = feeds.map(element => element.id);
        let difference = tempArr.filter(x => !ids.includes(x.id)); // filter duplicate posts
        if(difference && difference.length > 0){
          //console.log("New Count>>" + difference.length + ' ' + JSON.stringify(difference))
          getReactionForFeeds(difference, 'top');
        }
        else{
          console.log("No new feeds...")
        }
        let temp = infoArr;
        temp[tempIndex].upPagination = true;
        temp[tempIndex].upLatestDateTime = response[response.length-1];   
    }
    else{
      console.log("No new feeds")
    }
    setLoading(false);
    setIsFetching(false);
    setUpIndex(tempIndex+1);
  })
}

  const getFirstFeeds = (friends, authorsArr, infos, status, index2) => {
    console.log("getFirstFeeds Index>>" + index2)
    const today = new Date();
    const yesterday = new Date(today);
    today.setDate(today.getDate());
    yesterday.setDate(yesterday.getDate() - 3);
    let startDate = firebase.firestore.Timestamp.fromDate(today);
    let endDate = firebase.firestore.Timestamp.fromDate(yesterday);
    setStartDate(startDate);
    setEndDate(endDate);
    feedManager.getFirstFeedsFromAPI(friends[index2], authorsArr[index2], "Normal", startDate.seconds, startDate.nanoseconds, endDate.seconds, endDate.nanoseconds).then((response) => {
      if(response && response.length > 0){
        //console.log("getFirstFeedsFromAPI response>>"+ response.length);
        var tempArr = response.splice(0, response.length-1); 
        console.log("Random Feeds>>"+ tempArr.length);
        if(status){ //not first time
          console.log("Not First Time...");
          let ids = feeds.map(element => element.id);
          let difference = tempArr.filter(x => !ids.includes(x.id)); // filter duplicate posts
          if(difference && difference.length > 0){
            getReactionForFeeds(difference, 'top');
          }
        }
        else{ //first time
          console.log("First Time...")
          setLatestDate(response[response.length-1]); //latest element of response is latest date
          getReactionForFeeds(tempArr, 'first');
          let temp = infos;
          temp[index2].pagination = true;
          temp[index2].latestDateTime = response[response.length-1];
        }  
        setLoading(false);
        setIsFetching(false);
        setIndex(index2+1);
      }
      else{
          console.log("No Feeds for first time..." + index2);
          if(friends.length == (index2+1)){
            setLoading(false);
            setIsFetching(false);
            dispatch(setNewFeeds([]));
          }
          else{
            getFirstFeeds(friends, authorsArr, infos, status, index2+1);
          }
          setIndex(index2+1);
          //
      }
    })
  }

  const getReactionForFeeds = (tempArr, moreStatus) => {
    for(let index=0;index<=tempArr.length;index++){
      if(index != tempArr.length){
        let timeObj = {
          "seconds": tempArr[index].createdAt._seconds,
          "nanoseconds": tempArr[index].createdAt._nanoseconds
        }
        tempArr[index].createdAt = timeObj;
        tempArr[index]['iconSource'] = AppStyles.iconSet['thumbsupUnfilled'];
        tempArr[index]['gaveReaction'] = 'thumbsupUnfilled';

        if(tempArr[index].postReactions){
          tempArr[index].postReactions.map((reaction) => {
            if(currentUser.id == reaction.userID){
              if(reaction.reaction == 'like')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['like'];
                tempArr[index]['gaveReaction'] = 'like';
              }
              else if(reaction.reaction == 'love')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['love'];
                tempArr[index]['gaveReaction'] = 'love'
              }
              else if(reaction.reaction == 'angry')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['angry'];
                tempArr[index]['gaveReaction'] = 'angry'
              }
              else if(reaction.reaction == 'surprised')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['surprised'];
                tempArr[index]['gaveReaction'] = 'surprised'
              }
              else if(reaction.reaction == 'laugh')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['laugh'];
                tempArr[index]['gaveReaction'] = 'laugh'
              }
              else if(reaction.reaction == 'cry')
              {
                tempArr[index]['iconSource'] = AppStyles.iconSet['cry'];
                tempArr[index]['gaveReaction'] = 'cry'
              }
            }
          })
        }
      }
      else{
        let newArr = tempArr;
        if(moreStatus == 'bottom')
          newArr = [ ...feeds, ...tempArr ];
        else if(moreStatus == 'top')
          newArr = [ ...tempArr, ...feeds ];
        dispatch(setNewFeeds(newArr));
      }
    }
  }
  
  useEffect(() => {
    setIsStoryUpdating(false);
  }, [groupedStories, myRecentStory]);

  useEffect(() => {
    const placementID =
      SocialNetworkConfig.adsConfig &&
      SocialNetworkConfig.adsConfig.facebookAdsPlacementID;
    if (placementID) {
      const manager = new FacebookAds.NativeAdsManager(placementID, 5);
      manager.onAdsLoaded(onAdsLoaded);
      setAdsManager(manager);
    }
  }, [1]);

  useEffect(() => {
   if(!called){
      setCalled(true);
      if (mainStories) {
        setStoryLen(mainStories.length);
        const freshStories = filterStaleStories(mainStories);
        groupAndDisplayStories(freshStories);
      }
    }
    else{
      if(storyLen != mainStories.length){
        setStoryLen(mainStories.length);
        const freshStories2 = filterStaleStories(mainStories);
        groupAndDisplayStories(freshStories2);
      }
    }
  }, [mainFeedPosts, mainStories, adsLoaded, storyLen]);

  useEffect(() => {
    if (mainStories) {
      const freshStories = filterStaleStories(mainStories);
      groupAndDisplayStories(freshStories);
    }
  }, [mainStories]);
  
  const _getMoreFeeds = () => {
    //console.log("Date>>"+ JSON.stringify(latestDate))
    console.log("_getMoreFeeds Len>>" + friendsArr.length + ' ' + (index+1));

    if(friendsArr.length == index){
      setIndex(0);
      getRealFeeds(0);
    }
    else{
      getRealFeeds(index);
    }
  }

  const getRealFeeds = (tempIndex) => {
    console.log("Information>>" + JSON.stringify(infoArr[tempIndex]));
    if(infoArr[tempIndex].pagination){
      console.log("33333333333 For Pagination...")
      
      feedManager.getMoreFeedsFromAPI(friendsArr[tempIndex], authors[tempIndex],  
        infoArr[tempIndex]['latestDateTime']._seconds, infoArr[tempIndex]['latestDateTime']._nanoseconds,  
        endDate.seconds, endDate.nanoseconds,
        10, "Normal").then((response) => {
        if(response && response.length > 0){
          console.log("More Feeds>>"+ response.length);
          var result = response.splice(0, response.length-1); 
  
          let ids = feeds.map(element => element.id);
          result = result.filter(x => !ids.includes(x.id)); // filter duplicate posts
          let temp = infoArr;
          temp[tempIndex].latestDateTime = response[response.length-1];
          setLatestDate(response[response.length-1]); //latest element of response is latest date
          getReactionForFeeds(result, 'bottom');
        }
        setMoreLoading(false);
        setIndex(tempIndex+1);
      });
    }
    else{
      console.log("222222222222 Not Pagination...");
      feedManager.getFirstFeedsFromAPI(friendsArr[tempIndex], authors[tempIndex], "Normal", startDate.seconds, startDate.nanoseconds, endDate.seconds, endDate.nanoseconds).then((response) => {
        if(response && response.length > 0){
          console.log("getFirstFeedsFromAPI response>>"+ response.length);
          var tempArr = response.splice(0, response.length-1); 
          console.log("Random Feeds>>"+ tempArr.length);

            let ids = feeds.map(element => element.id);
            let difference = tempArr.filter(x => !ids.includes(x.id)); // filter duplicate posts
            let temp = infoArr;
            temp[tempIndex].pagination = true;
            temp[tempIndex].latestDateTime = response[response.length-1];
            if(difference && difference.length > 0){
              getReactionForFeeds(difference, 'bottom');
            }
        }
        setMoreLoading(false);
        setIndex(tempIndex+1);
      })
    }
  }

  const _refresh = () => {
    getUpdateFeeds();
  }

  const getPaginationFeeds = () => {
    setMoreLoading(true);
    // if(reduxNewFeeds.length < 10){
    //   setMoreLoading(false);
    // }
    // else{
      if(reduxNewFeeds.length >= 20){//render only 20 posts
        let cloneArr = reduxNewFeeds;
        cloneArr.splice(0, 10); 
        dispatch(setNewFeeds(cloneArr)); //remove first 10 posts
        _getMoreFeeds();
      }
      else{
        _getMoreFeeds();
      }
   // }
  }

  const filterStaleStories = (stories) => {
    const oneDay = 60 * 60 * 24 * 1000;
    const now = +new Date();

    return stories.filter((story) => {
      if (!story.createdAt) {
        return false;
      }
      let createdAt;

      if (story.createdAt.seconds) {
        createdAt = +new Date(story.createdAt.seconds * 1000);
      } else {
        createdAt = +new Date(story.createdAt * 1000);
      }

      if (now - createdAt < oneDay) {
        return story;
      }
    });
  };

  const groupAndDisplayStories = (stories) => {
    setIsStoryUpdating(true);
    const formattedStories = [];
    var myStory = null;
    const groupedByAuthorID = groupBy('authorID');
    const groupedStories = groupedByAuthorID(stories);

    for (var key of Object.keys(groupedStories)) {
      const rawStory = groupedStories[key];
      const firstStoryInGroup = rawStory[0];
      const author = firstStoryInGroup.author;
      if (!author) {
        continue;
      }
      const formattedStory = {
        authorID: firstStoryInGroup.authorID,
        id: firstStoryInGroup.storyID,
        idx: 0,
        profilePictureURL: author.profilePictureURL,
        firstName: author.firstName || author.fullname,
        items: rawStory.map((item) => {
          return {
            src: item.storyMediaURL,
            type: item.storyType,
            createdAt: item.createdAt,
          };
        }),
      };
      if (formattedStory.authorID === currentUser.id) {
        myStory = formattedStory;
        //console.log("MyStory 1>>"+ JSON.stringify(myStory))
      } else {
        formattedStories.push(formattedStory);
      }
    }
    setGroupedStories(formattedStories);
    if (myStory) {
      setMyRecentStory(myStory);
      //console.log("MyStory>>"+ JSON.stringify(myStory))
    }
  };

  const onAdsLoaded = () => {
    setAdsLoaded(true);
  };

  const onCommentPress = (item) => {
    props.navigation.navigate('FeedDetailPost', {
      item: item,
      lastScreenTitle: 'Feed',
      reduxNewFeeds
    });
  };

  const toggleCamera = () => {
    if (Platform.OS === 'ios') {
      setIsCameraOpen(!isCameraOpen);
    } else {
      if (navMenuRef.current) {
        navMenuRef.current.open();
        props.navigation.setParams({ storyOnly: true });
      }
    }
    setTimeout(() => {
      console.log("Time out..")
      navMenuRef.current.close();
      props.navigation.setParams({ storyOnly: false });
    }, 2000);
  };

  const onSwipe = (gestureName) => {
    if (swipable) {
      const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
      switch (gestureName) {
        case SWIPE_LEFT:
          props.navigation.navigate('FeedProfileStack')
          break;
        case SWIPE_RIGHT:
          ImagePicker.openCamera({
            mediaType: 'photo',
          }).then((image) => {
            if (image.path) {
              onPostStory({ uri: image.path, mime: image.mime });
            }
          });
          break;
      }
    }

  }

  const capturePhoto = (image) => {
    console.log("capture>>", image)
    if (image.path) {
      let index = image.path.lastIndexOf('.');
      let mime = 'image/' + image.path.substring(index+1)
      onPostStory({ uri: image.path, mime: mime });
    }
  }

  const openVideoRecorder = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then((image) => {
      if (image.path) {
        onPostStory({ uri: image.path, mime: image.mime });
      }
    });
  };

  const goStory = (key) => {
    if(key == 'camera')
      openCamera();
    else if(key == 'video')
      openVideoRecorder();
    else
      openMediaPicker();
  }

  const openCamera = () => {
    //setShow(true)
    ImagePicker.openCamera({
      cropping: true,
      width: 400,
      height: 380
    }).then((image) => {
      if (image.path) {
        let index = image.path.lastIndexOf('.');
        let mime = 'image/' + image.path.substring(index+1)
        onPostStory({ uri: image.path, mime: mime });
      }
    }).catch((err)=> {
      console.log("JJ err>", err)
    })
  };

  const openMediaPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    }).then((image) => {
      if (image.path) {
        onPostStory({ uri: image.path, mime: image.mime });
      }
    });
  };

  const createPost = () => {
    props.navigation.navigate('CreatePost', { newPost: true })
  };

  const onViewReaction = (item) => {
    console.log("onViewReaction>>" + JSON.stringify(item));
    props.navigation.navigate('ReactionList', {
      postID: item.id
    })
  }

  const uploadStory = () => {
  };

  const openDrawer = () => {
    props.navigation.openDrawer();
  };

  const onCameraClose = () => {
    setIsCameraOpen(false);
  };

  const onUserItemPress = (shouldOpenCamera) => {
    if (shouldOpenCamera) {
      toggleCamera();
    }
  };

  const onLoadMoreData = () => {
    console.log("Loading moreData...");
    // let cloneArr = feeds;
    // cloneArr.splice(0, 9);
    // setFeeds(cloneArr);
  }

  const onFeedUserItemPress = async (item) => {
    if (item.id === currentUser.id) {
      props.navigation.navigate('FeedProfileStack', {
        stackKeyTitle: 'Profile',
        lastScreenTitle: 'Feed',
        fromMoment: true,
      });
    } else {
      props.navigation.navigate('FeedProfileStack', {
        user: item,
        stackKeyTitle: 'Profile',
        lastScreenTitle: 'Feed',
        fromMoment: true,
        user: item,
      });
    }
  };

  const onMediaClose = () => {
    setIsMediaViewerOpen(false);
    setSwipable(true);
  };

  const onMediaPress = (media, mediaIndex) => {
    setSelectedFeedItems(media);
    setSelectedMediaIndex(mediaIndex);
    setSwipable(false);
    console.log("mmm", media)
    props.navigation.navigate('MediaSwiper',{
      feedItems: media
    })
  };

  const onPostStory = async (source) => {
    const story = {
      authorID: currentUser.id,
      storyMediaURL: '',
      storyType: source.mime,
    };
    firebaseStorage.uploadImage(source.uri).then((response) => {
      if (!response.error) {
        story.storyMediaURL = response.downloadURL;
        firebaseStory.addStory(
          story,
          friendshipUtils.followerIDs(friendships, friends, false),
          currentUser,
        ).then((result) => {
          if(result.success){
            ToastAndroid.show('Upload success', ToastAndroid.SHORT);
          }
          else
          ToastAndroid.show('Upload fail', ToastAndroid.SHORT);
        })
        .catch((err) => {
          ToastAndroid.show('Upload fail', ToastAndroid.SHORT);
        })
      }
    })
    .catch((err) => {
      ToastAndroid.show('Upload fail', ToastAndroid.SHORT);
    })
  };

  
  const getIconWithReaction = (reaction) => {
    let icon = 'thumbsupUnfilled';
    if(reaction == 'like')
    {
      icon = AppStyles.iconSet['like'];
    }
    else if(reaction == 'love')
    {
      icon = AppStyles.iconSet['love'];
    }
    else if(reaction == 'angry')
    {
      icon = AppStyles.iconSet['angry'];
    }
    else if(reaction == 'surprised')
    {
      icon = AppStyles.iconSet['surprised'];
    }
    else if(reaction == 'laugh')
    {
      icon = AppStyles.iconSet['laugh'];
    }
    else if(reaction == 'cry')
    {
      icon = AppStyles.iconSet['cry'];
    }
    return icon;
  }

  const deletePostReaction = async (item) => {

    let reactions = item.postReactions;
    reactions = reactions.filter((reaction) => reaction.userID != currentUser.id)

    let temp =  feeds.map(
      (feed) => feed.id === item.id ? 
        {...feed, 
          postReactions: reactions, 
          postReactionsCount: reactions.length, 
          gaveReaction: 'thumbsupUnfilled', 
          iconSource: AppStyles.iconSet['thumbsupUnfilled'] 
        }
        : feed
  );
  setFeeds(temp);

    let reactionDelRes = firebasePost.deletePostReaction(item.id, item.authorID, currentUser.id,
      onDeleteReactionDone);
  }

  const giveReaction = async (reaction, item, insertStatus) => {
    //console.log("Item>>"+ JSON.stringify(item))
    let icon = getIconWithReaction(reaction);
    
    let newReaction = {
      userID: currentUser.id,
      reaction
    }
    let reactions = [];
    if(item.postReactions == undefined || item.postReactions == null || item.postReactions.length == 0){
      reactions = [newReaction]
    }
    else{
      reactions.push(newReaction);
    }
    let temp =  feeds.map(
      (feed) => feed.id === item.id ? 
        {...feed, 
          postReactions: reactions, 
          postReactionsCount: reactions.length, 
          gaveReaction: reaction, 
          iconSource: icon 
        }
        : feed
  );
  setFeeds(temp);

  let reactionRes = await firebasePost.applyPostReaction(item, currentUser, currentUser.id, reaction, insertStatus,
    onGiveReactionDone);
  }

  const onDeleteReactionDone = (result) => {
    dispatch(editPostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']));
    if(result.authorID == currentUser.id && reduxProfileFeeds && reduxProfileFeeds.length > 0){
      dispatch(editProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, 'thumbsupUnfilled', AppStyles.iconSet['thumbsupUnfilled']))
      let obj = {
        id: result.postID,
        postReactions: result.reactions,
        postReactionsCount: result.postReactionsCount,
        gaveReaction: 'thumbsupUnfilled',
        iconSource: AppStyles.iconSet['thumbsupUnfilled']
      }
      dispatch(setProfileEditedPost(obj));
      dispatch(setEditedProfileStatus(true));
    }
  }

  const onGiveReactionDone = (result) => {
    console.log("onGiveReactionDone>>" + JSON.stringify(result))
    if(result != null && result != undefined){
      let icon = getIconWithReaction(result.gaveReaction);
      dispatch(editPostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon));
      if(result.authorID == currentUser.id && reduxProfileFeeds && reduxProfileFeeds.length > 0)
      {
          console.log("dddddddddd");
          dispatch(editProfilePostReactions(result.postID, result.reactions, result.postReactionsCount, result.gaveReaction, icon))
          let obj = {
            id: result.postID,
            postReactions: result.reactions,
            postReactionsCount: result.postReactionsCount,
            gaveReaction: result.gaveReaction,
            iconSource: icon
          }
          dispatch(setProfileEditedPost(obj));
          dispatch(setEditedProfileStatus(true));
      }
    }
    else{
      ToastAndroid.show('Fail', ToastAndroid.SHORT);
    }
  }

  const onReaction = async (reaction, item) => {

    console.log("Post>>" + item.id);
    let reactionRes = firebasePost.applyPostReaction(item.id, currentUser, currentUser.id, reaction, false);
  };

  const deleteStory = () => {
    console.log("Delete Story");
  }

  const onEditPost = async (item) => {
    props.navigation.navigate('CreatePost',{ item, newPost: false })
  }

  const onSharePostToChat = (item) => {
    let url = '';
    if(item.postMedia && item.postMedia.length > 0){
      url = item.postMedia[0];
      url['uri'] = url.url;
      url['source'] = url.url;
    }
    else{
      url = {
        profile: item.author.profilePictureURL
      }
    }
    props.navigation.navigate('FeedGroupChat', { 
      forwarded: true, 
      shareStatus: true,
      shareText: item.postText,
      shareName: item.author.firstName +
      (item.author.lastName ? ' ' + item.author.lastName : ''),
      shareMedia: url,
      sharePostInfo: item,
      forwardMessage: ''
    })
  }

  const onSharePost = async (item) => {
    if (item.postMedia && item.postMedia.length == 1) {
      const fs = RNFetchBlob.fs;
      RNFetchBlob.config({
        fileCache: true
      })
        .fetch("GET", item.postMedia[0].url)
        .then(resp => {
          imagePath = resp.path();
          return resp.readFile("base64");
        })
        .then(base64Data => {
          if(item.postMedia[0].mime == 'image/jpeg')
            goSharePost(item.postText, `data:image/jpeg;base64,${base64Data}`, false);
          else
            goSharePost(item.postText, `data:video/mp4;base64,${base64Data}`, false);
        });
    }
    else if (item.postMedia && item.postMedia.length > 1) {
      let uploadPromises = [];
      item.postMedia.forEach((media) => {
        let imagePath = null;
        uploadPromises.push(
          new Promise((resolve, reject) => {
            RNFetchBlob.config({
              fileCache: true
            })
              .fetch("GET", media.url)
              .then(resp => {
                imagePath = resp.path();
                return resp.readFile("base64");
              })
              .then(base64Data => {
                if(media.mime == 'image/jpeg')
                  resolve(`data:image/jpeg;base64,${base64Data}`);
                else
                  resolve(`data:video/mp4;base64,${base64Data}`);
              });
          })
        )
      })
      Promise.all(uploadPromises).then((values) => {
        goSharePost(item.postText, values, true);
      });  
    }
    else{
      goSharePost(item.postText, '', false);
    }
  };

  const goSharePost = (message, url, multiple) => {
    if(multiple){
      Share.open({
        title: 'Share Nine Chat post',
        message,
        urls: url,
        
      })
      .then((res) => { console.log("Share res>>"+ JSON.stringify(res)) })
      .catch((err) => { err && console.log("Share err>>"+ JSON.stringify(err)); });
    }
    else{
      console.log("message>>"+ message);
      Share.open({
        title: 'Share Nine Chat post',
        message,
        url
      })
      .then((res) => { console.log("Share res>>"+ JSON.stringify(res)) })
      .catch((err) => { err && console.log("Share err>>"+ JSON.stringify(err)); });
    }
  }

  const onDeletePost = (item) => {
    Alert.alert(
      '',
      IMLocalized('Are you sure you want to delete?'),
      [
        { 
          text: IMLocalized('No') ,
          style: 'cancel'
        },
        { 
          text: IMLocalized('OK'),
          onPress: () => {
            deletePost(item)
          }
        }
    ]
    );
  };

  const deletePost = async (item) => {

    let temp = feeds.filter((feed) => feed.id != item.id);
    setFeeds(temp);
    
    let deletePostUnsubscribe = await firebasePost.deletePost(
      item,
      onDeletePostSuccess,
    );
  }
  
  const onDeletePostSuccess = (postID) => {
    dispatch(removePost(postID));
    if(reduxProfileFeeds && reduxProfileFeeds.length > 0){
      dispatch(removeProfilePost(postID));
      dispatch(setEditedProfileStatus('edited'));
    }
    ToastAndroid.show(IMLocalized('Post was successfully deleted'), ToastAndroid.SHORT);
  }

  const onUserReport = async (item, type) => {
    if(type == IMLocalized('Report Post')){
      console.log("ReportPost>>" + item.id)
      //const res = await firebasePost.deletePostFromUser(currentUser.id, item);
      const res = await firebasePost.reportPost(currentUser.id, item);
      if (res.error) {
        alert(res.error);
      }
      else if(res.success){
        ToastAndroid.show(IMLocalized('Post was successfully reported'), ToastAndroid.SHORT);
      }
    }
    else{
      reportingManager.markAbuse(currentUser.id, item.authorID, type);
    }
  };
  const handleOnEndReached = (distanceFromEnd) => {
  };

  const onEmptyStatePress = () => {
    props.navigation.navigate('Friends');
  };

  const config = {
    velocityThreshold: 0.9,
    directionalOffsetThreshold: 80
  };

  const emptyStateConfig = {
    title: IMLocalized('Welcome'),
    description: IMLocalized(
      'Go ahead and follow a few friends. Their posts will show up here.',
    ),
    //buttonName: IMLocalized('Find Friends'),
    //onPress: onEmptyStatePress,
  };

  // if(show){
  //   return(
  //     <Modal
  //     style={styles.container}
  //     isOpen={true}
  //     position="center"
  //     swipeToClose
  //     swipeArea={250}
  //     coverScreen={true}
  //     useNativeDriver={false}
  //     animationDuration={500}>
  //     <CameraScreen capturePhoto={(f)=> capturePhoto(f)} disableCamera={()=> setShow(false)} />
  //   </Modal>
  //   )
  // }

  return (
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction)}
      config={config}
      style={{
        flex: 1,
      }}
    >

    <View style={styles.container}>
      <PTRView onRefresh={_refresh} style={{ backgroundColor: 'white' }} >
      <Feed
            loading={loading}
            moreLoading={moreLoading}
            getMore={getPaginationFeeds}
            feed={feeds}
            displayStories={true}
            onCommentPress={onCommentPress}
            onSharePress={onSharePost}
            onSharePostToChat={onSharePostToChat}
            user={currentUser}
            isCameraOpen={isCameraOpen}
            onCameraClose={onCameraClose}
            onUserItemPress={onUserItemPress}
            onFeedUserItemPress={onFeedUserItemPress}
            onViewReaction={onViewReaction}
            isMediaViewerOpen={isMediaViewerOpen}
            feedItems={selectedFeedItems}
            onMediaClose={onMediaClose}
            onMediaPress={onMediaPress}
            selectedMediaIndex={selectedMediaIndex}
            stories={groupedStories || []}
            userStories={myRecentStory}
            onPostStory={onPostStory}
            onReaction={onReaction}
            handleOnEndReached={handleOnEndReached}
            isFetching={isFetching}
            shouldEmptyStories={shouldEmptyStories}
            isStoryUpdating={isStoryUpdating}
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            giveReaction={giveReaction}
            onUserReport={onUserReport}
            deletePostReaction={deletePostReaction}
            shouldReSizeMedia={true}
            willBlur={false}
            onEmptyStatePress={onEmptyStatePress}
            adsManager={adsManager}
            emptyStateConfig={emptyStateConfig}
            deleteStory={deleteStory}
            onLoadMoreData={onLoadMoreData}
          /> 
      </PTRView>
    </View>

    </GestureRecognizer>
  );
};

FeedScreen.navigationOptions = ({ screenProps, navigation }) => {
  const { params = {} } = navigation.state;

  let androidStoryOptions = [
    {
      key: 'mystory',
      onSelect: params.uploadStory,
      iconSource: '',
      name: IMLocalized('My Story')
    },
    {
      key: 'camera',
      onSelect: params.openCamera,
      iconSource: 'camera',
      name: IMLocalized('Camera')
    },
    {
      key: 'video',
      onSelect: params.openVideoRecorder,
      iconSource: 'video',
      name: IMLocalized('Video')
    },
    {
      key: 'picker',
      onSelect: params.openMediaPicker,
      iconSource: 'image',
      name: IMLocalized('gallery')
    },
  ];
  


  return {
    headerTitle: (
      <View style={{flexDirection: 'row',
      alignItems: 'center',}}>
        <Image source={require('../../assets/img/logo_only.png')} style={{ width: 40, height: 40, marginLeft: 10 }} />
        <Text style={{ color: '#3494c7', fontSize: 22, paddingLeft: 6, fontFamily: AppStyles.customFonts.klavikaMedium }}>Nine Chat</Text>
      </View>
    ),
    headerTitleStyle: {
      fontFamily: AppStyles.customFonts.klavikaMedium,
      color: '#3494c7',
    },
    headerRight: (
      <View style={styles.doubleNavIcon}>
        <TouchableOpacity style={styles.btn} onPress={params.createPost}>
          <IconFeather name='edit' size={hp(2.7)} color='#3494c7' />
        </TouchableOpacity>
        <Menu ref={navigation.getParam('navMenuRef')} style={styles.btn}>
          <MenuTrigger>
              <Icon name='add' size={hp(2.8)} color='#3494c7' style=
                  {{
                    alignSelf: 'center',
                    paddingRight: 6
                  }} 
              />
          </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  ...styles.navIconMenuOptions,
                  backgroundColor: 'white',
                },
              }}>

            {androidStoryOptions.map((option) => (
              <MenuOption onSelect={option.onSelect}>
                   {
                      option.key == 'mystory' ?
                      <Text style={styles.name2}>{option.name}</Text>
                      :
                      <View style={styles.row}>
                        <IconFeather name={option.iconSource} size={hp(2.7)} color='#546d7a' />
                          <Text style={styles.name3}>{option.name}</Text>
                      </View>
                    } 
              </MenuOption>

            ))} 

            </MenuOptions>
        </Menu>
        <TouchableOpacity
         style={styles.bell}
          onPress={() => {
            navigation.navigate('FeedNotification', {
            lastScreenTitle: 'Feed',
            appStyles: AppStyles,
            title: IMLocalized('Notifications')
          })}
          }>
          {
            navigation.getParam('showCount') == true && (
            <TouchableOpacity style={styles.notiCount}
              onPress={() => navigation.navigate('FeedNotification', {
                lastScreenTitle: 'Feed',
                appStyles: AppStyles,
                title: IMLocalized('Notifications')
              })}
              >
              <Text style={styles.noticount}>
                {navigation.getParam('notiCount')} 
              </Text>
          </TouchableOpacity>
          )}
          <Image style={styles.image} source={AppStyles.iconSet.bell} />
        </TouchableOpacity>  
      </View>
    ),
  };
};

export default FeedScreen;
