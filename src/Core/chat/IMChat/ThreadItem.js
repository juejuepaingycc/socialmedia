import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
} from 'react-native';
import ThreadMediaItem from './ThreadMediaItem';
import IconFeather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { loadCachedItem } from '../../helpers/cacheManager';
import { IMLocalized } from '../../localization/IMLocalization';
import FastImage from 'react-native-fast-image';
import { chatTimeFormat } from '../../../Core';
import { TNTouchableIcon } from '../../../Core/truly-native';

const { VideoPlayerManager } = NativeModules;

const assets = {
  boederImgSend: require('../assets/borderImg1.png'),
  boederImgReceive: require('../assets/borderImg2.png'),
  textBoederImgSend: require('../assets/textBorderImg1.png'),
  textBoederImgReceive: require('../assets/textBorderImg2.png'),
  reply: require('../assets/reply-icon.png'),
};

function ThreadItem(props) {
  const {
    item,
    index,
    len,
    user,
    onChatMediaPress,
    onSenderProfilePicturePress,
    onMessageLongPress,
    appStyles,
    onViewPDF,
    showOtherReaction,
    onReactionPress,
    onReactionList,
    goDetailPost
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const [senderProfilePictureURL, setSenderProfilePictureURL] = useState(
    item.senderProfilePictureURL,
  );
  const [name, setName] = useState(item.senderFirstName);
  const videoRef = useRef(null);
  const imagePath = useRef();

  const updateItemImagePath = (path) => {
    imagePath.current = path;
  };
  const reactionIcons = ['like', 'love', 'laugh', 'surprised', 'cry', 'angry'];
  const isAudio =
    item.url && item.url.mime && item.url.mime.startsWith('audio');
  const isVideo =
    item.url && item.url.mime && item.url.mime.startsWith('video');
  const outBound = item.senderID === user.userID;
  const inBound = item.senderID !== user.userID;

  useEffect(() => {
    const loadImage = async () => {
      const image = await loadCachedItem({ uri: item.senderProfilePictureURL });
      setSenderProfilePictureURL(image);
    };

    loadImage();
  }, []);

  const didPressMediaChat = () => {
    if (isAudio) {
      return;
    }

    const newLegacyItemURl = imagePath.current;
    const newItemURl = { ...item.url, url: imagePath.current };
    let ItemUrlToUse;

    if (!item.url.url) {
      ItemUrlToUse = newLegacyItemURl;
    } else {
      ItemUrlToUse = newItemURl;
    }

    if (isVideo) {
      if (Platform.OS === 'android') {
        VideoPlayerManager.showVideoPlayer(item.url.url);
      } else {
        if (videoRef.current) {
          videoRef.current.presentFullscreenPlayer();
        }
      }
    } else {
      onChatMediaPress({ ...item, senderProfilePictureURL, url: ItemUrlToUse });
    }
  };

  const renderTextBoederImg = () => {
    if (item.senderID === user.userID) {
      return (
        <Image
          source={assets.textBoederImgSend}
          style={styles.textBoederImgSend}
        />
      );
    }

    if (item.senderID !== user.userID) {
      return (
        <Image
          source={assets.textBoederImgReceive}
          style={styles.textBoederImgReceive}
        />
      );
    }
  };

  const renderBoederImg = () => {
    if (isAudio) {
      return renderTextBoederImg();
    }
    if (item.senderID === user.userID) {
      return (
        <Image source={assets.boederImgSend} style={styles.boederImgSend} />
      );
    }

    if (item.senderID !== user.userID) {
      return (
        <Image
          source={assets.boederImgReceive}
          style={styles.boederImgReceive}
        />
      );
    }
  };

  const renderInReplyToIfNeeded = (item, isMine) => {
    const inReplyToItem = item.inReplyToItem;
    if (
      inReplyToItem &&
      inReplyToItem.content &&
      inReplyToItem.content.length > 0
    ) {
      return (
        <View
          style={
            isMine
              ? styles.inReplyToItemContainerView
              : styles.inReplyToTheirItemContainerView
          }>
          <View style={styles.inReplyToItemHeaderView}>
            <Image style={styles.inReplyToIcon} source={assets.reply} />
            <Text style={styles.inReplyToHeaderText}>
              {isMine
                ? IMLocalized('You replied to ') +
                  (inReplyToItem.senderFirstName ||
                    inReplyToItem.senderLastName)
                : (item.senderFirstName || item.senderLastName) +
                  IMLocalized(' replied to ') +
                  (inReplyToItem.senderFirstName ||
                    inReplyToItem.senderLastName)}
            </Text>
          </View>
          <View style={styles.inReplyToItemBubbleView}>
            <Text style={styles.inReplyToItemBubbleText}>
              {item.inReplyToItem.content.slice(0, 50)}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderTouchableIcon = (src, tappedIcon, index) => {
    return (
      <TNTouchableIcon
        key={index + 'icon'}
        containerStyle={styles.reactionIconContainer}
        iconSource={src}
        imageStyle={styles.reactionIcon}
        onPress={() => onReactionPress(tappedIcon, item.id)}
        appStyles={appStyles}
      />
    );
  };


  const handleOnPress = () => {};

  const handleOnLongPress = () => {
   // if (!isAudio && !isVideo && !item.url) {
      onMessageLongPress && onMessageLongPress(item);
   // }
  };

  const handleOnPressOut = () => {};

  return (
    <TouchableWithoutFeedback
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      onPressOut={handleOnPressOut}>
      <View 
      style={
        index == len-1 && (
       { marginTop: 20 }
       )
      }
      >
        {/* my thread item */}
        {outBound && (
          <View style={styles.sendItemContainer}>

            {item.gaveReaction != null && ( 
              <TouchableOpacity onPress={() => onReactionList(item)} style={styles.reactionImgContainer}>
                <Image source={item.iconSource} style={styles.reactionImg} />
                <Text style={styles.reactionCount}>
                  {
                    item.reactions.length
                  }
                </Text>
              </TouchableOpacity>
            )} 

            {item.gaveReaction == null && item.reactions && item.reactions.length > 0 && (  
              <TouchableOpacity onPress={() => onReactionList(item)} style={styles.reactionImgContainer}>
                {
                  item.reactions[0].reaction == 'like' && (
                    <Image source={require('../../../../assets/icons/blue-like.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'love' && (
                    <Image source={require('../../../../assets/icons/red-heart.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'angry' && (
                    <Image source={require('../../../../assets/icons/anger.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'surprised' && (
                    <Image source={require('../../../../assets/icons/wow.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'laugh' && (
                    <Image source={require('../../../../assets/icons/crylaugh.png')} style={styles.unfilledImg} />
                )}
                {
                  item.reactions[0].reaction == 'cry' && (
                    <Image source={require('../../../../assets/icons/crying.png')} style={styles.unfilledImg} />
                )}
                
                <Text style={styles.reactionCount}>
                  {
                    item.reactions.length
                  }
                </Text>
              </TouchableOpacity>
             )}  

            {
              item.shareStatus && (
              <TouchableOpacity style={styles.shareView} onPress={() => goDetailPost(item.sharePostInfo)}>
                  <Text style={styles.shareName}>{item.shareName}</Text>
                  {
                    (item.url.profile != '' && item.url.profile != null && item.url.profile != undefined) ?
                    <Image source={{ uri: item.url.profile }} style={styles.shareImage} />
                    :
                    <Image source={{ uri: item.url.url }} style={styles.shareImage} />
                  }
                  {
                    (item.content != '' && item.content != null && item.content != undefined) ?
                      <Text style={styles.shareContent}>{item.content}</Text>
                      :
                      <Text style={styles.sharefromContent}>{IMLocalized('Share from post')}</Text>
                  }
                  </TouchableOpacity>
              )
            }

            {/* Image or Video or Audio */}
            {!item.shareStatus && item.url != null && item.url != '' && !item.url.mime.includes('application') && (
              <TouchableOpacity
                onPress={didPressMediaChat}
                onLongPress={handleOnLongPress}
                activeOpacity={0.9}
                style={styles.sendImgContent}>
                <ThreadMediaItem
                  outBound={true}
                  updateItemImagePath={updateItemImagePath}
                  videoRef={videoRef}
                  dynamicStyles={styles}
                  appStyles={appStyles}
                  item={item}
                  time={chatTimeFormat(item.created).time}
                  date={chatTimeFormat(item.created).date}
                  own={true}
                />
                {/* {renderBoederImg()} */}
              </TouchableOpacity>
            )}

            {/* Document */}
            {!item.shareStatus && item.url != null && item.url != '' && item.url.mime.includes('application') && (
              <TouchableOpacity style={styles.myMessageBubbleContainerView} onPress={() => onViewPDF(item)}>
                {renderInReplyToIfNeeded(item, true)}
                <View style={[styles.itemContent, styles.sendItemContent]}>
                  <Text style={styles.sendTextMessage2}>{item.content}</Text>
                  <View style={styles.dateView}>
                        <Text style={styles.myDate}>{chatTimeFormat(item.created).date}&nbsp;&nbsp;</Text>
                        <Text style={styles.myTime}>{chatTimeFormat(item.created).time}</Text>
                  </View>
                  {/* {renderTextBoederImg()} */}
                </View>
              </TouchableOpacity>
            )}

            {/* Own Text */}
            {!item.shareStatus && !item.url && (
              <View style={styles.myMessageBubbleContainerView}>
                {renderInReplyToIfNeeded(item, true)}
                <View style={[styles.itemContent, styles.sendItemContent]}>
                  <View>
                    {
                      item.content == 'Missed call' && (
                      <View style={styles.durationView}>
                        <Icon name='phone-missed' size={14} color='#b7c3c9' />
                        <Text style={[styles.missedCallMessage, { paddingLeft: 6, color: 'white' }]}>
                        {IMLocalized('Missed Call')}
                        </Text>
                      </View>
                    )}
                    {
                      item.content == 'Call ended' && (
                      <>
                        <Text style={[styles.missedCallMessage, { color: 'white' }]}>
                          {IMLocalized('Call Ended')}
                        </Text>
                        <View style={[styles.durationView, { paddingVertical: 6 }]}>
                          <IconFeather name='phone-outgoing' size={14} color='#b7c3c9' />
                          <Text style={styles.duration}>{item.duration}</Text>
                        </View>
                      </>
                    )}
                    {
                      item.content != 'Missed call' && item.content != 'Call ended' && !item.shareStatus && (
                        <Text style={styles.sendTextMessage}>{item.content}</Text>
                    )}             
                    <View style={styles.dateView}>
                        {/* {
                          item.edited && (
                          <Text style={styles.myDate}>Edited&nbsp;&nbsp;</Text>
                        )} */}
                        <Text style={styles.myDate}>{chatTimeFormat(item.created).date}&nbsp;&nbsp;&nbsp;</Text>
                        <Text style={styles.myTime}>{chatTimeFormat(item.created).time}</Text>
                      </View>

                    {/* <Text style={styles.myTime}>{chatTimeFormat(item.created).time}</Text> */}
                  </View>
                  {/* {renderTextBoederImg()} */}
                </View>
              </View>
            )}
            {showOtherReaction && ( 
              <View style={styles.reactionContainer}>
                {reactionIcons.map((icon, index) =>
                    renderTouchableIcon(appStyles.iconSet[icon], icon, index)
                )} 
              </View>
            )}
            <TouchableOpacity
              // onPress={() =>
              //   onSenderProfilePicturePress && onSenderProfilePicturePress(item)
              // }
              >
              <FastImage
                style={styles.userIcon}
                source={{ uri: senderProfilePictureURL }}
              />
            </TouchableOpacity>

        </View>
        )}

        {/* other thread item */}
        {inBound && (
          <View style={styles.receiveItemContainer}>

            <TouchableOpacity
              onPress={() =>
                onSenderProfilePicturePress && onSenderProfilePicturePress(item.senderID)
              }>
              <FastImage
                style={styles.userIcon}
                source={{ uri: senderProfilePictureURL }}
              />
            </TouchableOpacity>

            <View>

            <Text style={styles.postUser}>{name}</Text>

            {
              item.shareStatus && (
                <TouchableOpacity style={styles.othershareView} onPress={() => goDetailPost(item.sharePostInfo)}>
                  <Text style={styles.othershareName}>{item.shareName}</Text>
                  {
                    (item.url.profile != '' && item.url.profile != null && item.url.profile != undefined) ?
                    <Image source={{ uri: item.url.profile }} style={styles.othershareImage} />
                    :
                    <Image source={{ uri: item.url.url }} style={styles.othershareImage} />
                  }
                  {
                    (item.content != '' && item.content != null && item.content != undefined) ?
                      <Text style={styles.othershareContent}>{item.content}</Text>
                      :
                      <Text style={styles.othersharefromContent}>{IMLocalized('Share from post')}</Text>
                  }
                  </TouchableOpacity>
              )
            }

            {!item.shareStatus && item.url != null && item.url != '' && !item.url.mime.includes('application') && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.receiveImgContent}
                onPress={didPressMediaChat}
                onLongPress={handleOnLongPress}>
                <ThreadMediaItem
                  updateItemImagePath={updateItemImagePath}
                  videoRef={videoRef}
                  dynamicStyles={styles}
                  appStyles={appStyles}
                  item={item}
                  inBound={inBound}
                  time={chatTimeFormat(item.created).time}
                  date={chatTimeFormat(item.created).date}
                  own={false}
                />
                {/* {renderBoederImg()} */}
              </TouchableOpacity>
            )}

             {/* Document */}
             {!item.shareStatus && item.url != null && item.url != '' && item.url.mime.includes('application') && (
              <TouchableOpacity style={styles.theirMessageBubbleContainerView} onPress={() => onViewPDF(item)}>
                {renderInReplyToIfNeeded(item, true)}
                <View style={[styles.itemContent, styles.receiveItemContent]}>
                  <Text style={styles.receiveTextMessage}>{item.content}</Text>
                  <View style={styles.dateView}>
                        <Text style={styles.theirDate}>{chatTimeFormat(item.created).date}&nbsp;&nbsp;</Text>
                        <Text style={styles.theirTime}>{chatTimeFormat(item.created).time}</Text>
                  </View>
                  {/* {renderTextBoederImg()} */}
                </View>
              </TouchableOpacity>
            )}

            {!item.shareStatus && !item.url && (
              <View style={styles.theirMessageBubbleContainerView}>
                {renderInReplyToIfNeeded(item, false)}
                <View style={[styles.itemContent, styles.receiveItemContent]}>
                  <View>
                    {
                      item.content == 'Missed call' && (
                        <View style={[styles.durationView]}>
                          <Icon name='phone-missed' size={14} color='red' />
                          <Text style={[styles.missedCallMessage, { color: 'red', paddingLeft: 6 }]}>
                            {IMLocalized('Missed Call')}
                          </Text>
                        </View>
                     )}
                    {
                      item.content == 'Call ended' && (
                      <>
                        <Text style={styles.missedCallMessage}>
                        {IMLocalized('Call Ended')}
                        </Text>
                        <View style={[styles.durationView, { paddingVertical: 4 }]}>
                          <IconFeather name='phone-incoming' size={14} color='gray' />
                          <Text style={styles.duration}>{item.duration}</Text>
                        </View>
                      </>
                    )}
                    {
                      item.content != 'Missed call' && item.content != 'Call ended' && (
                        <Text style={styles.sendTextMessage3}>{item.content}</Text>
                    )}
 
                      <View style={styles.dateView}>
                        <Text style={styles.theirDate}>{chatTimeFormat(item.created).date}&nbsp;&nbsp;</Text>
                        <Text style={styles.theirTime}>{chatTimeFormat(item.created).time}</Text>
                      </View>

                  </View>
                  {/* {renderTextBoederImg()} */}
                </View>
              </View>
            )}

            {showOtherReaction && ( 
              <View style={[styles.reactionContainer, { left: 5, right: 0 }]}>
                {reactionIcons.map((icon, index) =>
                    renderTouchableIcon(appStyles.iconSet[icon], icon, index)
                )} 
              </View>
            )}

            {item.gaveReaction != null && ( 
              <TouchableOpacity onPress={() => onReactionList(item)} style={[styles.reactionImgContainer, styles.otherReaction]}>
                <Image source={item.iconSource} style={styles.reactionImg} />
                <Text style={styles.reactionCount}>
                  {
                    item.reactions.length
                  }
                </Text>
              </TouchableOpacity>
            )} 

           {item.gaveReaction == null && item.reactions && item.reactions.length > 0 && (  
              <TouchableOpacity onPress={() => onReactionList(item)} style={[styles.reactionImgContainer, styles.otherReaction, styles.otherOnlyCount]}>
               {
                  item.reactions[0].reaction == 'like' && (
                    <Image source={require('../../../../assets/icons/blue-like.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'love' && (
                    <Image source={require('../../../../assets/icons/red-heart.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'angry' && (
                    <Image source={require('../../../../assets/icons/anger.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'surprised' && (
                    <Image source={require('../../../../assets/icons/wow.png')} style={styles.unfilledImg} />
                )}
                 {
                  item.reactions[0].reaction == 'laugh' && (
                    <Image source={require('../../../../assets/icons/crylaugh.png')} style={styles.unfilledImg} />
                )}
                {
                  item.reactions[0].reaction == 'cry' && (
                    <Image source={require('../../../../assets/icons/crying.png')} style={styles.unfilledImg} />
                )}
                <Text style={styles.reactionCount}>
                  {
                    item.reactions.length
                  }
                </Text>
              </TouchableOpacity>
             )}  
 
          </View>
        
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

ThreadItem.propTypes = {};

export default ThreadItem;
