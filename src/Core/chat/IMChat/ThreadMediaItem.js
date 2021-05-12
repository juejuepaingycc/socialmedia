import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Video } from 'expo-av';
import CircleSnail from 'react-native-progress/CircleSnail';
import AudioMediaThreadItem from './AudioMediaThreadItem';
import { loadCachedItem } from '../../helpers/cacheManager';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';

const Image = createImageProgress(FastImage);

const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 50 };

export default function ThreadMediaItem({
  dynamicStyles,
  appStyles,
  videoRef,
  item,
  outBound,
  updateItemImagePath,
  inBound,
  time,
  date,
  own
}) {
  const isValidUrl = item.url.url && item.url.url.startsWith('http');
  const isValidLegacyUrl = !item.url.url && item.url.startsWith('http');
  const uri = isValidUrl || isValidLegacyUrl ? item.url.url || item.url : '';
  
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [cachedImage, setCachedImage] = useState(uri);
  const [cachedVideo, setCachedVideo] = useState(null);

  const isImage =
    item.url && item.url.mime && item.url.mime.startsWith('image');
  const isAudio =
    item.url && item.url.mime && item.url.mime.startsWith('audio');
  const isVideo =
    item.url && item.url.mime && item.url.mime.startsWith('video');
  const noTypeStated = item.url && !item.url.mime;
  useEffect(() => {
    if (!videoLoading) {
      setVideoPaused(true);
    }
  }, [videoLoading]);

  useEffect(() => {
    const loadImage = async () => {
      if (noTypeStated && (isValidUrl || isValidLegacyUrl)) {
        const image = await loadCachedItem({ uri });
        setCachedImage(image);
        updateItemImagePath(image);
      }

      if (isImage && (isValidUrl || isValidLegacyUrl)) {
        const image = await loadCachedItem({ uri });
        setCachedImage(image);
        updateItemImagePath(image);
      }
      if (isVideo && (isValidUrl || isValidLegacyUrl)) {
        const video = await loadCachedItem({ uri });
        setCachedVideo(video);
      }
    };

    loadImage();
  }, []);

  const onVideoLoadStart = () => {
    setVideoLoading(true);
  };

  const onVideoLoad = (payload) => {
    setVideoLoading(false);
  };

  if (isImage) {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ borderRadius: 10 }}>
          <Image source={{ uri: cachedImage }} style={dynamicStyles.mediaMessage} /> 
        </View>
        <View style={dynamicStyles.imgdateView}>
        {
            inBound?
            <Text style={dynamicStyles.otherImgDate}>{date}</Text>
            :
            <Text style={dynamicStyles.myImgDate}>{date}</Text>
          }
          {
            inBound?
            <Text style={dynamicStyles.otherImgTime}>{time}</Text>
            :
            <Text style={dynamicStyles.myImgTime}>{time}</Text>
          }
          
      </View>
      </View>
    );
  } else if (isAudio) {
    return (
      <View style={{ borderRadius: 10 }}>
        <AudioMediaThreadItem
          outBound={outBound}
          item={item.url}
          appStyles={appStyles}
          time={time}
          date={date}
          own={own}
        />
      </View>
    );
  } else if (isVideo) {
    return (
      <View style={{ backgroundColor: 'white' }}>
        {videoLoading && (
          <View style={[dynamicStyles.mediaMessage, dynamicStyles.centerItem]}>
            <CircleSnail {...circleSnailProps} />
          </View>
        )}
        <Video
          ref={videoRef}
          source={{
            uri: cachedVideo,
          }}
          shouldPlay={false}
          onLoad={onVideoLoad}
          onLoadStart={onVideoLoadStart}
          resizeMode={'cover'}
          style={[
            dynamicStyles.mediaMessage,
            { display: videoLoading ? 'none' : 'flex' },
          ]}
        />
        {!videoLoading && (
          <Image
            source={appStyles.iconSet.playButton}
            style={dynamicStyles.playButton}
            resizeMode={'contain'}
          />
        )}
        <View style={dynamicStyles.imgdateView}>
        {
            inBound?
            <Text style={dynamicStyles.otherImgDate}>{date}</Text>
            :
            <Text style={dynamicStyles.myImgDate}>{date}</Text>
          }
          {
            inBound?
            <Text style={dynamicStyles.otherImgTime}>{time}</Text>
            :
            <Text style={dynamicStyles.myImgTime}>{time}</Text>
          }      
        </View>
      </View>
    );
  } else {
    // To handle old format of an array of url stings. Before video feature
    return (
      <Image source={{ uri: cachedImage }} style={dynamicStyles.mediaMessage} />
    );
  }
}
