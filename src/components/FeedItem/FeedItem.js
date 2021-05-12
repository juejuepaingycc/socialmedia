import React, { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import Swiper from 'react-native-swiper';
//import { useColorScheme } from 'react-native-appearance';
import ActionSheet from 'react-native-actionsheet';
import TruncateText from 'react-native-view-more-text';
import { Viewport } from '@skele/components';
import FeedMedia from './FeedMedia';
import { TNTouchableIcon, TNStoryItem } from '../../Core/truly-native';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';
import { timeFormat } from '../../Core';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';

//const ViewportAwareSwiper = Viewport.Aware(Swiper);

const reactionIcons = ['like', 'love', 'laugh', 'surprised', 'cry', 'angry'];
const FeedItem = memo((props) => {
  const {
    item,
    onCommentPress,
    onSharePress,
    containerStyle,
    onUserItemPress,
    onMediaPress,
    onReaction,
    onViewReaction,
    onSharePostToChat,
    onEditPost,
    onDeletePost,
    onUserReport,
    user,
    willBlur,
    giveReaction,
    deletePostReaction,
    disableEditButton
  } = props;

  if (!item) {
    alert('There is no feed item to display. You must fix this error.');
    return null;
  }

  const colorScheme = 'light';
  const styles = dynamicStyles(colorScheme);

  let defaultReaction = 'thumbsupUnfilled';
  const [postMediaIndex, setPostMediaIndex] = useState(0);
  const [otherReactionsVisible, setOtherReactionsVisible] = useState(false);
  const [selectedIconName, setSelectedIconName] = useState(
    item.myReaction ? item.myReaction : defaultReaction,
  );

  const [reactionCount, setReactionCount] = useState(0);
  const [previousReaction, setPreviousReaction] = useState(item.myReaction); // the source of truth - coming directly from the database
  const moreRef = useRef();

  useEffect(() => {
    setSelectedIconName(item.myReaction ? item.myReaction : defaultReaction);
    setPreviousReaction(item.myReaction); // this only changes when database reaction changes
  }, [item]);

  useEffect(() => {
    //console.log("IIIIIII>>"+ JSON.stringify(item))
    if(item.postReactions && item.postReactions.length > 0){
      setReactionCount(item.postReactions.length);
    }
  }, [item.postReactions]);

  const onReactionPress = async (reaction) => {
    console.log("Reaction>>"+ reaction + " " + JSON.stringify(item))
    setOtherReactionsVisible(false);
    if(reaction == null){
      if(!item.gaveReaction || item.gaveReaction == 'thumbsupUnfilled' || item.gaveReaction == ''){
        console.log("Liked...")
        giveReaction('like', item, true);
      }
      else{
        console.log("Unlike...")
        deletePostReaction(item);
      }
    }
    else{
      if(item.gaveReaction == 'thumbsupUnfilled' || item.gaveReaction == '' || item.gaveReaction == undefined || item.gaveReaction == null){
        giveReaction(reaction, item, true);
      }
      else{
        giveReaction(reaction, item, false);
      }
    }
  }

  const onReactionLongPress = () => {
    setOtherReactionsVisible(!otherReactionsVisible);
  };

  const onMorePress = () => {
    if (otherReactionsVisible) {
      setOtherReactionsVisible(false);
      return;
    }
    moreRef.current.show();
  };

  const didPressShare = () => {
    onSharePress(item)
  }

  const didPressComment = () => {
    if (otherReactionsVisible) {
      setOtherReactionsVisible(false);
      return;
    }
    onCommentPress(item);
  };

  const moreArray = [];
  
  if (item.authorID === user.id) {
    moreArray.push(IMLocalized('Delete Post'));
    if(!disableEditButton)  
      moreArray.push(IMLocalized('Edit Post'));
  } else {
   // moreArray.push(IMLocalized('Block User'));
    moreArray.push(IMLocalized('Report Post'));
  }
  moreArray.push(IMLocalized('Forward Post'));
  moreArray.push(IMLocalized('CancelTransfer'));

  const onMoreDialogDone = (index) => {
    if (index === moreArray.indexOf(IMLocalized('Forward Post'))) {
      onSharePostToChat(item);
    }
    if (index === moreArray.indexOf(IMLocalized('Edit Post'))) {
      onEditPost(item);
    }
    if (
      index === moreArray.indexOf(IMLocalized('Report Post')) ||
      index === moreArray.indexOf(IMLocalized('Block User'))
    ) {
      onUserReport(item, moreArray[index]);
    }

    if (index === moreArray.indexOf(IMLocalized('Delete Post'))) {
      onDeletePost(item);
    }
  };

  const inactiveDot = () => <View style={styles.inactiveDot} />;

  const activeDot = () => <View style={styles.activeDot} />;

  const renderTouchableIconIcon = (src, tappedIcon, index) => {
    return (
      <TNTouchableIcon
        key={index + 'icon'}
        containerStyle={styles.reactionIconContainer}
        iconSource={src}
        imageStyle={styles.reactionIcon}
        onPress={() => onReactionPress(tappedIcon)}
        appStyles={AppStyles}
      />
    );
  };

  const renderViewMore = (onPress) => {
    return (
      <Text onPress={onPress} style={styles.moreText}>
        {IMLocalized('more')}
      </Text>
    );
  };

  const renderViewLess = (onPress) => {
    return (
      <Text onPress={onPress} style={styles.moreText}>
        {IMLocalized('less')}
      </Text>
    );
  };

  const longPressText = (text) => {
    Clipboard.setString(text);
    ToastAndroid.show(IMLocalized('Copied'), ToastAndroid.SHORT);
  }

  const renderPostText = (item) => {
    if (item.postText) {
      return (
        <TouchableOpacity
        onLongPress={()=> longPressText(item.postText)}
        >
          <TruncateText
            numberOfLines={4}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}
            textStyle={styles.body}>
            <Text style={{ fontFamily: AppStyles.customFonts.robotoRegular }}>{item.postText || ' '}</Text>
          </TruncateText>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderMedia = (item) => {
    if (
      item &&
      item.postMedia &&
      item.postMedia.length &&
      item.postMedia.length > 0
    ) {
      return (
        <View style={styles.bodyImageContainer}>
          <Swiper
            removeClippedSubviews={false}
            containerStyle={{ flex: 1 }}
            dot={inactiveDot()}
            activeDot={activeDot()}
            paginationStyle={{
              bottom: 20,
            }}
            onIndexChanged={(swiperIndex) => setPostMediaIndex(swiperIndex)}
            loop={false}
            preTriggerRatio={-0.6}>

       
      {item.postMedia && item.postMedia.length > 0 && (
          <View style={{ 
            //height: AppStyles.WINDOW_HEIGHT * 0.3
            height: 350
            }}>
          {item.postMedia.length == 1 && (
            <FeedMedia
                    //navigation={navigation}
                    key={'0'}
                    inViewPort={true}
                    index={0}
                    postMediaIndex={0}
                    media={item.postMedia[0]}
                    item={item}
                    onImagePress={onMediaPress}
                    //onMediaPress={didPressMedia}
                    dynamicStyles={styles}
                    willBlur={willBlur}
                    count={1}
                  />
            )}

          {item.postMedia.length == 2 && (
              <View style={styles.twocard}>
                  <FeedMedia
                        //navigation={navigation}
                          key={'0'}
                          inViewPort={true}
                          index={0}
                          postMediaIndex={0}
                          media={item.postMedia[0]}
                          item={item}
                          onImagePress={onMediaPress}
                          //onMediaPress={didPressMedia}
                          dynamicStyles={styles}
                          willBlur={willBlur}
                          count={2}
                    />

                     <FeedMedia
                    //navigation={navigation}
                      key={'1'}
                      inViewPort={true}
                      index={1}
                      postMediaIndex={1}
                      media={item.postMedia[1]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={2}
                />
            </View>
              )}

              
{item.postMedia.length == 3 && (
              <View style={styles.twocard}>
                  <FeedMedia
                        //navigation={navigation}
                          key={'0'}
                          inViewPort={true}
                          index={0}
                          postMediaIndex={0}
                          media={item.postMedia[0]}
                          item={item}
                          onImagePress={onMediaPress}
                          //onMediaPress={didPressMedia}
                          dynamicStyles={styles}
                          willBlur={willBlur}
                          count={3}
                    />

                     <FeedMedia
                    //navigation={navigation}
                      key={'1'}
                      inViewPort={true}
                      index={1}
                      postMediaIndex={1}
                      media={item.postMedia[1]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={3}
                />

<FeedMedia
                   // navigation={navigation}
                      key={'2'}
                      inViewPort={true}
                      index={2}
                      postMediaIndex={2}
                      media={item.postMedia[2]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={3}
                />
            </View>
              )}

              
{item.postMedia.length == 4 && (
              <View style={styles.twocard}>
                  <FeedMedia
                        //navigation={navigation}
                          key={'0'}
                          inViewPort={true}
                          index={0}
                          postMediaIndex={0}
                          media={item.postMedia[0]}
                          item={item}
                          onImagePress={onMediaPress}
                          //onMediaPress={didPressMedia}
                          dynamicStyles={styles}
                          willBlur={willBlur}
                          count={4}
                    />

                     <FeedMedia
                    //navigation={navigation}
                      key={'1'}
                      inViewPort={true}
                      index={1}
                      postMediaIndex={1}
                      media={item.postMedia[1]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={4}
                />

<FeedMedia
                    //navigation={navigation}
                      key={'2'}
                      inViewPort={true}
                      index={2}
                      postMediaIndex={2}
                      media={item.postMedia[2]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={4}
                />

<FeedMedia
                    //navigation={navigation}
                      key={'3'}
                      inViewPort={true}
                      index={3}
                      postMediaIndex={3}
                      media={item.postMedia[3]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={4}
                />
            </View>
              )}
  
      
             
{item.postMedia.length == 5 && (
              <View style={styles.twocard}>
                  <FeedMedia
                        //navigation={navigation}
                          key={'0'}
                          inViewPort={true}
                          index={0}
                          postMediaIndex={0}
                          media={item.postMedia[0]}
                          item={item}
                          onImagePress={onMediaPress}
                          //onMediaPress={didPressMedia}
                          dynamicStyles={styles}
                          willBlur={willBlur}
                          count={5}
                    />

                     <FeedMedia
                   // navigation={navigation}
                      key={'1'}
                      inViewPort={true}
                      index={1}
                      postMediaIndex={1}
                      media={item.postMedia[1]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={5}
                />

<FeedMedia
                   // navigation={navigation}
                      key={'2'}
                      inViewPort={true}
                      index={2}
                      postMediaIndex={2}
                      media={item.postMedia[2]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={5}
                />

<FeedMedia
                    //navigation={navigation}
                      key={'3'}
                      inViewPort={true}
                      index={3}
                      postMediaIndex={3}
                      media={item.postMedia[3]}
                      item={item}
                      onImagePress={onMediaPress}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={5}
                />
                
<FeedMedia
                   // navigation={navigation}
                      key={'4'}
                      inViewPort={true}
                      index={4}
                      postMediaIndex={4}
                      media={item.postMedia[4]}
                      item={item}
                      onImagePress={onMediaPress}
                     // onMediaResize={onMediaResize}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={5}
                />
            </View>
              )}

                     
{item.postMedia.length > 5 && (
              <View style={styles.twocard}>
                  <FeedMedia
                        //navigation={navigation}
                          key={'0'}
                          inViewPort={true}
                          index={0}
                          postMediaIndex={0}
                          media={item.postMedia[0]}
                          item={item}
                          onImagePress={onMediaPress}
                        //  onMediaResize={onMediaResize}
                         // onMediaPress={didPressMedia}
                          dynamicStyles={styles}
                          willBlur={willBlur}
                          count={10}
                          extra={item.postMedia.length-4}
                    />

                     <FeedMedia
                   // navigation={navigation}
                      key={'1'}
                      inViewPort={true}
                      index={1}
                      postMediaIndex={1}
                      media={item.postMedia[1]}
                      item={item}
                      onImagePress={onMediaPress}
                     // onMediaResize={onMediaResize}
                     // onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={10}
                      extra={item.postMedia.length-4}
                />

<FeedMedia
                   // navigation={navigation}
                      key={'2'}
                      inViewPort={true}
                      index={2}
                      postMediaIndex={2}
                      media={item.postMedia[2]}
                      item={item}
                      onImagePress={onMediaPress}
                     // onMediaResize={onMediaResize}
                      //onMediaPress={didPressMedia}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={10}
                      extra={item.postMedia.length-4}
                />

<FeedMedia
                   // navigation={navigation}
                      key={'3'}
                      inViewPort={true}
                      index={3}
                      postMediaIndex={3}
                      media={item.postMedia[3]}
                      item={item}
                      onImagePress={onMediaPress}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={10}
                      extra={item.postMedia.length-4}
                />
                
<FeedMedia
                   // navigation={navigation}
                      key={'4'}
                      inViewPort={true}
                      index={4}
                      postMediaIndex={4}
                      media={item.postMedia[4]}
                      item={item}
                      onImagePress={onMediaPress}
                      dynamicStyles={styles}
                      willBlur={willBlur}
                      count={10}
                      extra={item.postMedia.length-4}
                />
            </View>
              )}


        </View>
        )}

          </Swiper>
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={didPressComment}
      style={[styles.container, containerStyle]}>
      <View style={styles.headerContainer}>
        {item.author && (
          <TNStoryItem
            imageContainerStyle={styles.userImageContainer}
            item={item.author}
            onPress={onUserItemPress}
            appStyles={AppStyles}
          />
        )}
        <View style={styles.titleContainer}>
          {item.author && (
              <Text style={styles.title}>
                {item.author.firstName +
                  (item.author.lastName ? ' ' + item.author.lastName : '')}
              </Text>
          )}
           {
                item.location != '' && (
                    <Text style={styles.loc}>{item.location}</Text>
                )
              }
          <View style={styles.mainSubtitleContainer}>
            <View style={styles.subtitleContainer}>
              {
                item.newCreatedAt ?
                <Text style={styles.subtitle}>{item.newCreatedAt}&nbsp;&nbsp;</Text>
                :
                <Text style={styles.subtitle}>{timeFormat(item.createdAt)}&nbsp;&nbsp;</Text>
              } 
               {/* {
                item.postText == 'Mood' ?
                <Text style={styles.subtitle}>{timeFormat(item.createdAt)}&nbsp;&nbsp;</Text>
                :
                <Text style={styles.subtitle}>TEST&nbsp;&nbsp;</Text>
              } */}
            </View>
            {
              item.status == 'Public' && (
                <Icon name='earth' size={14} color='gray' style={styles.privacyIcon} />
              )
            }
            {
              item.status == 'Only me' && (
                <Icon name='lock-closed-outline' size={14} color='gray' style={styles.privacyIcon} />
              )
            }
            {
              (item.status == undefined || item.status == 'Friends') && (
                <Icon name='people' size={14} color='gray' style={styles.privacyIcon} />
              )
            }
            {/* <View style={[styles.subtitleContainer, { flex: 2 }]}>
              <Text style={styles.subtitle}>{item.location}</Text>
            </View>    */}
          </View>
        </View>
        <TNTouchableIcon
          onPress={onMorePress}
          imageStyle={styles.moreIcon}
          containerStyle={styles.moreIconContainer}
          iconSource={AppStyles.iconSet.more}
          appStyles={AppStyles}
        />
      </View>
      {renderPostText(item)}
      {renderMedia(item)}
      {otherReactionsVisible && (
        <View style={styles.reactionContainer}>
          {reactionIcons.map((icon, index) =>
            renderTouchableIconIcon(AppStyles.iconSet[icon], icon, index),
          )}
        </View>
      )}
      <View style={styles.footerContainer}>
        {
          (item.postReactionsCount > 0 || item.commentCount > 0) && (
            <View style={styles.countRow}>
              {
                item.postReactionsCount > 0 ?
                  <TNTouchableIcon
                  containerStyle={styles.footerIconContainer2}
                  iconSource={AppStyles.iconSet[item.gaveReaction]}
                  title={item.postReactionsCount}
                  renderTitle={true}
                  onPress={() => onViewReaction(item)}
                  appStyles={AppStyles}
                />
                :
                <View />
              }
              {
                item.commentCount > 0 && (
                  <TNTouchableIcon
                  containerStyle={styles.footerIconContainer3}
                  iconSource={AppStyles.iconSet.commentUnfilledBlack}
                  imageStyle={[styles.footerIcon, ]}
                  renderTitle={true}
                  title={item.commentCount < 1 ? ' ' : item.commentCount}
                  onPress={didPressComment}
                  appStyles={AppStyles}
                />
                )
              }
          </View>
          )
        }
        <View style={styles.iconContainer}>
          <TNTouchableIcon
            containerStyle={styles.footerIconContainer}
            //iconSource={AppStyles.iconSet[selectedIconName]}
            iconSource={AppStyles.iconSet['thumbsupUnfilled']}
            //imageStyle={[styles.footerIcon, tintColor]}
            // renderTitle={true}
            // title={reactionCount < 1 ? ' ' : reactionCount}
            renderLabel={true}
            label={IMLocalized('Like')}
            onLongPress={() => onReactionLongPress()}
            onPress={() => onReactionPress(null)}
            appStyles={AppStyles}
          />
          <TNTouchableIcon
            containerStyle={styles.footerIconContainer}
            iconSource={AppStyles.iconSet.commentUnfilledBlack}
            imageStyle={[styles.footerIcon, ]}
            // renderTitle={true}
            // title={item.commentCount < 1 ? ' ' : item.commentCount}
            renderLabel={true}
            label={IMLocalized('Comment')}
            onPress={didPressComment}
            appStyles={AppStyles}
          />
          <TNTouchableIcon
            containerStyle={styles.footerIconContainer}
            icon={true}
            renderTitle={false}
            renderLabel={true}
            label={IMLocalized('Share')}
            onPress={didPressShare}
            appStyles={AppStyles}
          />
        </View> 
      </View>
      <ActionSheet
        ref={moreRef}
        //title={IMLocalized('More')}
        options={moreArray}
        destructiveButtonIndex={moreArray.indexOf('Delete Post')}
        cancelButtonIndex={moreArray.length - 1}
        onPress={onMoreDialogDone}
      />
    </TouchableOpacity>
  );
});

FeedItem.propTypes = {
  onPress: PropTypes.func,
  onOtherReaction: PropTypes.func,
  onLikeReaction: PropTypes.func,
  onUserItemPress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onSharePress: PropTypes.func,
  onMediaPress: PropTypes.func,
  item: PropTypes.object,
  shouldUpdate: PropTypes.bool,
  iReact: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default FeedItem;
