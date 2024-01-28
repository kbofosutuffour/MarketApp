/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react';
import Profile from './Profile';

import {
  Image,
  ImageSourcePropType,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Svg, {Path} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {UserContext} from './App';

/**
 * @returns Screen that shows a description of a post passed through the props object
 */
function ProductDescription(props: any): JSX.Element {
  const [profile, setProfile]: [any, Function] = useState({});
  const [posts, setPosts] = useState({});
  const [liked, likePost] = useState(false);
  const [mainScreen, showMain] = useState(true);
  const [options, showOptions] = useState(false);
  const [view, setView] = useState(0);
  const [userSettings, setUserSettings] = useState({});
  const [rating, setRating] = useState('');

  const [photos, setPhotos] = useState([]);

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const inProdMode = true;
  const emulator = false;
  const devURL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000';
  const prodURL = 'https://marketappwm-django-api.link';
  const ngrok = 'https://classic-pegasus-factual.ngrok-free.app';

  // After the page renders, retrieve information on the user
  // who created the post from the database, stored in the preceeding
  // state variable
  useEffect(() => {
    getData();
  }, []);

  /**
   * Used to get profile information on the creator of the post,
   * the current user's liked posts to potentially add the post in the description,
   * and other posts created by the creator of the post on screen for their profile
   * page
   */
  const getData = async () => {
    let request = `${
      inProdMode ? prodURL : emulator ? devURL : ngrok
    }/profile/${props.post.username}`;
    let data = {
      data: {},
      userSettings: {},
      date: [],
      id: '',
    };
    await axios
      .get(request)
      .then(res => {
        data.data = res.data;
      })
      .catch((err: any) => console.log(err));
    await axios
      .get(
        `${
          inProdMode ? prodURL : emulator ? devURL : ngrok
        }/profiles/get_liked_posts/${props.current_user}`,
      )
      .then(res => {
        likePost(
          res.data.liked_posts && res.data.liked_posts.includes(props.post.id)
            ? true
            : false,
        );
      })
      .catch((err: any) => console.log(err));
    await axios
      .get(
        `${
          inProdMode ? prodURL : emulator ? devURL : ngrok
        }/profiles/get_date_created/${props.post.username}`,
      )
      .then(res => {
        data.date = res.data.date.split('-');
      });
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/profiles/get_id/${
          props.post.username
        }`,
      )
      .then(res => {
        data.id = res.data.id;
      });
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/user_settings/${
          data.id
        }`,
      )
      .then(res => {
        data.userSettings = res.data;
      });
    setProfile(data);
    addAllImages();
    props.setHasLoaded(true);
  };

  /**
   * Adding any additional posts to the product description page
   */
  const addAllImages = async () => {
    let new_photos = [];
    new_photos.push(props.post.display_image);
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/images/${
          props.post.id
        }`,
      )
      .then(res => {
        let indexes = Object.keys(res.data);
        for (let i = 0; i < Object.keys(res.data).length; i++) {
          if (indexes[i] !== 'post' && res.data[indexes[i]]) {
            new_photos.push(res.data[indexes[i]]);
          }
        }
      })
      .catch((err: any) => console.log(err));
    setPhotos(new_photos);
  };

  /**
   * Used to create a new chat room between the current user
   * and the creator of the post on screen
   * @param buyer the username of the buyer
   * @param bpf the profile picture of the buyer
   * @param seller the username of the seller
   * @param spf the profile picture of the seller
   * @param product the name of the product being discussed
   * @param image the display image of the product
   */
  const getChats = async (buyer, bpf, seller, spf, product, image) => {
    let data = new FormData();
    data.append('buyer', buyer);
    data.append('buyer_profile_picture', bpf);
    data.append('seller', seller);
    data.append('seller_profile_picture', spf);
    data.append('product', product);
    data.append('image', image);

    await axios
      .post(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/rooms/`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .catch((err: any) => console.log(err));
    await getRooms(buyer);
    props.viewChats();
  };

  /**
   * Individual function to retrieve the chat rooms for a specific user
   */
  const getRooms = async (username: string) => {
    await axios
      .get(
        `${
          inProdMode ? prodURL : emulator ? devURL : ngrok
        }/rooms/get_rooms/${username}`,
      )
      .then(res => {
        props.setRooms(res.data);
      })
      .catch((err: any) => console.log(err));
  };

  /**
   * Used to add the post on screen to the current user's
   * list of liked posts
   * @param id the post id of the post on screen
   * @param profile the profile data of the creator of the post on screen
   */
  const like_viewed_post = async (id, profile) => {
    let data = {
      username: profile.username,
      liked_posts: id,
    };
    axios
      .patch(
        `${
          inProdMode ? prodURL : emulator ? devURL : ngrok
        }/edit_profile/like_post/${props.current_user}/`,
        data,
      )
      .then(() => {
        likePost(!liked);
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <>
      {/* Button to return home */}
      {mainScreen && (
        <TouchableWithoutFeedback onPress={props.returnHome}>
          <View style={styles.returnHome}>
            <Image
              source={require('./media/home.png')}
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                overflow: 'hidden',
                zIndex: 3,
                backgroundColor: 'rgb(185, 151, 91)',
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      {mainScreen && (
        <View style={styles.pdContainer}>
          {/* Product Image(s) */}
          <View style={styles.image}>
            <TouchableWithoutFeedback
              onPress={() => {
                setView(view - 1 >= 0 ? view - 1 : photos.length - 1);
              }}>
              <View style={styles.previousImage} />
            </TouchableWithoutFeedback>

            <Image
              source={{
                uri: photos[view] ? photos[view] : props.post.display_image,
              }}
              style={styles.displayImage}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                setView(view + 1 < photos.length ? view + 1 : 0);
              }}>
              <View style={styles.nextImage} />
            </TouchableWithoutFeedback>
          </View>

          {/* Product Description */}
          <View style={styles.description}>
            <View style={styles.profile}>
              {profile.data && (
                <TouchableWithoutFeedback onPress={() => showMain(false)}>
                  <Image
                    source={{
                      uri: `${
                        inProdMode ? prodURL : emulator ? devURL : ngrok
                      }${profile.data.profile_picture}`,
                    }}
                    style={styles.profilePicture}
                  />
                </TouchableWithoutFeedback>
              )}
              {!profile.data && <View style={styles.profilePicture} />}
              <Text style={{fontSize: 20, color: Colors.black, width: '55%'}}>
                {profile.data ? profile.data.username : ''}
              </Text>
              <TouchableWithoutFeedback onPress={() => showOptions(!options)}>
                <View style={styles.editPost}>
                  <Image
                    style={styles.editButtons}
                    source={require('./media/edit_post.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
              {options && (
                <View style={styles.statusOptions}>
                  <TouchableWithoutFeedback
                    onPress={() => props.viewReport(props.post, {})}>
                    <Text>Report Post</Text>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => props.viewReport({}, profile.data)}>
                    <Text>Report User</Text>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
            <View style={styles.productDescription}>
              <Text style={{fontSize: 20, color: Colors.black}}>
                {props.post.product}
              </Text>
              {props.post.description !== 'null' && (
                <Text>{props.post.description}</Text>
              )}
              <Text>${props.post.price}</Text>
            </View>
          </View>
        </View>
      )}
      {!mainScreen && (
        <>
          <Profile
            profile={profile}
            all_posts={props.all_posts}
            current_user={profile.username}
            onMain={false}
            userSettings={props.userSettings}
          />
        </>
      )}
      {/* Product Description Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.goldBar} />
        <View style={styles.footer}>
          {mainScreen && (
            <TouchableWithoutFeedback
              onPress={() => like_viewed_post(props.post.id, profile)}
              disabled={!props.hasLoaded}>
              <Svg width="24" height="24" fill="none">
                <Path
                  d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                  fill={liked && props.hasLoaded ? 'red' : 'rgb(17, 87, 64)'}
                  stroke={props.hasLoaded ? 'black' : 'rgb(17, 87, 64)'}
                  strokeWidth={liked ? 0 : 3}
                />
              </Svg>
            </TouchableWithoutFeedback>
          )}
          {mainScreen && props.hasLoaded && (
            <Text style={{fontSize: 25, color: Colors.white}}>
              ${props.post.price}
            </Text>
          )}
          {!mainScreen && (
            <TouchableWithoutFeedback
              onPress={() => showMain(true)}
              disabled={!props.hasLoaded}>
              <Text style={styles.message}>Return</Text>
            </TouchableWithoutFeedback>
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              props.setHasLoaded(false);
              getChats(
                props.current_user,
                {
                  uri: `${inProdMode ? prodURL : emulator ? devURL : ngrok}${
                    props.current_user_pfp
                  }`,
                  type: 'image/' + props.current_user_pfp.split('.').pop(),
                  name: 'image.png',
                },
                props.post.username,
                {
                  uri: `${inProdMode ? prodURL : emulator ? devURL : ngrok}${
                    profile.data.profile_picture
                  }`,
                  type:
                    'image/' + profile.data.profile_picture.split('.').pop(),
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
            <Text
              style={
                props.hasLoaded ? styles.message : styles.messageNotLoaded
              }>
              Message
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
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
    flexDirection: 'row',
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
    overflow: 'hidden',
  },
  returnHome: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgb(185, 151, 91)',
    borderRadius: 10,
    overflow: 'hidden',
    left: 30,
    top: 30,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDescription: {
    padding: 20,
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
    overflow: 'hidden',
    backgroundColor: '#D0D3D4',
    color: 'black',
  },
  messageNotLoaded: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(17, 87, 64)',
    color: 'rgb(17, 87, 64)',
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '10%',
    width: '100%',
  },
  statusOptions: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    rowGap: 5,
    position: 'relative',
    right: 150,
  },
  editPost: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  editButtons: {
    width: 10,
    height: 30,
  },
  previousImage: {
    height: '90%',
    width: '20%',
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  nextImage: {
    height: '90%',
    width: '20%',
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});

export default ProductDescription;
