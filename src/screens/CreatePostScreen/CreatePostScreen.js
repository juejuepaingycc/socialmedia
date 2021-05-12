import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler, ToastAndroid, ActivityIndicator, Alert } from 'react-native';
import TextButton from 'react-native-button';
import { connect } from 'react-redux';
import { CreatePost } from '../../components';
import { firebasePost } from '../../Core/socialgraph/feed/firebase';
import { firebaseStorage } from '../../Core/firebase/storage';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { friendshipUtils } from '../../Core/socialgraph/friendships';
import { ProcessingManager } from 'react-native-video-processing';
import { setNewPostStatus } from '../../Core/socialgraph/feed/redux';
import { insertNewFeeds, insertProfileFeeds, setProfileFeeds, editNewFeeds, editProfileFeeds, setEditedProfileStatus } from '../../Core/socialgraph/feed/redux';
import moment from 'moment';

const defaultPost = {
  postText: '',
  commentCount: 0,
  reactionsCount: 0,
  reactions: {
    surprised: 0,
    angry: 0,
    sad: 0,
    laugh: 0,
    like: 0,
    cry: 0,
    love: 0,
  },
};

class CreatePostScreen extends Component {
  static navigationOptions = ({ screenProps, navigation }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    const { params = {} } = navigation.state;

    return {
      headerTitle: params.title,
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium
      },
      // headerLeft: Platform.OS === 'android' && (
      //   <TouchableOpacity onPress={params.onPost}>
      //     <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
      //   </TouchableOpacity>
      // ),
      headerRight: !params.isPosting && (
      //   <ActivityIndicator style={{ margin: 10 }} size="small" />
      // ) : (
          <TextButton style={{ marginRight: 12, fontFamily: AppStyles.customFonts.klavikaMedium }}
            onPress={params.onPost}
          >
            {params.buttonName}
          </TextButton>
        ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  goingBack = () => {
    return true
  }

  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.newStatus =  this.props.navigation.getParam('newPost');
    this.fromProfile = this.props.navigation.getParam('fromProfile');
    this.state = {
      post: defaultPost,
      postMedia: [],
      location: '',
      paramAddress: '',
      loading: false,
      newPost: this.newStatus,
      oldPostMedia: [],
      newPostMedia: [],
      
      paramValue: '',
      privacy: {
        title: IMLocalized('Friends'),
        engTitle: 'Friends',
        description: IMLocalized('Your friends on Nine Chat'),
        icon: 'people',
        checked: true
      },
      privacyOptions: [
        {
          title: IMLocalized('Public'),
          engTitle: 'Public',
          description: IMLocalized('Anyone on Nine Chat'),
          icon: 'earth',
          checked: false
        },
        {
          title: IMLocalized('Friends'),
          engTitle: 'Friends',
          description: IMLocalized('Your friends on Nine Chat'),
          icon: 'people',
          checked: true
        },
        {
          title: IMLocalized('Only me'),
          engTitle: 'Only me',
          description: IMLocalized('Only me'),
          icon: 'lock-closed-outline',
          checked: false
        },
      ]
    };
    this.inputRef = React.createRef();
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.inputRef.current.focus();
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );

    this.props.navigation.setParams({
      onPost: this.onPost,
      isPosting: false,
      buttonName: IMLocalized('Edit'),
      title: IMLocalized('Edit Post')
    });
    if(!this.item){
      this.props.navigation.setParams({
        buttonName: IMLocalized('Post'),
        title: IMLocalized('create post')
      });
    }

    if(this.item && this.item.postText){
      this.setState({ paramValue: this.item.postText })
    }
    if(this.item && this.item.postMedia){
      this.setState({ oldPostMedia: this.item.postMedia, postMedia: this.item.postMedia })
    }
    if(this.item && this.item.location){
      this.setState({ paramAddress: this.item.location })
    }

    if(this.item && this.item.status && this.item.status != 'Friends'){
      //console.log("Privacy>>"+ this.item.status);
      let tempOptions = this.state.privacyOptions;
      let arr= [];
      tempOptions.map((option) => {
        if(option.engTitle == this.item.status){
          option.checked = true;
          arr.push(option);
          this.setState({ privacy: option })
        }
        else{
          option.checked = false;
          arr.push(option);
        }
      })
      //console.log("privacyOptions>>"+ JSON.stringify(arr));
      this.setState({ privacyOptions: arr });
    }
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }



  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    //this.props.navigation.navigate('Feed')
    return true;
  };

  onPostDidChange = (post) => {
    this.setState({ post });
  };

  onSetMedia = (photos) => {
    this.setState({ postMedia: [...photos] });
  };

  onSetNewMedia = (photos) => {
    this.setState({ newPostMedia: [...photos] })
  }

  onRemoveOldPhoto = (index) => {
    let old = this.state.oldPostMedia;
    old.splice(index, 1);
    this.setState({ oldPostMedia: old });
    console.log("Old Splice>>"+ JSON.stringify(old));
  }

  onLocationDidChange = (location) => {
    this.setState({ location });
  };

  onPrivacyDidChange = (privacy) => {
      let tempOptions = this.state.privacyOptions;
      let arr= [];
      tempOptions.map((option) => {
        if(option.engTitle == privacy){
          option.checked = true;
          arr.push(option);
          this.setState({ privacy: option });
        }
        else{
          option.checked = false;
          arr.push(option);
        }
      })
      //console.log("privacyOptions>>"+ JSON.stringify(arr));
      this.setState({ privacyOptions: arr });
  };

  onPost = async () => {
    const self = this;

    const isEmptyPost = self.state.post.postText.trim() === '';

    if (self.state.postMedia.length === 0 && isEmptyPost) {
      Alert.alert(
        IMLocalized('Post not completed'),
        IMLocalized(
          "you may not upload an empty post",
        ),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
      return;
    }
    self.setState({ loading: true });
    self.props.navigation.setParams({
      isPosting: true,
    });
    if(this.state.newPost){
      self.addNewPost();
    }
    else{
      self.editPost();
    }  
  };

  editPost = async () => {
    
    const self = this;
    
    self.setState(
      {
        isPosting: true,
        post: {
          id: this.item.id,
          postText: self.state.post.postText,
          location: self.state.location,
          postMedia: self.state.postMedia,
          status: self.state.privacy.engTitle
        },
      },
      async () => {
        if (
            self.state.post &&
            self.state.newPostMedia &&
            self.state.newPostMedia.length === 0
        ) {
          self.editPostUnsubscribe = await firebasePost.editPost(
            self.state.post,
            self.onEditPostSuccess,
          );
          //self.props.setNewPostStatus(res.id);

        } else {
          //postMedia has data, but if post edit and newPostMedia is empty,
          self.startPostUpload();
        }
      },
    ); 
  }

  
  onEditPostSuccess = (editedPost) => {
    this.props.editNewFeeds(editedPost);
    if(this.props.profileFeeds && this.props.profileFeeds.length >0){
      this.props.editProfileFeeds(editedPost);
      this.props.setEditedProfileStatus('edited');
    }
    this.props.navigation.goBack();
    ToastAndroid.show(IMLocalized('Edit success'), ToastAndroid.SHORT);
  }

  addNewPost = async () => {
    const self = this;
    self.setState(
      {
        isPosting: true,
        post: {
          ...self.state.post,
          authorID: self.props.user.id,
          location: self.state.location,
          postMedia: self.state.postMedia,
          status: self.state.privacy.engTitle
        },
      },
      async () => {
        if (
          self.state.post &&
          self.state.post.postMedia &&
          self.state.post.postMedia.length === 0
        ) {
          // const res = await firebasePost.addPost(
          //   self.state.post,
          //   self.props.user.id,
          // );

          self.createPostUnsubscribe = firebasePost.addPost(
            self.state.post,
            self.onCreatePostSuccess,
          );

          //self.props.setNewPostStatus(res.id);

        } else {
          //postMedia has data, but if post edit and newPostMedia is empty,
          self.startPostUpload();
        }
      },
    ); 
  }

  onCreatePostSuccess = (finalPost) => {
    if(finalPost){
      finalPost.newCreatedAt = moment().format('hh:mm A');
      let fullPost = { ...finalPost, author: { ...this.props.user } };
      console.log("FinalPost>>" + JSON.stringify(fullPost));

      this.props.insertNewFeeds(fullPost);
      if(this.fromProfile || (this.props.profileFeeds && this.props.profileFeeds.length >0)){
          if(this.props.profileFeeds && this.props.profileFeeds.length >0){
            this.props.insertProfileFeeds(fullPost);
          }
          else{
            this.props.setProfileFeeds([fullPost]);
          }
          this.props.setEditedProfileStatus('edited');
      }
      this.props.navigation.goBack();
      ToastAndroid.show(IMLocalized('Upload success'), ToastAndroid.SHORT);
    }
    else{
      ToastAndroid.show('Failed', ToastAndroid.SHORT);
      this.props.navigation.goBack();
    }
  }

  startPostUpload = async () => {
    const self = this;
    const uploadPromises = [];
    const mediaSources = [];
    const options = {
      width: 720,
      height: 1280,
      bitrateMultiplier: 3,
      minimumBitrate: 300000,
      //removeAudio: true, // default is false
    };

    let tempPostMedia = [];
    if(this.state.newPost){
      tempPostMedia = this.state.post.postMedia;
    }
    else{
      tempPostMedia = this.state.newPostMedia;
    }

    tempPostMedia.forEach((media) => {
      const { uploadUri, mime } = media;
      console.log('uploaduri>>' + uploadUri + "  " + mime);
      uploadPromises.push(
        new Promise((resolve, reject) => {

          if(mime.includes('video')){
            ProcessingManager.compress(uploadUri, options) // like VideoPlayer compress options
            .then((data) => {
              console.log("Compressed VIdeo>>"+ data.source)
              firebaseStorage.uploadImage(data.source).then((response) => {
                if (!response.error) {
                  console.log("response>>" + JSON.stringify(response))
                  mediaSources.push({ url: response.downloadURL, mime });
                } else {
                  alert(
                    IMLocalized(
                      'Oops! An error occured while uploading your post. Please try again.',
                    ),
                  );
                }
                resolve();
              });
            });
          }
          else{
            firebaseStorage.uploadImage(uploadUri).then((response) => {
              if (!response.error) {
                console.log("response>>" + JSON.stringify(response))
                mediaSources.push({ url: response.downloadURL, mime });
              } else {
                alert(
                  IMLocalized(
                    'Oops! An error occured while uploading your post. Please try again.',
                  ),
                );
              }
              resolve();
            });
          }
        }),
      );
    });

    Promise.all(uploadPromises).then(async () => {
      let postToUpload;
      if(this.state.newPost){
        postToUpload = { ...self.state.post, postMedia: [...mediaSources], status: self.state.privacy.engTitle };
        this.createPostUnsubscribe = await firebasePost.addPost(
          postToUpload,
          this.onCreatePostSuccess,
        );
      }
      else{
        postToUpload = { ...self.state.post, postMedia: [...this.state.oldPostMedia, ...mediaSources], status: self.state.privacy.engTitle };
        this.editPostUnsubscribe = await firebasePost.editPost(
          postToUpload,
          self.onEditPostSuccess,
        );
      }
    });
  }

  blurInput = () => {
    this.inputRef.current.blur();
  };

  render() {
    return (
      <CreatePost
        inputRef={this.inputRef}
        loading={this.state.loading}
        user={this.props.user}
        onPostDidChange={this.onPostDidChange}
        onSetMedia={this.onSetMedia}
        onSetNewMedia={this.onSetNewMedia}
        onRemoveOldPhoto={this.onRemoveOldPhoto}
        onLocationDidChange={this.onLocationDidChange}
        onPrivacyDidChange={this.onPrivacyDidChange}
        blurInput={this.blurInput}
        onPost={() => this.onPost()}
        privacyOptions={this.state.privacyOptions}
        privacy={this.state.privacy}
        paramAddress={this.state.paramAddress}
        newPost={this.state.newPost}
        oldPostMedia={this.state.oldPostMedia}
        paramValue={this.state.paramValue}
      />
    );
  }
}

CreatePostScreen.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    mainFeedPosts: feed.mainFeedPosts,
    profileFeeds: feed.profileFeeds,
    user: auth.user,
    friends: friends.friends,
    friendships: friends.friendships,
  };
};

export default connect(mapStateToProps, { setEditedProfileStatus, setProfileFeeds, setNewPostStatus, insertProfileFeeds, insertNewFeeds, editProfileFeeds, editNewFeeds })(CreatePostScreen);
