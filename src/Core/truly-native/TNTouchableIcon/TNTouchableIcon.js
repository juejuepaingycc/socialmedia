import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';

function TNTouchableIcon(props) {
  const {
    onPress,
    containerStyle,
    iconSource,
    imageStyle,
    title,
    titleStyle,
    renderTitle,
    onLongPress,
    onViewReaction,
    onPressOut,
    onPressIn,
    iconRef,
    onLayout,
    appStyles,
    renderLabel,
    label,
    icon
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  return (
      <TouchableOpacity
        ref={iconRef}
        onLayout={onLayout}
        style={[styles.headerButtonContainer, containerStyle]}
        onLongPress={onLongPress}
        onPressOut={onPressOut}
        onPressIn={onPressIn}
        onPress={onPress}>
        {renderLabel && <Text style={styles.label}>{label}</Text>}
        {iconSource && (
          <Image style={[styles.Image, imageStyle]} source={iconSource} />
        )}   
        
        {icon && (
          <Icon name='share-social' size={23} color='gray' style={styles.icon} />
        )}
        {renderTitle && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      </TouchableOpacity>
  );
}

TNTouchableIcon.propTypes = {
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  onLongPress: PropTypes.func,
  onViewReaction: PropTypes.func,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconSource: Image.propTypes.source,
  title: PropTypes.oneOfType([PropTypes.style, PropTypes.number]),
  renderTitle: PropTypes.bool,
  iconRef: PropTypes.any,
  onLayout: PropTypes.func,
};

export default TNTouchableIcon;
