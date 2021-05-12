import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import SplashScreen from 'react-native-splash-screen';

export default class FBLoginButton extends Component {
  state = {userInfo: {}};

  componentDidMount(){
    SplashScreen.hide();
  }

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'email, id, name,  first_name, last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({userInfo: result});
          console.log('result:', result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  render() {
    return (
      <View style={{flex: 1, margin: 50}}>
        <LoginButton
         publishPermissions={["public_profile, email"]}
          onLoginFinished={(error, result) => {
            console.log("onLoginFinish...")
            if (error) {
              console.log('login has error: ' + JSON.stringify(error));
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              console.log('ELse.');
              AccessToken.getCurrentAccessToken().then(data => {
                console.log("result>>"+ JSON.stringify(data))
                const accessToken = data.accessToken.toString();
                console.log("accessToken>>"+ accessToken);
                this.getInfoFromToken(accessToken);
              });
            }
          }}
          onLogoutFinished={() => this.setState({userInfo: {}})}
        />
        {this.state.userInfo.name && (
          <Text style={{fontSize: 16, marginVertical: 16}}>
            Logged in As {this.state.userInfo.name}
          </Text>
        )}
      </View>
    );
  }
}