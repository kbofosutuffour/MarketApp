/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {normalize} from './Profile';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

function Landing(props): JSX.Element {

  return (
    <View
      style={{
        backgroundColor: 'rgb(17, 87, 64)',
        position: 'absolute',
        display: props.showLogin ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        zIndex: 3,
      }}>
      <View>
        <Image
          style={styles.wmLogo}
          source={require('./media/wm_logo_green.png')}
          width={50}
          height={50}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  landingContainer: {
    backgroundColor: 'rgb(17, 87, 64)',
    position: 'absolute',
    top: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: SCREEN_HEIGHT,
    zIndex: 0,
  },
  wmLogo: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: 'rgb(185, 151, 91)',
    width: normalize(150),
    height: normalize(150),
    overflow: 'hidden',
  },
});

export default Landing;
