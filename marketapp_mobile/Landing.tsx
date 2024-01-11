import React, {useEffect, useState} from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import { normalize } from './Profile';

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  wmLogo: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: 'rgb(185, 151, 91)',
    width: normalize(150),
    height: normalize(150),
  },
});

export default Landing;
