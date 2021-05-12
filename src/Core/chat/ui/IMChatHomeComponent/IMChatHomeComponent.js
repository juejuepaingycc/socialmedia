import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Modal, Text, StyleSheet } from 'react-native';

import { SearchBarAlternate } from '../../..';
import { IMUserSearchModal } from '../../../socialgraph/friendships';
import { TNStoriesTray } from '../../../truly-native';
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { IMConversationListView } from '../..';
import { IMLocalized } from '../../../localization/IMLocalization';
import { Colors, Scales } from '@common';
import { BarCodeScanner } from 'expo-barcode-scanner';

function IMChatHomeComponent(props) {
  const {
    friends,
    onSearchBarPress,
    onSearchTextChange,
    isSearchModalOpen,
    onSearchModalClose,
    searchData,
    onSearchBarCancel,
    onFriendItemPress,
    searchBarRef,
    onFriendAction,
    onSearchClear,
    navigation,
    appStyles,
    onSenderProfilePicturePress,
    onEmptyStatePress,
    followEnabled,
    showQR,
    disableQR,
    onSuccess,
    hasPermission,
    groupScreen,
    forwarded,
    forwardMessage,
    toggleLoading,
    shareStatus,
    shareText,
    shareMedia,
    shareName,
    sharePostInfo
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const emptyStateConfig = {
    title: IMLocalized('No Conversations'),
    description: IMLocalized(
      'Add some friends and start chatting with them. Your conversations will show up here.',
    ),
    buttonName: IMLocalized('Add friends'),
    onPress: onEmptyStatePress,
  };

  const emptyStateConfigGroup = {
    title: IMLocalized('No Group'),
    description: IMLocalized('Create group to start chatting with your friends'),
    buttonName: IMLocalized('Create Group'),
    onPress: onEmptyStatePress,
  };

  if (hasPermission === null || hasPermission === false) {
    return <Text></Text>
  }
  else {
  return (
    <View style={styles.container}>
        <Modal
            animationType="slide"
            hardwareAccelerated
            visible={showQR}
            style={{ height: Scales.deviceHeight }}
            onRequestClose={disableQR}>
            {/* <BarCodeScanner
              onBarCodeScanned={onSuccess}
              style={[StyleSheet.absoluteFill, styles.qrcontainer]}
            >
              <View style={styles.layerTop} />
              <View style={styles.layerCenter}>
                <View style={styles.layerLeft} />
                <View style={styles.focused} />
                <View style={styles.layerRight} />
              </View>
              <View style={styles.layerBottom} />
            </BarCodeScanner> */}
            <BarCodeScanner
              onBarCodeScanned={onSuccess}
              style={[StyleSheet.absoluteFill, styles.qrcontainer]}
            >
              <View style={styles.layerTop} />
              <Text style={styles.scan}>{IMLocalized('Scan QR to add friend')}</Text>
              <View style={styles.topBorder}>
                <View style={styles.topBorder1} />
                <View style={styles.topBorder2} />
              </View>
              <View style={styles.layerCenter}>
                
                <View style={styles.layerLeft} />
                <View style={styles.leftBorder}>
                  <View style={styles.leftBorder1} />
                  <View style={styles.leftBorder2} />
                </View>
                <View style={styles.focused} />
                <View style={styles.leftBorder}>
                  <View style={styles.leftBorder1} />
                  <View style={styles.leftBorder2} />
                </View>
                <View style={styles.layerRight} />
              </View>
              <View style={styles.topBorder}>
                <View style={styles.topBorder1} />
                <View style={styles.topBorder2} />
              </View>
              <View style={styles.layerBottom} />
            </BarCodeScanner>

          </Modal>

      <ScrollView style={styles.container}>

        {
          groupScreen ?
          null
          :
        <View style={styles.searchBarContainer}>
          <SearchBarAlternate
            onPress={onSearchBarPress}
            placeholderTitle={IMLocalized('search')}
            appStyles={appStyles}
          />
        </View> 
        }
      
        {
          groupScreen?
            <View style={styles.chatsChannelContainer}>
              <IMConversationListView
                navigation={navigation}
                appStyles={appStyles}
                emptyStateConfig={emptyStateConfigGroup}
                groupScreen={groupScreen}
                forwarded={forwarded}
                forwardMessage={forwardMessage}
                toggleLoading={toggleLoading}
                shareStatus={shareStatus}
                shareText={shareText}
                shareMedia={shareMedia}
                sharePostInfo={sharePostInfo}
                shareName={shareName}
              />
            </View>
              :
            <View style={styles.chatsChannelContainer}>
              <IMConversationListView
                navigation={navigation}
                appStyles={appStyles}
                emptyStateConfig={emptyStateConfig}
                groupScreen={groupScreen}
                forwarded={forwarded}
                forwardMessage={forwardMessage}
                toggleLoading={toggleLoading}
                shareStatus={shareStatus}
                shareText={shareText}
                shareMedia={shareMedia}
                shareName={shareName}
                sharePostInfo={sharePostInfo}
              />
            </View>
        }
        
      </ScrollView>
      <IMUserSearchModal
        onSearchBarCancel={onSearchBarCancel}
        onSearchClear={onSearchClear}
        data={searchData}
        onFriendItemPress={onFriendItemPress}
        onSearchTextChange={onSearchTextChange}
        onAddFriend={onFriendAction}
        isModalOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
        searchBarRef={searchBarRef}
        appStyles={appStyles}
        followEnabled={followEnabled}
      /> 
    </View>
  );
      }
}

IMChatHomeComponent.propTypes = {
  onSearchClear: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  onFriendAction: PropTypes.func,
  onSearchBarPress: PropTypes.func,
  onSearchBarCancel: PropTypes.func,
  onSearchTextChange: PropTypes.func,
  onSearchModalClose: PropTypes.func,
  channels: PropTypes.array,
  searchData: PropTypes.array,
  isSearchModalOpen: PropTypes.bool,
  searchBarRef: PropTypes.object,
};

export default IMChatHomeComponent;
