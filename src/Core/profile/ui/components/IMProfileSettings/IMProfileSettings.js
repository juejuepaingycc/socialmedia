import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import authManager from '../../../../onboarding/utils/authManager';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../../localization/IMLocalization';
import RNRestart from 'react-native-restart';
import billManager from '../../../../../screens/billManager';
import moment from 'moment';

function IMProfileSettings(props) {
  const { navigation, onLogout, lastScreenTitle, appStyles, appConfig } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const onSettingsTypePress = async (
    type,
    routeName,
    form,
    screenTitle,
    phone,
  ) => {
    console.log("typePress>>"+ lastScreenTitle + " " +  type + "  "+ routeName + "  " + form + " " + screenTitle + "  " + phone);
    if (type === 'Log Out') {
      Alert.alert("", IMLocalized("Are you sure you want to logout?"), [
        {
          text: IMLocalized('No'),
          onPress: () => null,
          style: "cancel"
        },
        { text: IMLocalized('YesLogout'), onPress: () => {
          authManager.logout(props.user);
          onLogout();
          setTimeout(() => {
            RNRestart.Restart();
          }, 1000);
        } }
      ]);
    } else {
      console.log("Go to>>" + (lastScreenTitle + routeName))
      navigation.navigate(lastScreenTitle + routeName, {
        appStyles: appStyles,
        form,
        screenTitle,
        phone,
      });
    }
  };

  const renderSettingsType = ({
    type,
    routeName,
    form,
    screenTitle,
    phone,
  }) => (
    <TouchableOpacity
      style={styles.settingsTypeContainer}
      onPress={() => onSettingsTypePress(type, routeName, form, screenTitle)}>
      <Text style={styles.settingsType}>{IMLocalized(type)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingsTitleContainer}>
        <Text style={styles.settingsTitle}>{IMLocalized('GENERAL')}</Text>
      </View>
      <View style={styles.settingsTypesContainer}>
        {renderSettingsType({
          type: 'Account Details',
          routeName: 'EditProfile',
          form: appConfig.editProfileFields,
          screenTitle: IMLocalized('Edit Profile'),
        })}
        {renderSettingsType({
          type: 'Settings',
          routeName: 'AppSettings',
          form: appConfig.userSettingsFields,
          screenTitle: IMLocalized('User Settings'),
        })} 
        {/* {renderSettingsType({
          type: 'Contact Us',
          routeName: 'ContactUs',
          form: appConfig.contactUsFields,
          phone: appConfig.contactUsPhoneNumber,
          screenTitle: IMLocalized('Contact Us'),
        })} */}
        {renderSettingsType({ type: 'Log Out' })}
      </View>
    </View>
  );
}

IMProfileSettings.propTypes = {};

export default IMProfileSettings;
