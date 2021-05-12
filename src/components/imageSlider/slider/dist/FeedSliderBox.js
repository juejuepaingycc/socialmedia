import React, {Component} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Entypo';
import Carousel, {Pagination} from 'react-native-snap-carousel'; //Thank From distributer(s) of this lib
import styles from './FeedSliderBox.styles';

// -------------------Props---------------------
// images
// onCurrentImagePressed
// sliderBoxHeight
// parentWidth
// dotColor
// inactiveDotColor
// dotStyle
// paginationBoxVerticalPadding
// circleLoop
// autoplay
// ImageComponent
// paginationBoxStyle
// resizeMethod
// resizeMode
// ImageComponentStyle,
// imageLoadingColor = "#E91E63"

const width = Dimensions.get('window').width;

export class FeedSliderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: 0,
      loading: [],
    };
    this.onCurrentImagePressedHandler = this.onCurrentImagePressedHandler.bind(
      this,
    );
    this.onSnap = this.onSnap.bind(this);
  }
  componentDidMount() {
    let a = [...Array(this.props.images.length).keys()].map(i => false);
  }
  onCurrentImagePressedHandler() {
    if (this.props.onCurrentImagePressed) {
      this.props.onCurrentImagePressed(this.state.currentImage);
    }
  }

  onSnap(index) {
    const {currentImageEmitter} = this.props;
    this.setState({currentImage: index}, () => {
      if (currentImageEmitter) currentImageEmitter(this.state.currentImage);
    });
  }
  
  downloadMedia = (url) => {
  let imgUrl = url;
  let firstImgUri = imgUrl.lastIndexOf('/');
  let lastImgUri = imgUrl.indexOf('?');
  let imageName = imgUrl.substring(firstImgUri, lastImgUri);
  console.log("imageName>>"+ imageName);

  let append = imageName.substring(imageName.indexOf('.'))

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

  renderDownloadButton = (uri) => {
    return (
      <TouchableOpacity
      onPress={() => this.downloadMedia(uri)}
      style={styles.dButton}>
        <Icon name={'download'} size={40} color='#51585c' />
      </TouchableOpacity>
    )
  }

  _renderItem({item, index}) {
    const {
      ImageComponent,
      ImageComponentStyle = {},
      sliderBoxHeight,
      disableOnPress,
      resizeMethod,
      resizeMode,
      imageLoadingColor = '#E91E63',
    } = this.props;
    return (
      <View
        style={{
          // position: 'relative',
           justifyContent: 'center',
        }}>
        <TouchableOpacity
        onPress={() => this.downloadMedia(item)}
        style={styles.dButton}>
          <Icon name={'download'} size={40} color='#51585c' />
        </TouchableOpacity>
        <TouchableWithoutFeedback
          key={index}
          onPress={() =>
            !disableOnPress && this.onCurrentImagePressedHandler()
          }>
          <ImageComponent
            style={[
              {
                width: '90%',
                alignSelf: 'center',
              },
              ImageComponentStyle,
            ]}
            source={{uri: item}}
            resizeMethod={resizeMethod}
          //  resizeMode={resizeMode || 'cover'}
            onLoad={() => {}}
            onLoadStart={() => {}}
            onLoadEnd={() => {
              let t = this.state.loading;
              t[index] = true;
              this.setState({loading: t});
            }}
            {...this.props}
          />
        </TouchableWithoutFeedback>
        {!this.state.loading[index] && (
          <ActivityIndicator
            size="large"
            color={imageLoadingColor}
            style={{
              position: 'absolute',
              alignSelf: 'center',
            }}
          />
        )}
      </View>
    );
  }

  get pagination() {
    const {currentImage} = this.state;
    const {
      images,
      dotStyle,
      dotColor,
      inactiveDotColor,
      paginationBoxStyle,
      paginationBoxVerticalPadding,
    } = this.props;
    return (
      <Pagination
        borderRadius={2}
        dotsLength={images.length}
        activeDotIndex={currentImage}
        dotStyle={dotStyle || styles.dotStyle}
        dotColor={dotColor || colors.dotColors}
        inactiveDotColor={inactiveDotColor || colors.white}
        inactiveDotScale={0.8}
        carouselRef={this._ref}
        inactiveDotOpacity={0.8}
        tappableDots={!!this._ref}
        containerStyle={[
          styles.paginationBoxStyle,
          paginationBoxVerticalPadding
            ? {paddingVertical: paginationBoxVerticalPadding}
            : {},
          paginationBoxStyle ? paginationBoxStyle : {},
        ]}
        {...this.props}
      />
    );
  }

  render() {
    const {
      images,
      circleLoop,
      autoplay,
      parentWidth,
      loopClonesPerSide,
    } = this.props;
    return (
      <View>
        <Carousel
          layout={'default'}
          data={images}
          ref={c => (this._ref = c)}
          loop={circleLoop || false}
          enableSnap={true}
          autoplay={autoplay || false}
          itemWidth={parentWidth || width}
          sliderWidth={parentWidth || width}
          loopClonesPerSide={loopClonesPerSide || 5}
          renderItem={item => this._renderItem(item)}
          onSnapToItem={index => this.onSnap(index)}
          {...this.props}
        />
        {images.length > 1 && this.pagination}
      </View>
    );
  }
}

const colors = {
  dotColors: '#BDBDBD',
  white: '#FFFFFF',
};

FeedSliderBox.defaultProps = {
  ImageComponent: Image,
};
