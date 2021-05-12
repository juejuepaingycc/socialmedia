import React from 'react';
import { ToastAndroid, TouchableOpacity, BackHandler, Image, Text, View } from 'react-native';
import { Scales } from '@common';
import { FlatList } from 'react-native';
import { IMLocalized, setI18nConfig } from './src/Core/localization/IMLocalization';
import { connect } from 'react-redux'
import { setLanguage } from './src/actions';
import AppStyles from './src/AppStyles';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Language extends React.Component {

  static navigationOptions = ({ navigation }) => {
    let appStyles = AppStyles;
    let currentTheme = AppStyles.navThemeConstants['light'];

    return {
      headerTitle: IMLocalized('Language'),
      headerTitleStyle: {
        fontFamily: appStyles.customFonts.klavikaMedium
      },
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' size={23} style={{ marginLeft: 16 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props){
    super(props);
    this.didFocusSubscription = this.props.navigation.addListener('didFocus',() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
    });
  }

  componentDidMount(){
    this.willBlurSubscription = this.props.navigation.addListener('willBlur',() => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      )
      })
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  changeLanguage = (item) => {
    setI18nConfig(item.label);
    this.props.setLanguage(item.label)
    AsyncStorage.setItem('languageAsync', item.label);
    RNRestart.Restart();
  }

  render(){

    const languages = [
      {
        img: require('./assets/icons/mm.png'),
        name: 'Myanmar',
        label: 'MM'
      },
      {
        img: require('./assets/icons/cn.png'),
        name: 'Mainland China',
        label: 'CN'
      },
      {
        img: require('./assets/icons/en.png'),
        name: 'English',
        label: 'EN'
      },
      {
        img: require('./assets/icons/th.png'),
        name: 'Thailand',
        label: 'TH'
      },
      {
        img: require('./assets/icons/kh.png'),
        name: 'Cambodia',
        label: 'KH'
      },
      // {
      //   img: require('./assets/icons/tw.png'),
      //   name: 'Taiwan',
      //   label: 'TW'
      // },
    ]

    

    return (
      <View style={{ marginHorizontal: 40, marginTop: 20 }}>
        <Text style={{ fontSize: 23, paddingBottom:20, fontFamily: AppStyles.customFonts.klavikaMedium }}>
        {IMLocalized('Change Language')}
        </Text>
        <FlatList
        data={languages}
        keyExtractor={(item, index) => index.toString()}
        //renderItem={this._renderItem}
        renderItem={({ item }) => (

      <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 10 }} onPress={() => this.changeLanguage(item)}>
        <Image source={item.img} style={{ width: Scales.deviceWidth * 0.14, 
          height: Scales.deviceWidth * 0.12, borderRadius: 5 }} />
        <Text style={{ fontSize: 17, paddingLeft: 10, paddingTop: 9 }}>
          {item.name}
        </Text>
      </TouchableOpacity>
        )}
      />
    </View>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
      setLanguage: (language) => dispatch(setLanguage(language)),
  }
}

export default connect(null, mapDispatchToProps)(Language)
