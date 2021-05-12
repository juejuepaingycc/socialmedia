import React, { useRef, useState, useEffect, memo } from 'react';
import { View, TouchableOpacity, Platform, Text, NativeModules, ActivityIndicator } from 'react-native';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import { Video } from 'expo-av';
import { TNTouchableIcon } from '../../Core/truly-native';
import { loadCachedItem } from '../../Core/helpers/cacheManager';
import AppStyles from '../../AppStyles';
import Icon from 'react-native-vector-icons/MaterialIcons'
import dynamicStyles2 from './styles';

const Image = createImageProgress(FastImage);

const { VideoPlayerManager } = NativeModules;
const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 20 };
const dynamicStyles = dynamicStyles2('light');

export default function ProfileVideoMedia({
  media,
  index,
  item,
  onMediaPress,
  willBlur,
  mediaCellcontainerStyle,
  mediaContainerStyle,
  videoResizeMode,
}) {
  const [videoLoading, setVideoLoading] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [cachedVideo, setCachedVideo] = useState(null);
  const videoRef = useRef();
  const isValidUrl = media.url && media.url.startsWith('http');
  const isValidLegacyUrl = !media.url && media.startsWith('http');
  const uri = isValidUrl || isValidLegacyUrl ? media.url || media : '';
  const [videoError, setVideoError] = useState(false);
  const [onPause, setOnPause] = useState(true)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(isVideoMuted);
    }
  }, [isVideoMuted]);

  useEffect(() => {
    const loadImage = async () => {
        const video = await loadCachedItem({ uri });
        setCachedVideo(video)
        console.log("Cache>>"+ JSON.stringify(video))
    };

    loadImage();
  }, []);

  useEffect(() => {
    (async () => {
      await videoRef.current.setPositionAsync(0);
      await videoRef.current.playAsync(true);
    });
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (videoRef.current) {
  //       const videoStatus = await videoRef.current.getStatusAsync();
  //       if (videoStatus.isPlaying) {
  //         videoRef.current.pauseAsync(true);
  //       }
  //     }
  //   })();
  // }, []);

  const onVideoLoadStart = () => {
    setVideoLoading(true);
  };

  const onVideoLoad = (payload) => {
    setVideoLoading(false);
  };

  const onSoundPress = () => {
    setIsVideoMuted((prevIsVideoMuted) => !prevIsVideoMuted);
  };

  const onVideoMediaPress = async (url) => {
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
  };

  const onVideoFullView = (url) => {
    if (Platform.OS === 'android') {
      VideoPlayerManager.showVideoPlayer(url);
    }
  }

  const onVideoError = async () => {
    console.log("Error Videoooooooo")
    setVideoError(true);
  }

    return (
      <TouchableOpacity
            activeOpacity={0.9}
            style={[{ flex: 1, marginVertical:7 }, dynamicStyles.centerItem]}>
            <Video
              ref={videoRef}
              source={{ uri: cachedVideo }}
              onLoad={onVideoLoad}
              onLoadStart={onVideoLoadStart}
              style={[
                //dynamicStyles.bodyImage,
                {
                  display: 'flex',
                  width: '100%',
                  height: '100%'
                },
              ]}
              resizeMode={Video.RESIZE_MODE_COVER}
              usePoster={true}
              isLooping={false}
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
