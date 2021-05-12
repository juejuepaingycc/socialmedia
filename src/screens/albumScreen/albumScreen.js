import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform, View, NativeModules, Text, Image, FlatList, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TNMediaViewerModal from '../../Core/truly-native/TNMediaViewerModal';
import styles from './albumScreen.styles';
import ProfileVideoMedia from '../../components/FeedItem/ProfileVideoMedia';
import { TNActivityIndicator } from '../../Core/truly-native'

const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 20 };
const videoRef = React.createRef();
const { VideoPlayerManager } = NativeModules;

class AlbumScreen extends Component {

  static navigationOptions = ({ screenProps, navigation }) => {
    let currentTheme = AppStyles.navThemeConstants['light'];
    return {
      headerTitle:  navigation.getParam('title'),
      headerTitleStyle: {
        fontFamily: AppStyles.customFonts.klavikaMedium
      },
      headerLeft: Platform.OS === 'android' && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      firstAlbum: [],
      secondAlbum: [],
      album: [],
      isMediaViewerOpen: false,
      selectedMediaIndex: 0,
      loading: true,
      type: ''
    }
    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    });
  }

  componentDidMount(){
    let posts = this.props.navigation.getParam('currentUserPosts');
    this.type = this.props.navigation.getParam('type');
    this.setState({ type: this.type })
    this.separateAlbum(posts)
    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    })
  }

  separateAlbum = (posts) => {
    let album = [];
    let index = 0;
    let images = [];
    if(posts && posts.length > 0){
      posts.forEach((post) => {
        post.postMedia.forEach((media) => {
          let isImage = media && media.mime && media.mime.startsWith('image');
          if(this.type == 'Photo' && isImage){
            media['index'] = index;
            index++;
            album.push(media);
            images.push(media.url)
          }
          else if(this.type == 'Video' && !isImage){
            media['index'] = index;
            index++;
            album.push(media);
            images.push(media.url)
          }
        })
      })
      setTimeout(()=> {
        this.setState({ album: images })
        console.log("Album>>" + JSON.stringify(album))
        if(album.length > 3 && this.state.type == 'Photo'){
          let first = album.slice(0,3);
          let second = album.slice(3,album.length);
          this.setState({ firstAlbum: first, secondAlbum: second, loading: false })
        }
        else{
          console.log("firstAlbum>>"+ JSON.stringify(album))
          this.setState({ firstAlbum: album, loading: false })
        }
      }, 500)
    }
    else{
      this.setState({ loading: false })
    }
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onImageMediaPress = ( item ) => {
    this.props.navigation.navigate('ProfileMediaSwiper',{
      feedItems: [item]
    })
    //this.setState({ isMediaViewerOpen: true, selectedMediaIndex: index })
  }

  onSoundPress = async (url) => {
    let temp = this.state.firstAlbum;
    let index = 0;
    this.state.firstAlbum.forEach((media) => {
      if(media.url == url && media.isVideoMuted){
          temp[index]['isVideoMuted'] = false;
      }
      else if(media.url == url && !media.isVideoMuted){
        temp[index]['isVideoMuted'] = true;
    }
    })
    this.setState({ firstAlbum: temp });
    console.log("onSoundPress>>"+ JSON.stringify(temp));
  };

  onVideoMediaPress = async (url) => {
    if (Platform.OS === 'android') {
        if (videoRef.current) {
          const videoStatus = await videoRef.current.getStatusAsync();
          if (videoStatus.isPlaying) {
            videoRef.current.pauseAsync(true);
            let temp = this.state.firstAlbum;
            let index = 0;
            this.state.firstAlbum.forEach((media) => {
              if(media.url == url){
                temp[index]['onPause'] = true;
              }
              else{
                temp[index]['onPause'] = false;
              }
            })
            this.setState({ firstAlbum: temp });
          }
          else{
            videoRef.current.playAsync(true)
            let temp = this.state.firstAlbum;
            let index = 0;
            this.state.firstAlbum.forEach((media) => {
              if(media.url == url){
                temp[index]['onPause'] = false;
              }
            })
            this.setState({ firstAlbum: temp });
          }
        }
    } else {
      if (videoRef.current) {
        videoRef.current.presentFullscreenPlayer();
      }
    }
  };

  onVideoFullView = (url) => {
    if (Platform.OS === 'android') {
      VideoPlayerManager.showVideoPlayer(url);
    }
  }

  render(){
    return(
      <ScrollView style={{}}>
      {
      this.state.loading?
        <TNActivityIndicator appStyles={AppStyles} />
      :
        <View>
          {
            this.state.firstAlbum.length > 0 && this.state.type == 'Photo' && (
            <View>
            <View style={styles.firstView}>
                    <TouchableOpacity style={styles.firstBlog} onPress={() => this.onImageMediaPress(this.state.firstAlbum[0].url)}>
                        <Image
                          source={{ uri: this.state.firstAlbum[0].url }}
                          style={styles.firstImage}
                          indicatorProps={circleSnailProps}
                        />
                    </TouchableOpacity>
                    <View style={styles.blog2}>
                      {
                        this.state.firstAlbum.length > 1?
                          <TouchableOpacity onPress={() => this.onImageMediaPress(this.state.firstAlbum[1].url)} style={styles.secondBlog}>
                            <Image
                              source={{ uri: this.state.firstAlbum[1].url }}
                              style={styles.firstImage}
                              indicatorProps={circleSnailProps}
                            />
                          </TouchableOpacity>
                        :
                        null
                      }
                      {
                        this.state.firstAlbum.length > 2?
                          <TouchableOpacity onPress={() => this.onImageMediaPress(this.state.firstAlbum[2].url)} style={styles.thirdBlog}>
                            <Image
                              source={{ uri: this.state.firstAlbum[2].url }}
                              style={styles.firstImage}
                              indicatorProps={circleSnailProps}
                            />
                          </TouchableOpacity>
                        :
                        null
                      }
                    </View>
                    
          </View>
          

          {
            this.state.secondAlbum.length > 0 && (
                      <FlatList
                      numColumns={3}
                      data={this.state.secondAlbum}
                      renderItem={({ item, index }) => (
                        
                          <TouchableOpacity style={styles.blog} onPress={() => this.onImageMediaPress(item.url)}>
                            <Image
                              source={{ uri: item.url }}
                              style={styles.image}
                              indicatorProps={circleSnailProps}
                            />
                        </TouchableOpacity>
                        )}
                      keyExtractor={item => item.id}
                      />
              
            )
          }
          </View>
    )
          }

          {
            this.state.firstAlbum.length == 0 && (
               <Text style={{ fontSize: 30,
              fontWeight: 'bold',
              alignSelf: 'center',
              color: 'black',
              marginBottom: 15, marginTop: 200 }}>{IMLocalized('No Result Found')}</Text>
            )
          }

          {
            this.state.firstAlbum.length > 0 && this.state.type == 'Video' && (
              <FlatList
                      data={this.state.firstAlbum}
                      renderItem={({ item, index }) => (
                        <View style={{ 
                          height: 350
                          }}>
                          <ProfileVideoMedia
                            key={index + 'feedMedia'}
                            inViewPort={true}
                            index={index}
                            media={item}
                            dynamicStyles={styles}
                          />
                        </View>
                        )}
                      keyExtractor={item => item.id}
                      />
            )
          }

       </View>

  }

          <TNMediaViewerModal
          mediaItems={this.state.album}
          isModalOpen={this.state.isMediaViewerOpen}
          onClosed={()=> this.setState({ isMediaViewerOpen: false })}
          selectedMediaIndex={this.state.selectedMediaIndex}
        />
        </ScrollView>
      )
    
   
  }

}

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    currentUserFeedPosts: feed.currentUserFeedPosts,
    user: auth.user,
    users: auth.users,
    friends: friends.friends,
    friendships: friends.friendships,
  };
};

export default connect(mapStateToProps)(AlbumScreen);