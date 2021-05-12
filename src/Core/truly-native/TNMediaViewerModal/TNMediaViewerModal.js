import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import styles from './styles';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob'
import IconFeather from 'react-native-vector-icons/Feather';
import ImageZoom from 'react-native-image-pan-zoom';

const Image = createImageProgress(FastImage);

const { width, height } = Dimensions.get('window');
const swipeArea = Math.floor(height * 0.2);
const circleSnailProps = { thickness: 1, color: '#ddd', size: 80 };

const downloadMedia = (url) => {
  let imgUrl = url;
  let firstImgUri = imgUrl.lastIndexOf('/');
  let lastImgUri = imgUrl.indexOf('?');
  let imageName = imgUrl.substring(firstImgUri, lastImgUri);
  console.log("imageName>>"+ imageName);

  let append = imageName.substring(imageName.indexOf('.'))
  console.log("append>>"+ append);

  let dirs = RNFetchBlob.fs.dirs;
  let path = dirs.PictureDir + imageName;
  console.log("Path>>"+ path);

  RNFetchBlob.config({
    fileCache: true,
    appendExt: append,
    indicator: true,
    path: path,
    addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Image'
     },
    }).fetch("GET", imgUrl).then(res => { 
           console.log(res, 'end downloaded') 
  });

}

export default class TNMediaViewerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calcImgHeight: Math.floor(height * 0.6)
    };
    this.imageLoading = false;
    this.imageDoneLoading = false;
    this.mediaLayouts = [];
    this.scrollviewRef = React.createRef();
  }

  onScrollView = (scrollviewRef) => {
    setTimeout(() => {
      if (scrollviewRef) {
        scrollviewRef.scrollTo({
          y: 0,
          x: this.mediaLayouts[this.props.selectedMediaIndex],
          animated: false,
        });
      }
    }, 50);
  };

  onImageLoad = (evt) => {
    const ImageHeight = evt.nativeEvent?.source?.height;
    const ImageWidth = evt.nativeEvent?.source?.width;

    const newHeight = Math.floor((ImageHeight / ImageWidth) * width);

    if (newHeight) {
      this.setState({
        calcImgHeight: newHeight,
      });
    }
  };

  renderCloseButton() {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={this.props.onClosed}>
        <View
          style={[styles.closeCross, { transform: [{ rotate: '45deg' }] }]}
        />
        <View
          style={[styles.closeCross, { transform: [{ rotate: '-45deg' }] }]}
        />
      </TouchableOpacity>
    );
  }

  renderDownloadButton(index) {
    return (
      <TouchableOpacity
      onPress={() => downloadMedia(this.props.mediaItems[index])}
      style={styles.dButton}>
      <IconFeather name={'download'} size={40} color='white' />
      </TouchableOpacity>
    )
  }

  render() {
    const { isModalOpen, onClosed } = this.props;
    const { calcImgHeight } = this.state;
    return (
      <Modal
        style={styles.container}
        isOpen={isModalOpen}
        onClosed={onClosed}
        position="center"
        swipeToClose
        swipeArea={swipeArea}
        swipeThreshold={4}
        coverScreen={true}
        backButtonClose={true}
        useNativeDriver={Platform.OS === 'android' ? true : false}
        animationDuration={500}>
        {this.renderCloseButton()}

        

        <ScrollView
          ref={this.onScrollView}
          style={{ flex: 1 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}>
          {this.props.mediaItems.length > 0 &&
            this.props.mediaItems.map((uri, index) => (
              <View
                key={index}
                style={styles.container}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  this.mediaLayouts[index] = layout.x;
                }}>
                {this.renderDownloadButton(index)}

                <ImageZoom
                cropWidth={Dimensions.get('window').width}
                cropHeight={calcImgHeight}
                imageWidth={Dimensions.get('window').width}
                imageHeight={calcImgHeight} 
                >  
                  <Image
                    source={{
                      uri: uri
                    }}
                    style={[styles.deck, { height: calcImgHeight }]}
                    indicatorProps={circleSnailProps}
                    resizeMode={'contain'}
                    onLoad={() => this.onImageLoad}
                  />
                </ImageZoom>

              </View>
            ))}
        </ScrollView>
      </Modal>
    );
  }
}

TNMediaViewerModal.propTypes = {
  mediaItems: PropTypes.array,
  onClosed: PropTypes.func,
  isModalOpen: PropTypes.bool,
};
