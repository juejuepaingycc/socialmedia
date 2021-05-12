import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMLocalized } from '../../localization/IMLocalization';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const WHITE = '#ffffff';
const BORDER_COLOR = '#DBDBDB';

const CustomActionSheet = (props) => {
  const actionSheetItems = [
    ...props.actionItems,
  ]

  const pressMenu2 = () => {
    console.log("ff>>");
  // alert("dfdff")
    //pressMenu(actionItem)
  }

  return (
    <View style={styles.modalContent}>

    {/* {
      props.disableTitle && ( */}
        {/* <View style={styles.title}>
          <Text style={styles.titleText}>
          {props.title}
          </Text>
        </View> */}
      {/* )
    } */}

      
      {
        props.title == 'Upload'
        ?
        <View>
        {
                actionSheetItems.map((actionItem, index) => {
                  return (
                    <TouchableOpacity
                    onPress={() => props.pressMenu(actionItem)}
                      style={[
                        styles.actionSheetView,
                        index === actionSheetItems.length - 1 && {
                          borderBottomWidth: 0,
                          backgroundColor: WHITE,
                          borderBottomLeftRadius: 12,
                          borderBottomRightRadius: 12,
                        },
                        index === 0 && {
                          backgroundColor: WHITE,
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }
                      ]}
                      underlayColor={'#f7f7f7'}
                      key={index} 
                    //onPress={actionItem.onPress}
                    >
                      <Text allowFontScaling={false}
                        style={[
                          styles.actionSheetText,
                          props?.actionTextColor && {
                            color: props?.actionTextColor
                          },
                        ]}>
                        {actionItem.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
                </View>
        :
        <View>
{
        actionSheetItems.map((actionItem, index) => {
          return (
            <TouchableOpacity
            onPress={() => props.pressMenu(actionItem)}
              style={[
                styles.actionSheetView,
                index === actionSheetItems.length - 2 && {
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
                index === actionSheetItems.length - 1 && {
                  borderBottomWidth: 0,
                  backgroundColor: WHITE,
                  marginTop: 8,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }]}
              underlayColor={'#f7f7f7'}
              key={index} 
            //onPress={actionItem.onPress}
            >
              <Text allowFontScaling={false}
                style={[
                  styles.actionSheetText,
                  props?.actionTextColor && {
                    color: props?.actionTextColor
                  },
                  index === actionSheetItems.length - 1 && {
                    color: '#fa1616',
                  }
                ]}>
                {actionItem.label}
              </Text>
            </TouchableOpacity>
          )
        })
      }
        </View>
      }

     
    </View>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
    borderWidth: 0.4,
    borderColor: '#d7dcde'
  },
  actionSheetText: {
    fontSize: 16,
    color: '#3494c7'
  },
  actionSheetView: {
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.4,
    borderColor: BORDER_COLOR
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 1
  },
  titleText: {
    color: '#afb3b3',
    fontWeight: 'bold',
    fontSize: 13,
    paddingVertical: 8
  }
});
/* 
CustomActionSheet.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      onPress: PropTypes.func
    })
  ).isRequired,
  onCancel: PropTypes.func,
 pressMenu: PropTypes.func,
  actionTextColor: PropTypes.string
}


CustomActionSheet.defaultProps = {
  actionItems: [],
  onCancel: () => { },
  pressMenu: () => { },
  actionTextColor: null
}
 */

export default CustomActionSheet;