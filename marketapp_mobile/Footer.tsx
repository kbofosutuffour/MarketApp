import React from 'react';

import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

function normalize(size: any) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

function Footer(props: any): JSX.Element {
  //Footer component that is displayed on various screens
  return (
    <View
      style={
        props.type !== 'Chats'
          ? styles.footerContainer
          : styles.chatFooterContainer
      }>
      <View style={styles.goldBar} />
      <View style={props.type !== 'Chats' ? styles.footer : styles.chatFooter}>
        <View // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:
              props.type === 'Home' ? 'rgb(185, 151, 91)' : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback onPress={props.returnHome}>
            <Image source={require('./media/home-05.png')} />
          </TouchableWithoutFeedback>
        </View>
        <View // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:
              props.type === 'Chats' ? 'rgb(185, 151, 91)' : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback onPress={props.viewChats}>
            <Image source={require('./media/message-chat-square.png')} />
          </TouchableWithoutFeedback>
        </View>
        <View // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:
              props.type === 'Profile'
                ? 'rgb(185, 151, 91)'
                : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback onPress={props.viewProfile}>
            <Image source={require('./media/user-01.png')} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatFooterContainer: {
    flex: 1,
    backgroundColor: 'rgb(17, 87, 64)',
    height: '2.5%',
  },
  footer: {
    display: 'flex',
    backgroundColor: 'rgb(17, 87, 64)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 40,
    position: 'absolute',
    width: '100%',
    height: SCREEN_HEIGHT * 0.1,
  },
  chatFooter: {
    display: 'flex',
    width: '100%',
    zIndex: 3,
    backgroundColor: 'rgb(17, 87, 64)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 40,
    paddingTop: 10,
    paddingBottom: 10,
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '1%',
  },
});

export default Footer;
