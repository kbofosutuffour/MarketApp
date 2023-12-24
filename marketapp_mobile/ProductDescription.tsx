/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Profile from './Profile';

import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

/**
 * @returns Screen that shows a description of a post passed through the props object
 */
function ProductDescription(props): JSX.Element {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState({});
  const [liked, likePost] = useState(false);
  const [mainScreen, showMain] = useState(true);
  const [options, showOptions] = useState(false);
  const [view, setView] = useState(0);

  const [photos, setPhotos] = useState([]);
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
    let request = 'http://10.0.2.2:8000/profile/' + props.post.username;
    await axios
      .get(request)
      .then(res => {
        setProfile(res.data);
      })
      .catch((err: any) => console.log(err));
    await axios
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
    request = 'http://10.0.2.2:8000/posts/get_posts/' + props.post.username;
    await axios
      .get(request)
      .then(res => {
        setPosts(res.data);
      })
      .catch((err: any) => console.log(err));

    addAllImages();
  };

  /**
   * Adding any additional posts to the product description page
   */
  const addAllImages = async () => {
    let new_photos = [];
    new_photos.push(props.post.display_image);
    await axios
      .get('http://10.0.2.2:8000/images/' + props.post.id)
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
  var getChats = async (buyer, bpf, seller, spf, product, image) => {
    let data = new FormData();
    data.append('buyer', buyer);
    data.append('buyer_profile_picture', bpf);
    data.append('seller', seller);
    data.append('seller_profile_picture', spf);
    data.append('product', product);
    data.append('image', image);

    await axios
      .post('http://10.0.2.2:8000/rooms/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch((err: any) => console.log(err));
    props.viewChats();
  };

  /**
   * Used to add the post on screen to the current user's
   * list of liked posts
   * @param id the post id of the post on screen
   * @param profile the profile data of the creator of the post on screen
   */
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
              <TouchableWithoutFeedback onPress={() => showMain(false)}>
                <Image
                  source={{
                    uri: 'http://10.0.2.2:8000' + profile.profile_picture,
                  }}
                  style={styles.profilePicture}
                />
              </TouchableWithoutFeedback>
              <Text style={{fontSize: 20, color: Colors.black, width: '55%'}}>
                {profile.username}
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
                    onPress={() => props.viewReport({}, profile)}>
                    <Text>Report User</Text>
                  </TouchableWithoutFeedback>
                </View>
              )}
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
      )}
      {!mainScreen && (
        <>
          <Profile
            profile={profile}
            posts={posts}
            current_user={profile.username}
            onMain={false}
          />
        </>
      )}
      {/* Product Description Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.goldBar} />
        <View style={styles.footer}>
          {mainScreen && (
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
          )}
          {mainScreen && (
            <Text style={{fontSize: 25, color: Colors.white}}>
              ${props.post.price}
            </Text>
          )}
          {!mainScreen && (
            <TouchableWithoutFeedback onPress={() => showMain(true)}>
              <Text style={styles.message}>Return</Text>
            </TouchableWithoutFeedback>
          )}
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
    backgroundColor: '#D0D3D4',
    color: 'black',
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
    height: '60%',
    width: '20%',
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  nextImage: {
    height: '60%',
    width: '20%',
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});

export default ProductDescription;
