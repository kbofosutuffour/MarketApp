import React from 'react';

import {Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
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

/**
 * An attempt to make the height of each page
 * consistent.
 * @param height the screen height of the phone
 * @returns the height needed for the phone screens
 */
function filterHeight(height: number) {
  if (height < 600) {
    return SCREEN_HEIGHT * 0.75;
  } else if (height < 716) {
    return SCREEN_HEIGHT * 0.765;
  } else if (height < 780) {
    return SCREEN_HEIGHT * 0.8;
  }
}

function Footer(props: any): JSX.Element {
  //Footer component that is displayed on various screens
  return (
    <View style={{display: 'flex', flexDirection: 'column'}}>
      <View style={styles.goldBar} />
      <View style={styles.footer}>
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
              props.hasLoaded && props.type === 'Home'
                ? 'rgb(185, 151, 91)'
                : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback
            onPress={props.returnHome}
            disabled={!props.hasLoaded}>
            <View>
              {props.hasLoaded && (
                <Image source={require('./media/home-05.png')} />
              )}
            </View>
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
              props.hasLoaded && props.type === 'Chats'
                ? 'rgb(185, 151, 91)'
                : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback
            onPress={props.viewChats}
            disabled={!props.hasLoaded}>
            <View>
              {props.hasLoaded && (
                <Image source={require('./media/message-chat-square.png')} />
              )}
              {/* TODO: Implement chat notifications
              {props.chatNotifications !== 0 && (
                <Text style={styles.chatNotification}>
                  {props.chatNotifications}
                </Text>
              )} */}
            </View>
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
              props.hasLoaded && props.type === 'Profile'
                ? 'rgb(185, 151, 91)'
                : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback
            onPress={props.viewProfile}
            disabled={!props.hasLoaded}>
            <View>
              {props.hasLoaded && (
                <Image source={require('./media/user-01.png')} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    display: 'flex',
    backgroundColor: 'rgb(17, 87, 64)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 40,
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    padding: 10,
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '1%',
  },
  chatNotification: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'orange',
    color: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
    height: 20,
    width: 20,
    fontSize: 15,
  },
});

export default Footer;
