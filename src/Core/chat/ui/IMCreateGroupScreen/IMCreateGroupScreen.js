import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler, ToastAndroid, Alert } from 'react-native';
import TextButton from 'react-native-button';
import { connect } from 'react-redux';
import { IMCreateGroupComponent } from '../..';
import { channelManager } from '../../firebase';
import { IMLocalized } from '../../../localization/IMLocalization';
import AppStyles from '../../../../AppStyles';
import {
  TNActivityIndicator
} from '../../../../Core/truly-native';
import { setChannels } from '../../redux';

class IMCreateGroupScreen extends Component {
  static navigationOptions = ({ screenProps, navigation }) => {
    //let appStyles = navigation.state.params.appStyles;
    let appStyles = AppStyles;
    let currentTheme = AppStyles.navThemeConstants['light'];
    const { params = {} } = navigation.state;

    return {
      headerTitle: IMLocalized('Choose People'),
      headerTitleStyle: {
        fontFamily: appStyles.customFonts.klavikaMedium
      },
      headerRight:
        (params.onCreate != null && params.oldGroup) ?
          <TextButton style={{ marginHorizontal: 7, 
          fontFamily: appStyles.customFonts.klavikaMedium }} onPress={params.onAdd}>
            {IMLocalized('OK')}
          </TextButton>
          :
          <TextButton style={{ marginHorizontal: 7, 
            fontFamily: appStyles.customFonts.klavikaMedium }} onPress={params.onCreate}>
              {IMLocalized('Create')}
            </TextButton> 
,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.appStyles = this.props.navigation.getParam('appStyles');
    this.oldGroup = this.props.navigation.getParam('oldGroup');
    this.members = this.props.navigation.getParam('members');
    this.channel = this.props.navigation.getParam('channel');
    this.state = {
      friends: this.props.friends,
      isNameDialogVisible: false,
      groupName: '',
      loading: false
    };
    if(this.oldGroup){
      let tempFriends = this.props.friends.map((friend)=> {
        let tempArr = this.members.filter((member) => friend.id == member.id)
        if(tempArr.length > 0){
          friend['checked'] = false;
          friend['disable'] = true;
          return friend;
        }
        else{
          friend['checked'] = false;
          friend['disable'] = false;
          return friend;
        }
      })
      setTimeout(()=> {
        //console.log("All Filter Friends>>" + JSON.stringify(tempFriends));
        this.setState({ friends: tempFriends });
      }, 500)
    }
    else{
      let tempFriends = this.props.friends.map((friend)=> {
          friend['checked'] = false;
          friend['disable'] = false;
          return friend;
      })
      setTimeout(()=> {
        this.setState({ friends: tempFriends });
        //console.log("Original Friends>>" + JSON.stringify(tempFriends));
      }, 500)
    }

    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onCreate: this.props.friends.length > 1 ? this.onCreate : null,
      onAdd: this.onAdd,
      oldGroup: this.oldGroup
    });

    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onAdd = () => {
    this.setState({ loading: true })
    const checkedFriends = this.state.friends.filter(
      (friend) => friend.checked,
    );
    if (checkedFriends.length === 0) {
      this.setState({ loading: false })
      this.props.navigation.goBack();
    } else {
      //console.log("New Members>>" + JSON.stringify(checkedFriends));
      channelManager
      .addMember(this.channel.id, checkedFriends,
      ({ success, error }) => {
        if (success) {
          this.setState({ loading: false })
          ToastAndroid.show('Added new members', ToastAndroid.SHORT)

 
          let temp = this.props.channels.map((channel) => {
            if(channel.id == this.channel.id){
              console.log("Channel matched...");
              // let filterUsers = channel.participants.filter((participant) => participant.id != item.id)
              // channel.participants = filterUsers; 
              channel.participants = [...channel.participants, ...checkedFriends]
              return channel;
            }
            else{
              return channel;
            }
          })
          this.props.setChannels(temp);
          this.props.navigation.goBack();
        }
        else{
          this.setState({ loading: false })
          ToastAndroid.show(IMLocalized('An error occured, please try gain.'), ToastAndroid.SHORT)
        }
      })
    }
  }

  onCreate = () => {
    const checkedFriends = this.state.friends.filter(
      (friend) => friend.checked,
    );
    if (checkedFriends.length === 0 || checkedFriends.length === 1) {
      //alert('Choose at least 2 friends to create a group');
      Alert.alert(
        '',
        IMLocalized('Choose at least 2 friends to create a group'),
        [
          { text: IMLocalized('No') },
          {
            text: IMLocalized('YesExit'),
          }
        ],
        { cancelable: true },
      );
    } else {
      this.setState({ isNameDialogVisible: true });
    }
  };

  onCheck = (friend) => {
    if(!friend.disable){
      friend.checked = !friend.checked;
      const newFriends = this.state.friends.map((item) => {
        if (item.id == friend.id) {
          return friend;
        }
        return item;
      });
      this.setState({ friends: newFriends });
    }
  };

  onCancel = () => {
    this.setState({
      groupName: '',
      isNameDialogVisible: false,
      friends: this.props.friends,
    });
  };

  onSubmitName = (name) => {
    this.setState({ loading: true })
    const self = this;
    const { friends } = this.state;
    const participants = friends.filter((friend) => friend.checked);
    if (participants.length < 2) {
      this.setState({ loading: false })
      //alert(IMLocalized('Choose at least 2 friends to create a group.'));
      Alert.alert(
        '',
        IMLocalized('Choose at least 2 friends to create a group'),
        [
          { text: IMLocalized('No') },
          {
            text: IMLocalized('YesExit'),
          }
        ],
        { cancelable: true },
      );
      
      return;
    }
    channelManager
      .createChannel(self.props.user, participants, name, true)
      .then((response) => {
        this.setState({ loading: false })
        if (response.success == true) {
          self.onCancel();
          self.props.navigation.goBack();
        }
      });
  };

  onEmptyStatePress = () => {
    this.props.navigation.goBack();
  };

  render() {
    if(this.state.loading){
      return <TNActivityIndicator appStyles={AppStyles} />
    }
    else{
      return (
        <IMCreateGroupComponent
          onCancel={this.onCancel}
          isNameDialogVisible={this.state.isNameDialogVisible}
          friends={this.state.friends}
          onSubmitName={this.onSubmitName}
          onCheck={this.onCheck}
          appStyles={this.appStyles}
          onEmptyStatePress={this.onEmptyStatePress}
          oldGroup={this.oldGroup}
          members={this.members}
        />
      );
    }
  }
}

IMCreateGroupScreen.propTypes = {
  friends: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = ({ friends, auth, chat }) => {
  return {
    channels: chat.channels,
    friends: friends.friends,
    user: auth.user,
  };
};

export default connect(mapStateToProps, { setChannels })(IMCreateGroupScreen);
