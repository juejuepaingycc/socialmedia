import React from 'react';
import { FlatList, View } from 'react-native';

import PropTypes from 'prop-types';
import { IMFriendItem } from '../..';
import { IMUserSearchModal } from '../..';
import { SearchBarAlternate } from '../../../..';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../../localization/IMLocalization';
import {
  TNEmptyStateView,
  TNActivityIndicator,
} from '../../../../truly-native';
import { SearchBar } from '../../../..';

function IMFriendsListComponent(props) {
  const {
    searchBar,
    containerStyle,
    onFriendAction,
    onFriendCancel,
    friendsData,
    onSearchBarPress,
    onSearchBarCancel,
    onSearchBarCancel2,
    searchData,
    onSearchTextChange,
    onSearchTextChange2,
    isSearchModalOpen,
    onSearchModalClose,
    onSearchClear,
    onSearchClear2,
    onFriendItemPress,
    searchBarRef,
    searchBarRef2,
    displayActions,
    appStyles,
    onEmptyStatePress,
    isLoading,
    followEnabled,
    viewer,
    emptyStateConfig,
    showAction
  } = props;

  //console.log("friendsData>>"+ JSON.stringify(friendsData))

  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const renderItem = ({ item }) => (
    <IMFriendItem
      onFriendItemPress={onFriendItemPress}
      item={item}
      onFriendAction={onFriendAction}
      onFriendCancel={onFriendCancel}
      displayActions={displayActions && item.user.id != viewer.id}
      appStyles={appStyles}
      followEnabled={followEnabled}
      showAction={showAction}
    />
  );

  return (
    <View style={[styles.container, containerStyle]}>
       {searchBar && showAction && (
        <SearchBarAlternate
          onPress={onSearchBarPress}
          placeholderTitle={IMLocalized('Search for friends')}
          appStyles={appStyles}
        />
      )} 

      {searchBar && !showAction && (
        <View style={styles.searchBarContainer}>
          <SearchBar
            onChangeText={onSearchTextChange2}
            onSearchBarCancel={onSearchBarCancel2}
            searchRef={searchBarRef2}
            onSearchClear={onSearchClear2}
            appStyles={appStyles}
          />
      </View>
      )} 

      {friendsData && friendsData.length > 0 && (
        <FlatList
          data={friendsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.user.id}
          removeClippedSubviews={true}
        />
      )}
      {!friendsData ||
        (friendsData.length <= 0 && (
          <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={appStyles}
            />
          </View>
        ))}
      <IMUserSearchModal
        onSearchBarCancel={onSearchBarCancel}
        onSearchClear={onSearchClear}
        data={searchData}
        onSearchTextChange={onSearchTextChange}
        isModalOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
        searchBarRef={searchBarRef}
        onAddFriend={onFriendAction}
        onFriendItemPress={onFriendItemPress}
        appStyles={appStyles}
        followEnabled={followEnabled}
      />
      {isLoading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
}

IMFriendsListComponent.propTypes = {
  onCommentPress: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  actionIcon: PropTypes.bool,
  searchBar: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  friendsData: PropTypes.array,
  onSearchBarPress: PropTypes.func,
  onSearchBarCancel: PropTypes.func,
  searchData: PropTypes.array,
  onSearchTextChange: PropTypes.func,
  isSearchModalOpen: PropTypes.bool,
  onSearchModalClose: PropTypes.func,
  searchBarRef: PropTypes.object,
  searchBarRef2: PropTypes.object,
  onSearchClear: PropTypes.func,
};

export default IMFriendsListComponent;
