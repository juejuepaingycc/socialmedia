/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { StyleSheet } from 'react-native';
import COLOR from './Color';
import {Scales, Colors} from '@common';

export default StyleSheet.create({
    safearea: {
        flex: 1,
    },
    aligncenter: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    container2: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    modalBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    innerContainer: {
        borderRadius: 10,
    },
    innerContainerTransparent: {
        backgroundColor: COLOR.WHITE,
        padding: 20,
    },
    appheader: {
        resizeMode: 'contain',
        height: 60,
        alignSelf: 'center',
    },
    loginform: {
        paddingHorizontal: 20,
        alignItems: 'stretch',
    },
    loginbutton: {
        color: COLOR.BUTTON,
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20,
        textAlign: 'center',
    },
    forminput: {
        padding: 5,
        marginBottom: 10,
        color: COLOR.ACCENT,
        height: 40,
        borderColor: COLOR.ACCENT,
        borderWidth: 1,
        borderRadius: 4,
    },
    useragent: {
        flex: 1,
       // flexDirection: 'column',
    },
    selfview: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 120,
        height: 150,
    },
    remotevideo: {
        flex: 1,
    },
    videoPanel: {
        flex: 1,
        position: 'relative',
    },
    call_controls2: {
        height: 70,
        position: 'absolute',
        bottom: 15,
        width: Scales.deviceWidth
    },
    call_controls: {
        height: 70,
    },
    margin: {
        margin: 10,
    },
    call_connecting_label: {
        fontSize: 18,
        alignSelf: 'center',
        textTransform: 'capitalize'
    },
    headerButton: {
        color: COLOR.WHITE,
        fontSize: 16,
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        textAlign: 'center',
    },
    incoming_call: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 22,
    },
    view2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 300
    },
    btnView: {
        height: 90,
        position: 'absolute',
        bottom: 10,
        width: Scales.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    desc: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingVertical: 17,
        color: 'white',
        textAlign: 'center'
    },
    ss: {
        flex: 1,
        //flexDirection: 'column',
        justifyContent: 'center',
        height: Scales.deviceHeight,
    },
    all: {
        //backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    backgroundImage: {
        flex: 1,
        flexDirection: 'column',
        resizeMode: 'cover', // or 'stretch',
        position: 'absolute',
        height: Scales.deviceHeight,
        //width: Scales.deviceWidth
      },
      topView: {
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          //height: Scales.deviceHeight,
      },
      avatar: {
          width: 110,
          height: 110,
          borderRadius: 80,
          marginTop: 100,
          alignSelf: 'center'
      }
});
