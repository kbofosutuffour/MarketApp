/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function ProductDescription(props: {
  post: {
    image: ImageSourcePropType;
    product:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | null
      | undefined;
    username:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | null
      | undefined;
    price:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | null
      | undefined;
    display_image: string;
    description: string;
  };
  returnHome: any;
}): JSX.Element {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    let request = 'http://10.0.2.2:8000/profile/' + props.post.username;
    axios
      .get(request)
      .then(res => {
        setProfile(res.data);
        console.log(res.data);
      })
      .catch((err: any) => console.log(err));
  }, []);

  const backgroundStyle = {
    backgroundColor: 'rgb(17, 87, 64)',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <TouchableWithoutFeedback onPress={props.returnHome}>
        <View style={styles.returnHome}>
          <Image
            source={require('./media/home.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              zIndex: 3,
              backgroundColor: 'rgb(185, 151, 91)',

            }}
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.pdContainer}>
        <View style={styles.image}>
          <Image
            source={{uri: props.post.display_image}}
            style={styles.displayImage}
          />
        </View>
        <View style={styles.description}>
          <View style={styles.profile}>
            <Image
              source={{uri: profile.profile_picture}}
              style={styles.profilePicture}
            />
            <Text>{profile.username}</Text>
          </View>
          <View style={{padding: 10}}>
            <Text>{props.post.product}</Text>
            <Text>{props.post.description}</Text>
            <Text>${props.post.price}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pdContainer: {
    display: 'flex',
    flexDirection: 'column',
    columnGap: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '50%',
    backgroundColor: 'rgb(17, 87, 64)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    width: '100%',
    height: '50%',
    backgroundColor: Colors.white,
  },
  displayImage: {
    width: '90%',
    height: '90%',
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 20,
    padding: 10,
    borderBottomColor: 'gray',
    borderWidth: 0.5,
  },
  profilePicture: {
    backgroundColor: 'gray',
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  returnHome: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgb(185, 151, 91)',
    borderRadius: 10,
    left: 30,
    top: 30,
    zIndex: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDescription;
