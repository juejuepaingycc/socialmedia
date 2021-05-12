import React, { useRef, useState, useEffect } from 'react';
import { FlatList, View, ActivityIndicator, Dimensions, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
//import { Viewport } from '@skele/components';
//import { useColorScheme } from 'react-native-appearance';
import FeedItem from '../../FeedItem/FeedItem';
import dynamicStyles from './styles';
import IMCameraModal from '../../../Core/camera/IMCameraModal';
import TNMediaViewerModal from '../../../Core/truly-native/TNMediaViewerModal';
import FullStories from '../../../Core/stories/FullStories';
import { TNEmptyStateView } from '../../../Core/truly-native';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import { IMNativeFBAdComponentView } from '../../../Core/ads/facebook';
import AppStyles from '../../../AppStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';

const HEIGHT = Dimensions.get('window').height;

function Feed(props) {
  const {
    onCommentPress,
    onSharePress,
    feed,
    user,
    isCameraOpen,
    onCameraClose,
    onUserItemPress,
    onFeedUserItemPress,
    isMediaViewerOpen,
    feedItems,
    onMediaClose,
    onMediaPress,
    selectedMediaIndex,
    stories,
    onPostStory,
    userStories,
    onReaction,
    onLikeReaction,
    onOtherReaction,
    loading,
    shouldEmptyStories,
    isStoryUpdating,
    onSharePost,
    onSharePostToChat,
    onEditPost,
    giveReaction,
    deletePostReaction,
    onDeletePost,
    onUserReport,
    willBlur,
    shouldReSizeMedia,
    adsManager,
    emptyStateConfig,
    onViewReaction,
    moreLoading,
    deleteStory,
    getMore,
  } = props;

  const colorScheme = 'light';
  const styles = dynamicStyles(colorScheme);
  const fullStoryRef = useRef();
  const mediaLayouts = useRef([]);
  const [fuck, setFuck] = useState(false);
  var feedRef = useRef(); 
  const scrollRef = useRef();
  const onImagePost = (source) => {
    onPostStory(source);
  };

  const renderItem = ({ item, index }) => {
    let shouldUpdate = false;
    if (item.shouldUpdate) {
      shouldUpdate = item.shouldUpdate;
    }
    if (item.isAd) {
      return (
        <IMNativeFBAdComponentView key={index + 'ad'} adsManager={adsManager} />
      );
    }
    return (
      <FeedItem
        key={index + 'feeditem'}
        onUserItemPress={onFeedUserItemPress}
        item={item}
        feedIndex={index}
        onCommentPress={onCommentPress}
        onSharePress={onSharePress}
        onMediaPress={onMediaPress}
        shouldReSizeMedia={shouldReSizeMedia}
        onReaction={onReaction}
        onViewReaction={onViewReaction}
        onLikeReaction={onLikeReaction}
        onOtherReaction={onOtherReaction}
        iReact={item.iReact}
        shouldUpdate={shouldUpdate}
        userReactions={item.userReactions}
        onSharePost={onSharePost}
        onSharePostToChat={onSharePostToChat}
        onEditPost={onEditPost}
        onDeletePost={onDeletePost}
        giveReaction={giveReaction}
        onUserReport={onUserReport}
        deletePostReaction={deletePostReaction}
        user={user}
        willBlur={willBlur}
        shouldDisplayViewAllComments={true}
        onLayout={(event) => {
          if (
            event &&
            event.nativeEvent &&
            mediaLayouts &&
            mediaLayouts.current
          ) {
            const layout = event.nativeEvent.layout;
            mediaLayouts.current[index] = layout.x;
          }
        }}
      />
    );
  };

  const renderListFooter = () => {
    if (moreLoading) {
      return <ActivityIndicator style={{ marginVertical: 7 }} size="small" />;
    }
    else{
      return (
        <TouchableOpacity onPress={getMore} style={styles.moreBtn}>
          <Text style={styles.loadmore}>{IMLocalized('Load more')}...</Text>
          <Icon name='reload-sharp' size={22} color='black' style={styles.moreIcon} />
        </TouchableOpacity>
      )
    }
  };

  const renderEmptyComponent = () => {
    if (!feed) {
      return null;
    }

  if(loading){
      return (
        <TNEmptyStateView
          style={styles.emptyStateView}
          emptyStateConfig={emptyStateConfig}
          appStyles={AppStyles}
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.feedContainer}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    );
  }
  return (
    <View style={styles.feedContainer}>

        <FullStories
          ref={fullStoryRef}
          user={user}
          shouldEmptyStories={shouldEmptyStories}
          isStoryUpdating={isStoryUpdating}
          onUserItemPress={onUserItemPress}
          stories={stories}
          userStories={userStories}
          appStyles={AppStyles}
          deleteStory={deleteStory}
        />
        
      {/* <Viewport.Tracker> */}
         {
          feed && feed.length > 0 ? 
            <FlatList
              // ref={(ref) => {
              //   if (feedRef) {
              //     feedRef.current = ref;
              //   }
              // }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={renderListFooter}
              ListEmptyComponent={renderEmptyComponent}
              data={feed}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              removeClippedSubviews={true}
              // onEndReached={() => {
              // }}
              // onEndReachedThreshold={0.1}
              // onRefresh={() => console.log("Refresh...")}
              // refreshing={false}
            />
          :
          <TNEmptyStateView
          style={styles.emptyStateView}
          emptyStateConfig={emptyStateConfig}
          appStyles={AppStyles}
        />
       } 
          {/* </Viewport.Tracker> */}

      <IMCameraModal
        isCameraOpen={isCameraOpen}
        onImagePost={onImagePost}
        onCameraClose={onCameraClose}
      />
      <TNMediaViewerModal
        mediaItems={feedItems}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
    </View>
  );
  // }
}

Feed.propTypes = {
  feedItems: PropTypes.array,
  userStories: PropTypes.object,
  stories: PropTypes.array,
  onMediaClose: PropTypes.func,
  onCommentPress: PropTypes.func,
  onSharePress: PropTypes.func,
  onPostStory: PropTypes.func,
  onUserItemPress: PropTypes.func,
  onCameraClose: PropTypes.func,
  isCameraOpen: PropTypes.bool,
  displayStories: PropTypes.bool,
  isMediaViewerOpen: PropTypes.bool,
  onFeedUserItemPress: PropTypes.func,
  onMediaPress: PropTypes.func,
  selectedMediaIndex: PropTypes.number,
  onLikeReaction: PropTypes.func,
  onOtherReaction: PropTypes.func,
};

export default Feed;
