import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';

import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
//import { useColorScheme } from 'react-native-appearance';
import { TNStoryItem } from '../../../Core/truly-native';
import FeedItem from '../../FeedItem/FeedItem';
import ProfileButton from './ProfileButton';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import { TNEmptyStateView } from '../../../Core/truly-native';
import AppStyles from '../../../AppStyles';
import FriendCard from './FriendCard';
import {
  TNActivityIndicator,
  TNMediaViewerModal,
} from '../../../Core/truly-native';
import Icon from 'react-native-vector-icons/Ionicons';

function Profile(props) {
  const colorScheme = 'light';
  const styles = dynamicStyles(colorScheme);
  const {
    onMainButtonPress,
    onNearByPress,
    onAppSettingPress,
    onBlockUser,
    onAlbumPress,
    onVideoAlbumPress,
    recentUserFeeds,
    user,
    isMediaViewerOpen,
    feedItems,
    onMediaClose,
    selectedMediaIndex,
    removePhoto,
    startUpload,
    uploadProgress,
    loading,
    onUserReport,
    onFeedUserItemPress,
    isFetching,
    isOtherUser,
    onEmptyStatePress,
    onSubButtonTitlePress,
    subButtonTitle,
    displaySubButton,
    onCommentPress,
    onEditPost,
    friends,
    onMediaPress,
    onReaction,
    onDeletePost,
    onSharePost,
    onSharePostToChat,
    loggedInUser,
    willBlur,
    onFriendItemPress,
    navigation,
    pressScan,
    onViewReaction,
    giveReaction,
    deletePostReaction,
    friendships,
    getMore,
    moreLoading,
    onDeleteRequest,
    moreData
  } = props;
  //console.log("Profile User>>"+ JSON.stringify(user));
  const updatePhotoDialogActionSheet = useRef();
  const photoUploadDialogActionSheet = useRef();
  const [mainButtonTitle, setMainButtonTitle] = useState(IMLocalized('Profile Settings'))
  const [action, setAction] = useState('setting');
  useEffect(() => {
    if(friendships && isOtherUser){
      //checkFriendshipStatus();
      let temp = friendships.filter(
        (friend) => friend.user.id == isOtherUser.id
      );
      //console.log("Friend>>"+ JSON.stringify(temp));
      if(temp && temp.length > 0){
        if(temp[0].type == 'reciprocal')
        {
          setMainButtonTitle(IMLocalized('Send Message'));
          setAction('sendMessage');
        }
        else if(temp[0].type == 'inbound'){
          setMainButtonTitle(IMLocalized('Accept'))
          setAction('accept')
        }
        else if(temp[0].type == 'outbound'){
          setMainButtonTitle(IMLocalized('Cancel request'));
          setAction('cancel')
        }
      }
      else{
      console.log("new friend..");
        setMainButtonTitle(IMLocalized('Add friend'))
        setAction('addFriend')
      }
    }
  },[friendships, isOtherUser]);

  const onProfilePicturePress = () => {
    if (isOtherUser) {
      return;
    }
    updatePhotoDialogActionSheet.current.show();
  };

  const onUpdatePhotoDialogDone = (index) => {
    if (index === 0) {
      photoUploadDialogActionSheet.current.show();
    }

    if (index === 1) {
      removePhoto();
    }
  };

  const onPhotoUploadDialogDone = (index) => {
    if (index === 0) {
      onLaunchCamera();
    }

    if (index === 1) {
      onOpenPhotos();
    }
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      const source = image.path;

      startUpload(source);
    });
  };

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then((image) => {
      const source = image.path;

      startUpload(source);
    });
  };

  const renderItem = ({ item, index }) => {
    let shouldUpdate = false;
    if (item.shouldUpdate) {
      shouldUpdate = item.shouldUpdate;
    }
    return (
      <FeedItem
        item={item}
        index={index}
        key={index + 'feeditem'}
        onEditPost={onEditPost}
        onUserItemPress={onFeedUserItemPress}
        onCommentPress={onCommentPress}
        onMediaPress={onMediaPress}
        onReaction={onReaction}
        onViewReaction={onViewReaction}
        onSharePress={onSharePost}
        onSharePostToChat={onSharePostToChat}
        onUserReport={onUserReport}
        onDeletePost={onDeletePost}
        giveReaction={giveReaction}
        deletePostReaction={deletePostReaction}
        user={loggedInUser}
        willBlur={willBlur}
      />
    );
  };

  const renderListFooter = () => {
    if (loading) {
      return null;
    }
    if (isFetching || moreLoading) {
      return <ActivityIndicator style={{ marginVertical: 7 }} size="small" />;
    }
    if(!moreData){
      return <Text style={styles.nomore}>{IMLocalized('No more data')}</Text>
    }
    else{
      if(recentUserFeeds && recentUserFeeds.length > 0){
        return (
          <TouchableOpacity onPress={getMore} style={styles.moreBtn}>
            <Text style={styles.loadmore}>{IMLocalized('Load more')}...</Text>
            <Icon name='reload-sharp' size={22} color='black' style={styles.moreIcon} />
        </TouchableOpacity>
        );
      }
      else{
        return null;
      }
    }
  };

  const renderListHeader = () => {
    return (
      <View style={styles.subContainer}>
        <TNStoryItem
          item={user}
          imageStyle={styles.userImage}
          imageContainerStyle={styles.userImageContainer}
          containerStyle={styles.userImageMainContainer}
          activeOpacity={1}
          title={true}
          onPress={onProfilePicturePress}
          textStyle={styles.userName}
          appStyles={AppStyles}
          isProfile={true}
        />
        {!isOtherUser && (
          <View style={{ flexDirection: 'row', marginVertical: 7 }}>
            <TouchableOpacity onPress={pressScan} style={{ paddingRight: 15 }}>
                <Image source={require('../../../../assets/icons/scan.png')} style={styles.qrscan} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileQR',{
              user1: user
            })}
            style={{ paddingLeft: 15 }}>

                <Image source={require('../../../../assets/icons/qr-code.png')} style={styles.qrscan} />
            </TouchableOpacity>
          
          </View>
        )
        }
        {
          mainButtonTitle == IMLocalized('Accept') ?
          <View style={styles.row}>
            <ProfileButton title={IMLocalized('Cancel request')} containerStyle={styles.half} onPress={onDeleteRequest} />
            <ProfileButton title={mainButtonTitle} containerStyle={styles.half} onPress={() => onMainButtonPress(action)} />
          </View>
          :
          <ProfileButton title={mainButtonTitle} onPress={() => onMainButtonPress(action)} />
        }
        {
          mainButtonTitle == IMLocalized('Send Message') && (
           <ProfileButton title={IMLocalized('Block User')} onPress={onBlockUser} />
          )}
        {!isOtherUser && (
          <ProfileButton title={IMLocalized('App Settings')} onPress={onAppSettingPress} />
        )}
         {!isOtherUser && (
          <ProfileButton title={IMLocalized('Nearby Friends')} onPress={onNearByPress} />
        )}
        <ProfileButton title={IMLocalized('Album')} onPress={onAlbumPress} />
        <ProfileButton title={IMLocalized('Videos')} onPress={onVideoAlbumPress} />

            {((isOtherUser && user.show_friend_list && friends && friends.length > 0) ||
            (!isOtherUser && friends && friends.length > 0)) && (
              <Text style={styles.FriendsTitle}>{IMLocalized('Friends')}</Text>
            )}
            {((isOtherUser && user.show_friend_list && friends && friends.length > 0) || 
            (!isOtherUser && friends && friends.length > 0)) && (
              <View style={styles.FriendsContainer}>
                {friends.length > 0 &&
                  friends.map((item) => (
                    <FriendCard
                      onPress={() => onFriendItemPress(item)}
                      key={item.id}
                      item={item}
                    />
                  ))}
              </View>
            )}
            {(!isOtherUser || (user.show_friend_list && displaySubButton)) && (
              <ProfileButton
                title={subButtonTitle}
                onPress={onSubButtonTitlePress}
                disabled={!displaySubButton}
                containerStyle={[
                  {
                    marginVertical: 22,
                  },
                  styles.subButtonColor,
                  loading && { display: 'none' },
                  displaySubButton
                    ? { opacity: 1 }
                    : { opacity: 0, marginTop: -20, zIndex: -1 },
                ]}
                titleStyle={styles.titleStyleColor}
              />
            )}


        {loading && (
          <View style={styles.container}>
            <ActivityIndicator
              style={{ marginTop: 15, alignSelf: 'center' }}
              size="small"
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => {
    var emptyStateConfig = {
      title: IMLocalized('No Posts'),
      description: IMLocalized(
        'There are currently no posts on this profile. All the posts will show up here.',
      ),
    };
    if (!isOtherUser) {
      emptyStateConfig = {
        ...emptyStateConfig,
        buttonName: IMLocalized('Add Your First Post'),
        onPress: onEmptyStatePress,
      };
    }
    return (
      <TNEmptyStateView
        emptyStateConfig={emptyStateConfig}
        appStyles={AppStyles}
        style={{ marginTop: 20, marginBottom: 10 }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
      {recentUserFeeds && (
        <FlatList
          scrollEventThrottle={16}
          data={recentUserFeeds}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={false}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        />
      )}
      {recentUserFeeds == null && <TNActivityIndicator appStyles={AppStyles} />}
      <TNMediaViewerModal
        mediaItems={feedItems}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
      <ActionSheet
        ref={updatePhotoDialogActionSheet}
        title={IMLocalized('Profile Picture')}
        options={[
          IMLocalized('Change Photo'),
          IMLocalized('Remove'),
          IMLocalized('No'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={onUpdatePhotoDialogDone}
      />
      <ActionSheet
        ref={photoUploadDialogActionSheet}
        title={IMLocalized('Select Photo')}
        options={[
          IMLocalized('Camera'),
          IMLocalized('Library'),
          IMLocalized('No'),
        ]}
        cancelButtonIndex={2}
        onPress={onPhotoUploadDialogDone}
      />
    </View>
  );
}

Profile.propTypes = {
  onCommentPress: PropTypes.func,
  onEditPost: PropTypes.func,
  startUpload: PropTypes.func,
  removePhoto: PropTypes.func,
  onMainButtonPress: PropTypes.func,
  onNearByPress: PropTypes.func,
  onAlbumPress: PropTypes.func,
  onSubButtonTitlePress: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  onFeedUserItemPress: PropTypes.func,
  user: PropTypes.object,
  friends: PropTypes.array,
  friendships: PropTypes.array,
  subButtonTitle: PropTypes.string,
  feedItems: PropTypes.array,
  onMediaClose: PropTypes.func,
  isMediaViewerOpen: PropTypes.bool,
  onMediaPress: PropTypes.func,
  displaySubButton: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
  uploadProgress: PropTypes.number,
  otherUser: PropTypes.object
};

export default Profile;
