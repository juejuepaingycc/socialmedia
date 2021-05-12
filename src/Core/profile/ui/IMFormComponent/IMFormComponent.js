import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/MaterialIcons'
import dynamicStyles from './styles';
//import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../localization/IMLocalization';

function IMFormComponent(props) {
  const {
    form,
    initialValuesDict,
    onFormChange,
    onFormButtonPress,
    appStyles,
  } = props;
  const colorScheme = 'light';
  const styles = dynamicStyles(appStyles, colorScheme);

  const [alteredFormDict, setAlteredFormDict] = useState({});

  const onFormFieldValueChange = (formField, value) => {
    var newFieldsDict = alteredFormDict;
    //console.log("alteredFormDict>>"+ JSON.stringify(alteredFormDict));
    newFieldsDict[formField.key] = value;
    setAlteredFormDict(newFieldsDict);
    onFormChange(newFieldsDict);
  };

  const renderSwitchField = (switchField) => {
    return (
      <View
        style={[styles.settingsTypeContainer, styles.appSettingsTypeContainer, 
        { borderBottomColor: appStyles.colorSet[colorScheme].whiteSmoke,
          borderBottomWidth: 1, }]}>
        <Text style={styles.text}>{IMLocalized(switchField.displayName)}</Text>
        <Switch
          value={computeValue(switchField)}
          onValueChange={(value) => onFormFieldValueChange(switchField, value)}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    );
  };

  const renderTextField = (formTextField, index, totalLen, edit) => {
    return (
      <View>
        <View
          style={[
            styles.settingsTypeContainer,
            styles.appSettingsTypeContainer,
          ]}>
          <Text style={styles.text}>{IMLocalized(formTextField.displayName)}</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={[styles.text, { textAlign: 'right' }]}
            editable={formTextField.editable}
            onChangeText={(text) => {
              onFormFieldValueChange(formTextField, text);
            }}
            editable={edit}
            placeholderTextColor={styles.placeholderTextColor}
            placeholder={IMLocalized(formTextField.placeholder)}
            value={computeValue(formTextField)}
          />
        </View>
        {index < totalLen - 1 && <View style={styles.divider} />}
      </View>
    );
  };

  const renderButtonField = (buttonField) => {
    return (
      <TouchableOpacity
        onPress={() => onFormButtonPress(buttonField)}
        style={[styles.settingsTypeContainer, styles.appSettingsSaveContainer]}>
          <Text style={styles.settingsType}>{IMLocalized(buttonField.displayName)}</Text>
      </TouchableOpacity>
    );
  };

  const onSelectFieldPress = (selectField, ref) => {
    ref.current.show();
  };

  const onActionSheetValueSelected = (selectField, selectedIndex) => {
    if (selectedIndex < selectField.displayOptions.length) {
      const newValue = selectField.displayOptions[selectedIndex];
      onFormFieldValueChange(selectField, IMLocalized(newValue));
    }
  };

  const renderSelectField = (selectField) => {
    const actionSheetRef = React.createRef();
    let lanOptions = selectField.displayOptions.map((option) => {
      return IMLocalized(option);
    })
    return (
      <TouchableOpacity
        onPress={() => onSelectFieldPress(selectField, actionSheetRef)}
        style={[styles.settingsTypeContainer, styles.appSettingsTypeContainer]}>
        <Text style={styles.text}>{IMLocalized(selectField.displayName)}</Text>
        <View style={styles.select}>
          {/* {
            alteredFormDict.rsStatus && ( */}
          <Text style={styles.text}>{computeValue(selectField)}</Text>
           
          <Icon name='arrow-drop-down' size={25}  />
        </View>

        <ActionSheet
          ref={actionSheetRef}
          title={IMLocalized(selectField.displayName)}
          options={[...lanOptions, IMLocalized('CancelTransfer')]}
          cancelButtonIndex={selectField.displayOptions.length}
          onPress={(selectedIndex) =>
            onActionSheetValueSelected(selectField, selectedIndex)
          }
        />
      </TouchableOpacity>
    );
  };

  const renderField = (formField, index, totalLen, edit) => {
    const type = formField.type;
    if (type == 'text') {
      return renderTextField(formField, index, totalLen, edit);
    }
    if (type == 'switch') {
      return renderSwitchField(formField);
    }
    if (type == 'button') {
      return renderButtonField(formField);
    }
    if (type == 'select') {
      return renderSelectField(formField);
    }
    return null;
  };

  const renderSection = (section) => {
    return (
      <View>
        <View style={styles.settingsTitleContainer}>
          <Text style={styles.settingsTitle}>{IMLocalized(section.title)}</Text>
        </View>
        {
              section.title == 'PRIVATE DETAILS' ?
              <View style={styles.contentContainer}>
              {section.fields.map((field, index) =>
                  renderField(field, index, section.fields.length, false)     
              )}
            </View>
              :
              <View style={styles.contentContainer}>
              {section.fields.map((field, index) =>
                  renderField(field, index, section.fields.length, true)     
              )}
            </View>
        }
      </View>
    );
  };

  const displayValue = (field, value) => {
   // console.log("field>>" + JSON.stringify(field));
    //console.log("Value>>" + value);
    if (!field.displayOptions || !field.options) {
      return value;
    }
    for (var i = 0; i < field.displayOptions.length; ++i) {
      if (i < field.displayOptions.length && field.displayOptions[i] == value) {
        return field.displayOptions[i];
      }
    }
    return value;
  };

  const computeValue = (field) => {
    // console.log("FIeld>>"+ JSON.stringify(field));
    // console.log("alteredFormDict>>"+ JSON.stringify(alteredFormDict));
    // console.log("initialValuesDict>>"+ JSON.stringify(initialValuesDict))
    if (alteredFormDict[field.key] != null) {
      return displayValue(field, alteredFormDict[field.key]);
    }
    if (initialValuesDict[field.key] != null) {
      return displayValue(field, initialValuesDict[field.key]);
    }
    return displayValue(field, field.value);
  };

  return (
    <View style={styles.container}>
      {form.sections.map((section) => renderSection(section))}
    </View>
  );
}

IMFormComponent.propTypes = {
  onFormChange: PropTypes.func,
};

export default IMFormComponent;
