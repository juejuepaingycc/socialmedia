
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

function ThreadOptionsItem(props) {
    const {
      items
    } = props;

    return(
        <View style={styles.row}>
            {
                items.map((item) => {
                    return (
                        <TouchableOpacity onPress={item.pressMenu} style={{ alignItems: 'center' }}>
                            {
                                item.icon == 'message-minus-outline' && (
                                    <MCIcon name={item.icon} color='#9b9d9e' size={30} />
                                )}
                            {
                                item.icon == 'forward' && (
                                    <EntypoIcon name={item.icon} color='#9b9d9e' size={30} />
                                )}
                            {
                                item.icon != 'message-minus-outline' && item.icon != 'forward' && (
                                    <MaterialIcon name={item.icon} color='#9b9d9e' size={26} />
                                )}
                            <Text style={styles.text}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                })
            }

        </View>
    )

}

export default ThreadOptionsItem;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 5
    },
    text: {
        color: '#9b9d9e',
        fontSize: 14
    }

})