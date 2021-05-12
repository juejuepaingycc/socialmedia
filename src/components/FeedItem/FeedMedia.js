import React, { useRef, useState, useEffect, memo } from 'react';
import { View, TouchableOpacity, Platform, Text, NativeModules, ActivityIndicator } from 'react-native';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import { Video } from 'expo-av';
import { TNTouchableIcon } from '../../Core/truly-native';
import { loadCachedItem } from '../../Core/helpers/cacheManager';
import AppStyles from '../../AppStyles';
// import CircleSnail from 'react-native-progress/CircleSnail';
import { Scales } from '@common';
import RNFetchBlob from 'rn-fetch-blob'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Image = createImageProgress(FastImage);

const { VideoPlayerManager } = NativeModules;
const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 20 };

const FeedMedia = memo(
  ({
    media,
    index,
    item,
    onImagePress,
    dynamicStyles,
    postMediaIndex,
    count,
    inViewPort,
    extra,
    willBlur,
  }) => {
    if (!item.postMedia || !item.postMedia.length) {
      alert('There is no post media to display. You must fix this error.');
      return null;
    }

    const isValidUrl = media.url && media.url.startsWith('http');
    const isValidLegacyUrl = !media.url && media.startsWith('http');
    const uri = isValidUrl || isValidLegacyUrl ? media.url || media : '';

    const [videoLoading, setVideoLoading] = useState(true);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [cachedImage, setCachedImage] = useState(uri);
    const [cachedVideo, setCachedVideo] = useState(null);
    const [videoError, setVideoError] = useState(false);
    const [onPause, setOnPause] = useState(true)
    const videoRef = useRef();

    const isImage = media && media.mime && media.mime.startsWith('image');
    const isVideo = media && media.mime && media.mime.startsWith('video');
    const noTypeStated = !media.mime && media;

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.setIsMutedAsync(isVideoMuted);
      }
    }, [isVideoMuted]);

    useEffect(() => {
      const loadImage = async () => {
        if (noTypeStated && (isValidUrl || isValidLegacyUrl)) {
          const image = await loadCachedItem({ uri });
          setCachedImage(image);
        }

        if (isImage && (isValidUrl || isValidLegacyUrl)) {
          const image = await loadCachedItem({ uri });
          setCachedImage(image);
        }
        if (isVideo && (isValidUrl || isValidLegacyUrl)) {
          const video = await loadCachedItem({ uri });
          setCachedVideo(video)
        }
      };

      loadImage();
    }, []);

    useEffect(() => {
      // const handleIsPostMediaIndex = async () => {
      //   if (postMediaIndex === index && inViewPort) {
      //     if (videoRef.current) {
      //       await videoRef.current.setPositionAsync(0);
      //       await videoRef.current.playAsync(true);
      //     }
      //   } else {
      //     if (videoRef.current) {
      //       await videoRef.current.pauseAsync(true);
      //     }
      //   }
      // };

      // handleIsPostMediaIndex();
    }, [postMediaIndex]);

    useEffect(() => {
      // const handleInViewPort = async () => {
      //   const postMedia = item.postMedia;
      //   if (
      //     postMediaIndex < postMedia.length &&
      //     postMedia[postMediaIndex] &&
      //     postMedia[postMediaIndex].mime &&
      //     postMedia[postMediaIndex].mime.startsWith('video')
      //   ) {
      //     if (inViewPort) {
      //       if (videoRef.current) {
      //         await videoRef.current.setPositionAsync(0);
      //         await videoRef.current.playAsync(true);
      //       }
      //     } else {
      //       if (videoRef.current) {
      //         await videoRef.current.pauseAsync(true);
      //       }
      //     }
      //   }
      // };

      // handleInViewPort();
    }, [inViewPort]);

    useEffect(() => {
      const handleVideoStatus = async () => {
        if (videoRef.current) {
          const videoStatus = await videoRef.current.getStatusAsync();
          if (videoStatus.isPlaying) {
            videoRef.current.pauseAsync(true);
          }
        }
      };

      handleVideoStatus();
    }, [willBlur]);

    const onVideoLoadStart = () => {
      setVideoLoading(true);
      setVideoError(true);
    };

    const onVideoLoad = () => {
      setVideoLoading(false);
      setVideoError(false);
    };

    const onVideoError = async () => {
      console.log("Error Videoooooooo")
      setVideoError(true);
      // if (videoRef.current) {
      //   await videoRef.current.loadAsync(cachedVideo)
      // }
    }

    const onSoundPress = () => {
      setIsVideoMuted((prevIsVideoMuted) => !prevIsVideoMuted);
    };

    const onVideoFullView = (url) => {
      if (Platform.OS === 'android') {
        VideoPlayerManager.showVideoPlayer(url);
      }
    }

    const onVideoMediaPress = async (url) => {
      if (Platform.OS === 'android') {
        if(count == 1){
          if (videoRef.current) {
            const videoStatus = await videoRef.current.getStatusAsync();
            if (videoStatus.isPlaying) {
              videoRef.current.pauseAsync(true);
              setOnPause(true)
            }
            else{
              videoRef.current.playAsync(true)
              setOnPause(false)
            }
          }
        }
        else{
          VideoPlayerManager.showVideoPlayer(url);
        } 
      } else {
        if (videoRef.current) {
          videoRef.current.presentFullscreenPlayer();
        }
      }
    };

    const onImageMediaPress = () => {
      const filteredImages = [];
      item.postMedia.forEach((singleMedia) => {
        if (
          singleMedia.mime &&
          singleMedia.mime.startsWith('image') &&
          singleMedia.url
        ) {
          filteredImages.push(singleMedia.url);
        }

        if (singleMedia && !singleMedia.mime) {
          filteredImages.push(singleMedia);
        }
      });

      onImagePress(filteredImages, index);
    };

    if (isImage) {
      if(count == 1){
        return (
          <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}>
            <Image
              source={{ uri: cachedImage }}
              style={[dynamicStyles.bodyImage]}
              indicatorProps={circleSnailProps}
             
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        );
      }

      else if(count == 2){
        return (
          <View style={{ width: '50%' }}>
          <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
          style={{ }}
          >
            <Image
              source={{ uri: cachedImage }}
              style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
              indicatorProps={circleSnailProps}
            />
          </TouchableOpacity>
          </View>
        );
      }

      else if(count == 3){
        if(index == 0){
          return (
            <View style={{ width: '50%' }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
        else if(index == 1){
          return (
            <View style={{ width: '50%', height: '50%' }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
        else if(index == 2){
          return (
            <View style={{ width: '50%', height: '50%', position: 'absolute', right:0, marginTop: 175 }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
      }

      else if(count == 4){
        if(index == 0){
          return (
            <View style={{ width: '50%' }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
        else if(index == 1){
          return (
            <View style={{ width: '50%', height: '34%' }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
        else if(index == 2){
          return (
            <View style={{ width: '50%', height: '34%', position: 'absolute', right:0, marginTop: 114 }}>
              {/* 78 */}
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
        else if(index == 3){
          return (
            <View style={{ width: '50%', height: '34%', position: 'absolute', right:0, marginTop: 230 }}>
              {/* 158 */}
            <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            style={{ }}
            >
              <Image
                source={{ uri: cachedImage }}
                style={[dynamicStyles.bodyImage, { width: '100%', resizeMode: 'cover' }]}
                indicatorProps={circleSnailProps}
              />
            </TouchableOpacity>
            </View>
          );
        }
      }

      else if(count == 5){
        if(index == 0){
          return(
            <View style={{ width: '50%', height: '50%' }}>
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
             // style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={[dynamicStyles.bodyImage, { width: '100%', height: '150%', resizeMode: 'cover' }]}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 1){
          return(
            <View style={{ height: '70%', width: '50%',
            position: 'absolute', right: 0 }}>
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            //  style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '100%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 2){
          return(
            <View style={{ height: '70%', width: '50%',
            marginTop: 114,
            position: 'absolute', right: 0 }}>
              {/* 78 */}
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
             // style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '100%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 3){
          return(
            <View style={{ height: '70%', width: '50%',
            marginTop: 230,
            position: 'absolute', right: 0 }}>
              {/* 158 */}
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
           //   style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '100%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 4){
          return(
            <View style={{ height: '100%', width: '50%',
            marginTop: 170,
            position: 'absolute'}}>
              {/* 118 */}
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
             // style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '110%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
      }

      else if(count > 5){
        if(index == 0){
          return(
            <View style={{ width: '50%', height: '50%' }}>
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
              //style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={[dynamicStyles.bodyImage, { width: '100%', height: '150%', resizeMode: 'cover' }]}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 1){
          return(
            <View style={{ height: '70%', width: '50%',
            position: 'absolute', right: 0 }}>
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
              //style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '100%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 2){
          return(
            <View style={{ height: '70%', width: '50%',
            marginTop: 114,
            position: 'absolute', right: 0 }}>
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
              //style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '100%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 3){
          return(
            <View style={{ height: '70%', width: '50%',
            marginTop: 230,
            position: 'absolute', right: 0 }}>
              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
            //  style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '100%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
        if(index == 4){
          return(
            <View style={{ height: '100%', width: '50%',
            marginTop: 170,
            position: 'absolute'}}>

              
<TouchableOpacity onPress={onImageMediaPress}
style={{
             width: '100%',
             height: '34%',
          position: 'absolute', 
           zIndex: 2,
           backgroundColor: 'rgba(0,0,0,0.6)',
           justifyContent: 'center',
           alignItems: 'center',
           right: '-100%',
           marginTop: 60,
           //marginLeft: '50%'
           //backgroundColor: 'red'
  }}>
                    <Text
                    style={{ fontSize: 23, color: 'white' }}
                    >+{extra}</Text>
                    </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}
              //style={{ backgroundColor: 'blue' }}
              >
                <Image
                  source={{ uri: cachedImage }}
                  style={{ height: '110%',width: '100%',
                  resizeMode: 'cover' }}
                  indicatorProps={circleSnailProps}
                />
              </TouchableOpacity>
            </View>
          )
        }
      }
      
    } else if (isVideo) {
      if(count == 1){
        return (
          <TouchableOpacity
            activeOpacity={0.9}
           // onPress={() => onVideoMediaPress(media.url)}
            style={[{ flex: 1 }, dynamicStyles.centerItem]}>
            <Video
              ref={videoRef}
              source={{ uri: cachedVideo }}
              onLoad={onVideoLoad}
              onLoadStart={onVideoLoadStart}
              style={[
                dynamicStyles.bodyImage,
                { display: videoLoading ? 'none' : 'flex',
                //
                  width: Scales.deviceWidth
              },
              ]}
              resizeMode={Video.RESIZE_MODE_COVER}
               usePoster={true}
              // posterStyle={{
              //   resizeMode: 'cover'
              // }}
              isLooping={true}
              onError={onVideoError}
            />

            {
              !videoError?
              <View style={{
                width: '100%',
                position: 'absolute', 
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
                
              }}>
              <TouchableOpacity
                  onPress={() => onVideoMediaPress(media.url)}
                  style={{marginRight: 20}}>
                  {
                    onPause?
                    <Icon name='play-circle-outline' size={50} color='#babcbf' />
                    :
                    <Icon name='pause-circle-outline' size={50} color='#babcbf' />
                  }
                </TouchableOpacity>
                <TouchableOpacity
              onPress={() => onVideoFullView(media.url)}>
                  <Icon name='launch' size={50} color='#babcbf' />
              </TouchableOpacity>
              </View>
              :
              null}

            {
              videoError?
              <ActivityIndicator style={{ margin: 10 }} size="large" />
              :
              null
            }
              
            <TNTouchableIcon
              onPress={onSoundPress}
              imageStyle={dynamicStyles.soundIcon}
              containerStyle={dynamicStyles.soundIconContainer}
              iconSource={
                isVideoMuted
                  ? AppStyles.iconSet.soundMute
                  : AppStyles.iconSet.sound
              }
              appStyles={AppStyles}
            />
          </TouchableOpacity>
        );
            }

            if(count == 2){
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => onVideoMediaPress(media.url)}
                style={[{ flex: 1}, dynamicStyles.centerItem]}>
                  <Video
                    ref={videoRef}
                    source={{ uri: cachedVideo }}
                    onLoad={onVideoLoad}
                    onLoadStart={onVideoLoadStart}
                    style={[
                      dynamicStyles.bodyImage,
                      { display: videoLoading ? 'none' : 'flex' },
                    ]}
                    shouldPlay={false}
                    resizeMode={Video.RESIZE_MODE_COVER}
                    usePoster={true}
                    posterStyle={{
                      resizeMode: 'cover'
                    }}
                  />
                  <TNTouchableIcon
                    onPress={onSoundPress}
                    imageStyle={dynamicStyles.soundIcon}
                    containerStyle={dynamicStyles.soundIconContainer}
                    iconSource={
                      isVideoMuted
                        ? AppStyles.iconSet.soundMute
                        : AppStyles.iconSet.sound
                    }
                    appStyles={AppStyles}
                  />
                </TouchableOpacity>
              );
                  }

                  if(count == 3){
                    if(index == 0){
                      return (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => onVideoMediaPress(media.url)}
                        style={[{ flex: 1,
                        width: '50%'
                        }, dynamicStyles.centerItem]}>
                          <Video
                            ref={videoRef}
                            source={{ uri: cachedVideo }}
                            onLoad={onVideoLoad}
                            onLoadStart={onVideoLoadStart}
                            style={[
                              dynamicStyles.bodyImage,
                              { display: videoLoading ? 'none' : 'flex'},
                              {  
                                width: '100%'
                              }
                            ]}
                            resizeMode={Video.RESIZE_MODE_COVER}
                            usePoster={true}
                            posterStyle={{
                              resizeMode: 'cover'
                            }}
                          />
                          <TNTouchableIcon
                            onPress={onSoundPress}
                            imageStyle={dynamicStyles.soundIcon}
                            containerStyle={dynamicStyles.soundIconContainer}
                            iconSource={
                              isVideoMuted
                                ? AppStyles.iconSet.soundMute
                                : AppStyles.iconSet.sound
                            }
                            appStyles={AppStyles}
                          />
                        </TouchableOpacity>
                      );
                    }

                    if(index == 1){
                      return (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => onVideoMediaPress(media.url)}
                        style={[{ flex: 1,
                        width: '50%',
                        height: '50%'
                        }, dynamicStyles.centerItem]}>
                          <Video
                            ref={videoRef}
                            source={{ uri: cachedVideo }}
                            onLoad={onVideoLoad}
                            onLoadStart={onVideoLoadStart}
                            style={[
                              dynamicStyles.bodyImage,
                              { display: videoLoading ? 'none' : 'flex'},

                            ]}
                            resizeMode={Video.RESIZE_MODE_COVER}
                            usePoster={true}
                            posterStyle={{
                              resizeMode: 'cover'
                            }}
                          />
                          <TNTouchableIcon
                            onPress={onSoundPress}
                            imageStyle={dynamicStyles.soundIcon}
                            containerStyle={dynamicStyles.soundIconContainer}
                            iconSource={
                              isVideoMuted
                                ? AppStyles.iconSet.soundMute
                                : AppStyles.iconSet.sound
                            }
                            appStyles={AppStyles}
                          />
                        </TouchableOpacity>
                      );
                    }

                    if(index == 2){
                      return (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => onVideoMediaPress(media.url)}
                        style={[{ flex: 1,
                        width: '50%',
                        height: '50%',
                        position: 'absolute',
                        marginTop: 118,
                        right: 0
                        }, dynamicStyles.centerItem]}>
                          <Video
                            ref={videoRef}
                            source={{ uri: cachedVideo }}
                            onLoad={onVideoLoad}
                            onLoadStart={onVideoLoadStart}
                            style={[
                              dynamicStyles.bodyImage,
                              { display: videoLoading ? 'none' : 'flex'},

                            ]}
                            resizeMode={Video.RESIZE_MODE_COVER}
                            usePoster={true}
                            posterStyle={{
                              resizeMode: 'cover'
                            }}
                          />
                          <TNTouchableIcon
                            onPress={onSoundPress}
                            imageStyle={dynamicStyles.soundIcon}
                            containerStyle={dynamicStyles.soundIconContainer}
                            iconSource={
                              isVideoMuted
                                ? AppStyles.iconSet.soundMute
                                : AppStyles.iconSet.sound
                            }
                            appStyles={AppStyles}
                          />
                        </TouchableOpacity>
                      );
                    }
                    
                        }

                        if(count == 4){
                          if(index == 0){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%'
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      width: '100%'
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
      
                          if(index == 1){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '33%'
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
      
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
      
                          if(index == 2){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '34%',
                              position: 'absolute',
                              marginTop: 78,
                              right: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
      
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }

                          if(index == 3){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '34%',
                              position: 'absolute',
                              marginTop: 158,
                              right: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
      
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
                          
                              }

                              if(count == 5){
                                
                          if(index == 0){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%', height: '50%'
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '180%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
      
                          if(index == 1){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '50%'
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
      
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
      
                          if(index == 2){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '50%',
                              position: 'absolute',
                              marginTop: 78,
                              right: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }

                          if(index == 3){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '50%',
                              position: 'absolute',
                              marginTop: 158,
                              right: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
                            else if(index == 4){
        return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '180%',
                              position: 'absolute',
                              marginTop: 118,
                              left: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
      }
                          
                              }

                              if(count > 5){
                             
                                
                          if(index == 0){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%', height: '50%'
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '180%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
      
                          if(index == 1){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '50%'
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
      
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
      
                          if(index == 2){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '50%',
                              position: 'absolute',
                              marginTop: 78,
                              right: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }

                          if(index == 3){
                            return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '50%',
                              position: 'absolute',
                              marginTop: 158,
                              right: 0
                              }, dynamicStyles.centerItem]}>
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
                          }
                            else if(index == 4){
        return (
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => onVideoMediaPress(media.url)}
                              style={[{ flex: 1,
                              width: '50%',
                              height: '180%',
                              position: 'absolute',
                              marginTop: 118,
                              left: 0
                              }, dynamicStyles.centerItem]}>

                                              
<TouchableOpacity onPress={onImageMediaPress}
style={{
             width: '100%',
             height: '76%',
          position: 'absolute', 
           zIndex: 2,
           backgroundColor: 'rgba(0,0,0,0.6)',
           justifyContent: 'center',
           alignItems: 'center',
           right: '-100%',
           marginTop: 30,
           //marginLeft: '50%'
           //backgroundColor: 'red'
  }}>
                    <Text
                    style={{ fontSize: 23, color: 'white' }}
                    >+{extra}</Text>
                    </TouchableOpacity>
                    
                                <Video
                                  ref={videoRef}
                                  source={{ uri: cachedVideo }}
                                  onLoad={onVideoLoad}
                                  onLoadStart={onVideoLoadStart}
                                  style={[
                                    dynamicStyles.bodyImage,
                                    { display: videoLoading ? 'none' : 'flex'},
                                    {  
                                      height: '100%',width: '100%',
                                    }
                                  ]}
                                  resizeMode={Video.RESIZE_MODE_COVER}
                                  usePoster={true}
                                  posterStyle={{
                                    resizeMode: 'cover'
                                  }}
                                />
                                <TNTouchableIcon
                                  onPress={onSoundPress}
                                  imageStyle={dynamicStyles.soundIcon}
                                  containerStyle={dynamicStyles.soundIconContainer}
                                  iconSource={
                                    isVideoMuted
                                      ? AppStyles.iconSet.soundMute
                                      : AppStyles.iconSet.sound
                                  }
                                  appStyles={AppStyles}
                                />
                              </TouchableOpacity>
                            );
      }
                          
                              }
    } else {
      // To handle old format of an array of url stings. Before video feature
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={onImageMediaPress}>
          <Image
            source={{ uri: cachedImage }}
            style={dynamicStyles.bodyImage}
            // indicator={CircleSnail}
            indicatorProps={circleSnailProps}
          />
        </TouchableOpacity>
      );
    }
  },
);

export default FeedMedia;
