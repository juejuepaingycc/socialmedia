import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import dynamicStyles from './styles';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';

const Image = FastImage;

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

function StoryItem(props) {
  const {
    item,
    index,
    onPress,
    containerStyle,
    imageStyle,
    imageContainerStyle,
    textStyle,
    activeOpacity,
    title,
    appStyles,
    showOnlineIndicator,
    isProfile
  } = props;

  const refs = useRef();
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);
  const lastName = item.lastName || '';

  return (
    <TouchableOpacity
      key={index}
      ref={refs}
      activeOpacity={activeOpacity}
      onPress={() => onPress(item, index, refs)}
      style={[styles.container, containerStyle]}>
      <View style={[styles.imageContainer, imageContainerStyle]}>
        <Image
          style={[styles.image, imageStyle]}
          source={{ uri: item.profilePictureURL || defaultAvatar }}
        />
        {showOnlineIndicator && <View style={styles.isOnlineIndicator} />}
      </View>
      {title && (
        <Text
          style={[
            styles.text,
            textStyle,
          ]}>{`${item.firstName} ${lastName}`}</Text>
      )}
      {
        isProfile && (
          <View style={styles.status}>
            {item.bio != undefined && item.bio != null && item.bio != '' && (
              <View style={styles.rowBio}>
                <Icon name='megaphone-outline' size={23} color='#5b6270' />
                <Text style={styles.bio}>{item.bio}</Text>
              </View>
            )}
            {item.gender != undefined && item.gender != null && item.gender != '' && (
              <View style={styles.rowBio}>
                {/* {
                  item.gender == 'Male' ?
                    <Icon name='person-outline' size={23} color='#5b6270' />
                  : */}
                <Icon name='person' size={23} color='#5b6270' />
                <Text style={styles.bio}>{item.gender}</Text>
              </View>
            )}
            {item.rsStatus && (
              <View style={styles.row}>
                <Icon name='heart' size={23} color='#a83225' />
                <Text style={styles.bio}>{item.rsStatus}</Text>
              </View>
            )}
          </View>
        )
      }
      
    </TouchableOpacity>
  );
}

StoryItem.propTypes = {
  onPress: PropTypes.func,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  item: PropTypes.object,
  index: PropTypes.number,
  activeOpacity: PropTypes.number,
  title: PropTypes.bool,
};

export default StoryItem;
