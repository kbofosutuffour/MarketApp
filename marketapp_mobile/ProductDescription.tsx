/* eslint-disable react-native/no-inline-styles */
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

/**
 * @returns Screen that shows a description of a post passed through the props object
 */
function ProductDescription(props): JSX.Element {
  const [profile, setProfile] = useState({});
  const [liked, likePost] = useState(false);

  // After the page renders, retrieve information on the user
  // who created the post from the database, stored in the preceeding
  // state variable
  useEffect(() => {
    let request = 'http://10.0.2.2:8000/profile/' + props.post.username;
    axios
      .get(request)
      .then(res => {
        setProfile(res.data);
      })
      .catch((err: any) => console.log(err));
    axios
      .get(
        'http://10.0.2.2:8000/profiles/get_liked_posts/' + props.current_user,
      )
      .then(res => {
        likePost(
          res.data.liked_posts && res.data.liked_posts.includes(props.post.id)
            ? true
            : false,
        );
      })
      .catch((err: any) => console.log(err));
  }, []);

  /**
   * @param buyer the username of the buyer
   * @param bpf the profile picture of the buyer
   * @param seller the username of the seller
   * @param spf the profile picture of the seller
   * @param product the name of the product being discussed
   * @param image the display image of the product
   */
  var getChats = (buyer, bpf, seller, spf, product, image) => {
    let data = new FormData();
    data.append('buyer', buyer);
    data.append('buyer_profile_picture', bpf);
    data.append('seller', seller);
    data.append('seller_profile_picture', spf);
    data.append('product', product);
    data.append('image', image);
    console.log(data);

    axios
      .post('http://10.0.2.2:8000/rooms/', data)
      .then(res => {
        console.log(res.data);
        props.viewChats();
      })
      .catch((err: any) => console.log(err));
  };

  const like_viewed_post = async (id, profile) => {
    let previous_posts = profile.liked_posts;
    let data = {
      username: profile.username,
      liked_posts: id,
    };
    axios
      .patch(
        'http://10.0.2.2:8000/edit_profile/like_post/' +
          props.current_user +
          '/',
        data,
      )
      .then(res => {
        likePost(!liked);
      })
      .catch((err: any) => console.log(err));
  };

  const backgroundStyle = {
    backgroundColor: 'rgb(17, 87, 64)',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/* Button to return home */}
      <TouchableWithoutFeedback onPress={props.returnHome}>
        <View style={styles.returnHome}>
          <Image
            source={require('./media/home.png')}
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
        {/* Product Image(s) */}
        <View style={styles.image}>
          <Image
            source={{uri: props.post.display_image}}
            style={styles.displayImage}
          />
        </View>

        {/* Product Description */}
        <View style={styles.description}>
          <View style={styles.profile}>
            <Image
              source={{uri: 'http://10.0.2.2:8000' + profile.profile_picture}}
              style={styles.profilePicture}
            />
            <Text style={{fontSize: 20, color: Colors.black}}>
              {profile.username}
            </Text>
          </View>
          <View style={styles.productDescription}>
            <Text style={{fontSize: 20, color: Colors.black}}>
              {props.post.product}
            </Text>
            <Text>{props.post.description}</Text>
            <Text>${props.post.price}</Text>
          </View>
        </View>
      </View>

      {/* Product Description Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.goldBar} />
        <View style={styles.footer}>
          <TouchableWithoutFeedback
            onPress={() => like_viewed_post(props.post.id, profile)}>
            <View
              style={{
                width: 30,
                height: 30,
                borderColor: Colors.white,
                borderWidth: 1,
                borderRadius: 15,
                backgroundColor: liked ? 'red' : 'rgb(17, 87, 64)',
              }}
            />
          </TouchableWithoutFeedback>
          <Text style={{fontSize: 25, color: Colors.white}}>
            ${props.post.price}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              getChats(
                props.current_user,
                {
                  uri: 'http://10.0.2.2:8000' + props.current_user_pfp,
                  type: 'image/' + props.current_user_pfp.split('.').pop(),
                  name: 'image.png',
                },
                props.post.username,
                {
                  uri: 'http://10.0.2.2:8000' + profile.profile_picture,
                  type: 'image/' + profile.profile_picture.split('.').pop(),
                  name: 'image.png',
                },
                props.post.product,
                {
                  uri: props.post.display_image,
                  type: 'image/' + props.post.display_image.split('.').pop(),
                  name: 'image.png',
                },
              );
            }}>
            <Text style={styles.message}>Message</Text>
          </TouchableWithoutFeedback>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 10,
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
  productDescription: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 10,
  },
  footerContainer: {
    display: 'flex',
    width: '100%',
    height: '10%',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
  },
  footer: {
    display: 'flex',
    backgroundColor: 'rgb(17, 87, 64)',
    width: '100%',
    height: '91%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 40,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#D0D3D4',
    color: 'black',
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '10%',
    width: '100%',
  },
});

export default ProductDescription;
