/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import DocumentPicker from 'react-native-document-picker';
import {format} from 'date-fns';
import uuid from 'react-native-uuid';
import {UserContext} from './App';

import {Dimensions, Platform, PixelRatio} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size: any) {
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
    return SCREEN_HEIGHT * 0.725;
  } else if (height < 716) {
    return SCREEN_HEIGHT * 0.765;
  } else if (height < 780) {
    return SCREEN_HEIGHT * 0.8;
  }
}

/**
 * @param props
 * @returns A post created by the user
 */
function Post(props: any): JSX.Element {
  const [options, showOptions] = useState(false);
  const [status, setStatus] = useState('');
  const [statusOptions, showStatusOptions] = useState(false);

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const baseUrl =
    Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost';

  useEffect(() => {
    setStatus(props.data.status);
  }, []);

  const changeStatus = async (id: string, username: string, status: string) => {
    let data = {
      username: username,
      post: id,
      status: status.toUpperCase(),
    };
    axios
      .patch(`${baseUrl}:8000/edit_post/status/${username}/`, data)
      .then(() => {
        setStatus(status.toUpperCase());
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <TouchableWithoutFeedback onPress={() => props.viewPost(props.data.id)}>
      {/* Clicking on a post in the profile will lead user to the edit post screen */}
      <>
        <View style={styles.post}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.viewPost(props.data.id);
            }}>
            <View style={styles.postImageContainer}>
              <Image
                style={styles.postImage}
                source={{
                  uri: props.data.display_image,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.postText}>
            <Text style={{color: 'black', fontSize: 17.5}}>
              {props.data.product}
            </Text>
            <Text>${props.data.price}</Text>
            <TouchableWithoutFeedback
              onPress={() => showStatusOptions(!statusOptions)}>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  color:
                    status === 'SELLING'
                      ? 'blue'
                      : status === 'PENDING'
                      ? 'rgb(185, 151, 91)'
                      : 'rgb(17, 87, 64)',
                  fontWeight: 'bold',
                }}>
                {status}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          {props.main && (
            <TouchableWithoutFeedback onPress={() => showOptions(!options)}>
              <View style={styles.editPost}>
                <Image
                  style={styles.editButtons}
                  source={require('./media/edit_post.png')}
                />
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* Editing options for current user profile page */}
          {props.main &&
            props.data.username === props.current_user &&
            options && (
              <View style={styles.postOptions}>
                <TouchableWithoutFeedback
                  onPress={() => props.viewPost(props.data.id)}>
                  <Text>Edit Post</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    props.setDelete(props.data);
                    props.setView({
                      deletePost: true,
                    });
                  }}>
                  <Text>Delete Post</Text>
                </TouchableWithoutFeedback>
              </View>
            )}
          {props.data.username === props.current_user && statusOptions && (
            <View style={styles.statusOptions}>
              <TouchableWithoutFeedback
                onPress={() => {
                  changeStatus(props.data.id, props.data.username, 'SELLING');
                  showStatusOptions(!statusOptions);
                }}>
                <Text>SELLING</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  changeStatus(props.data.id, props.data.username, 'PENDING');
                  showStatusOptions(!statusOptions);
                }}>
                <Text>PENDING</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  changeStatus(props.data.id, props.data.username, 'SOLD');
                  showStatusOptions(!statusOptions);
                }}>
                <Text>SOLD</Text>
              </TouchableWithoutFeedback>
            </View>
          )}

          {/* Editing options for viewing other profile page */}
          {props.data.username !== props.current_user && options && (
            <View style={styles.postOptions}>
              {/* <TouchableWithoutFeedback></TouchableWithoutFeedback>
            <TouchableWithoutFeedback></TouchableWithoutFeedback>
            <TouchableWithoutFeedback></TouchableWithoutFeedback> */}
            </View>
          )}
        </View>
      </>
    </TouchableWithoutFeedback>
  );
}

/**
 * Navigation Bar if viewing a different user's screen
 */
function NavBar(): JSX.Element {
  return (
    <>
      <View style={styles.navigationBar}>
        <Text style={styles.home}>User Profile</Text>
      </View>
      <View style={styles.goldBar} />
    </>
  );
}

/**
 * Component which allows users to edit their profile
 * @param props
 * @returns Edit Profile Screen
 */
function EditProfile(props: any): JSX.Element {
  const [showDate, setShowDate] = useState(false);

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const baseUrl =
    Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost';

  useEffect(() => {
    setShowDate(props.userSettings.data.show_joined_date);
  }, [props.userSettings.data.show_joined_date]);

  const changeDateSettings = async (value: boolean) => {
    axios.patch(
      `${baseUrl}:8000/user_settings/show_joined_date/${props.profile_id}/`,
      {
        username: props.profile_id,
        show_joined_date: value,
      },
    );
    setShowDate(value);
  };

  return (
    <View style={{height: filterHeight(SCREEN_HEIGHT)}}>
      <Button
        title="Return"
        onPress={() =>
          props.setView({
            main: true,
          })
        }
      />
      <View style={styles.userSettings}>
        <View style={styles.settingsOptionContainer}>
          <Text style={styles.settingsOption}>My Information</Text>
        </View>
        <View style={styles.settingsOptionContainerOtherMain}>
          {/* Leads user to a screen to change their profile picture */}
          <TouchableOpacity
            onPress={() =>
              props.setView({
                changeProfilePicture: true,
              })
            }>
            <View>
              <Image
                source={{
                  uri: `${baseUrl}:8000${props.profile.data.profile_picture}`,
                }}
                style={styles.profilePictureBorder}
              />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={{color: 'black', fontSize: normalize(22.5)}}>
              {props.profile.data.username}
            </Text>
            <Text style={{textDecorationLine: 'underline'}}>
              {props.profile.data.email
                ? props.profile.data.email
                : 'useremail@email.com'}
            </Text>
            <Text>
              {props.profile.date
                ? 'Joined ' +
                  format(
                    new Date(props.profile.date[0], props.profile.date[1]),
                    'MMMM yyyy',
                  )
                : ''}
            </Text>
          </View>
        </View>

        <View style={styles.settingsOptionContainerNoBorder}>
          <View style={styles.toggle}>
            <View>
              <Text style={{color: 'black', fontSize: 17.5, width: 200}}>
                Show Joined Date
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => changeDateSettings(!showDate)}>
              <View style={styles.outerCircle}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: showDate ? Colors.black : Colors.white,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * @param props
 * @returns The profile page
 */
function Profile(props: any): JSX.Element {
  const [posts, setPosts] = useState([]); // Will hold all of the post created by the user

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const baseUrl =
    Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost';

  // State variables that allows the user to switch between
  // The profile page, editing their profile, deleting a post,
  // and changing their profile picture
  const [view, setView] = useState({
    main: props.onMain,
    editProfile: false,
    deletePost: false,
    changeProfilePicture: false,
    otherProfile: !props.onMain,
  });
  const [deletePostData, setDelete]: [any, Function] = useState(null);
  const [changedPic, setChangedPic] = useState(null);
  const [otherProfileShowOptions, setOtherProfileShowOptions] = useState(false);

  const [type, setType] = useState({
    sell_history: true,
    buy_history: false,
    liked_posts: false,
  });

  const [likedPosts, setLikedPosts] = useState([]);
  const [buyHistory, setBuyHistory] = useState([]);

  const [test, setTest] = useState({});
  /**
   * Function to delete the post in the database
   * @param id The id of the selected post
   */
  const removePost = async (id: string | number) => {
    // Note: MUST delete additional post images before deleting a post
    // To maintain foreign key integrity in the database
    await axios
      .delete(`${baseUrl}:8000/images/${id}/`)
      .catch((err: any) => console.log(err));
    await axios
      .delete(`${baseUrl}:8000/posts/${id}/`)
      .catch((err: any) => console.log(err));
    setView({
      main: true,
      editProfile: false,
      deletePost: false,
      changeProfilePicture: false,
      otherProfile: false,
    });
    setDelete(null);
    props.getProfile();
    props.setHasLoaded(false);
  };

  // Function that retrieves all of the post created
  // by the user currently in the database after the page renders
  useEffect(() => {
    setPosts(view.main ? props.profile.posts : props.posts);
    setLikedPosts(props.profile.liked_posts);
  }, []);

  return (
    <>
      {view.otherProfile && <NavBar />}
      {(view.main || view.otherProfile) && (
        <View style={styles.profilePage}>
          <View style={styles.profileView}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: `${baseUrl}:8000${props.profile.data.profile_picture}`,
              }}
            />
            <View style={styles.profileDescription}>
              <Text style={{fontSize: normalize(20), color: Colors.black}}>
                {props.profile.data.username}
              </Text>
              {props.onMain && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setView({
                      main: false,
                      editProfile: true,
                      deletePost: false,
                      changeProfilePicture: false,
                      otherProfile: false,
                    });
                  }}>
                  <Text style={styles.editProfileButton}>Edit Profile</Text>
                </TouchableWithoutFeedback>
              )}
              {view.otherProfile && (
                <Text>
                  {props.profile.userSettings.show_joined_date
                    ? 'Joined ' +
                      format(
                        new Date(props.profile.date[0], props.profile.date[1]),
                        'MMMM yyyy',
                      )
                    : ''}
                </Text>
              )}
            </View>
            {view.otherProfile && (
              <>
                <TouchableWithoutFeedback
                  onPress={() =>
                    setOtherProfileShowOptions(!otherProfileShowOptions)
                  }>
                  <View style={styles.editPost}>
                    <Image
                      style={styles.editButtons}
                      source={require('./media/edit_post.png')}
                    />
                  </View>
                </TouchableWithoutFeedback>
                {otherProfileShowOptions && (
                  <View style={styles.statusOptions}>
                    <TouchableWithoutFeedback>
                      <Text>Block User</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                      <Text>Report User</Text>
                    </TouchableWithoutFeedback>
                  </View>
                )}
              </>
            )}
          </View>
          <View
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: view.main ? 'center' : 'flex-start',
              backgroundColor: Colors.white,
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                setType({
                  sell_history: true,
                  buy_history: false,
                  liked_posts: false,
                })
              }>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderTopWidth: 0.5,
                  padding: normalize(15),
                  width: '33.33%',
                  backgroundColor: type.sell_history ? Colors.white : '#D7D7D7',
                }}>
                <Text
                  style={{
                    color: type.sell_history ? 'black' : 'gray',
                    width: view.main ? 50 : 100,
                    textAlign: 'center',
                    fontSize: view.main ? 15 : 17.5,
                  }}>
                  Sell History
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {view.main && (
              <TouchableWithoutFeedback
                onPress={() =>
                  setType({
                    sell_history: false,
                    buy_history: true,
                    liked_posts: false,
                  })
                }>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'gray',
                    borderTopWidth: 0.5,
                    padding: normalize(15),
                    width: '33.33%',
                    backgroundColor: type.buy_history
                      ? Colors.white
                      : '#D7D7D7',
                  }}>
                  <Text
                    style={{
                      color: type.buy_history ? 'black' : 'gray',
                      width: 50,
                      textAlign: 'center',
                      fontSize: 15,
                    }}>
                    Buy History
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            {view.main && (
              <TouchableWithoutFeedback
                onPress={() =>
                  setType({
                    sell_history: false,
                    buy_history: false,
                    liked_posts: true,
                  })
                }>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'gray',
                    borderTopWidth: 0.5,
                    padding: normalize(15),
                    width: '33.33%',
                    backgroundColor: type.liked_posts
                      ? Colors.white
                      : '#D7D7D7',
                  }}>
                  <Text
                    style={{
                      color: type.liked_posts ? 'black' : 'gray',
                      width: 50,
                      textAlign: 'center',
                      fontSize: 15,
                    }}>
                    Liked Posts
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>

          {/* Where the user's posts are shown */}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: 0,
              }}>
              {props.all_posts.map(post => {
                if (type.sell_history) {
                  if (post.username === props.profile.data.username) {
                    return (
                      <Post
                        data={post}
                        setDesc={props.setDesc}
                        viewPost={props.viewPost}
                        setView={setView}
                        setDelete={setDelete}
                        current_user={props.current_user}
                        main={view.main}
                        key={uuid.v4()}
                      />
                    );
                  }
                }
              })}
              {view.main &&
                props.all_posts.map(post => {
                  if (type.liked_posts) {
                    if (likedPosts.length && likedPosts.includes(post.id)) {
                      return (
                        <Post
                          data={post}
                          setDesc={props.setDesc}
                          viewPost={props.viewPost}
                          setView={setView}
                          current_user={props.current_user}
                          main={view.main}
                          key={uuid.v4()}
                        />
                      );
                    }
                  } else if (type.buy_history) {
                    if (buyHistory.length && buyHistory.includes(post.id)) {
                      return (
                        <Post
                          data={post}
                          setDesc={props.setDesc}
                          viewPost={props.viewPost}
                          setView={setView}
                          current_user={props.current_user}
                          main={view.main}
                        />
                      );
                    }
                  }
                })}
            </View>
          </ScrollView>
        </View>
      )}
      {view.editProfile && (
        <EditProfile
          profile={props.profile}
          setView={setView}
          userSettings={props.userSettings}
        />
      )}
      {view.deletePost && (
        <View
          style={{
            backgroundColor: Colors.white,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '80%',
            rowGap: 20,
            padding: 20,
          }}>
          <Text style={{fontSize: 20, color: 'black', textAlign: 'center'}}>
            Are you sure you want to delete this post?
          </Text>
          <Post data={deletePostData} />
          <View style={{display: 'flex', flexDirection: 'row', columnGap: 10}}>
            <TouchableWithoutFeedback
              onPress={() => removePost(deletePostData.id)}>
              <Text style={styles.deleteYes}>YES</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                setView({
                  main: true,
                  editProfile: false,
                  deletePost: false,
                  changeProfilePicture: false,
                  otherProfile: false,
                })
              }>
              <Text style={styles.deleteNo}>NO</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
      {view.changeProfilePicture && (
        <View>
          <View style={styles.changeProfileContainer}>
            <TouchableWithoutFeedback
              onPress={async () => {
                const res = await DocumentPicker.pick({
                  type: [DocumentPicker.types.images],
                });
                setChangedPic({
                  uri: res[0].uri,
                  type: res[0].type,
                  name: 'image.png',
                });
              }}>
              <View style={styles.changeProfilePictureBorder}>
                <Image
                  style={styles.changeProfilePicture}
                  source={{
                    uri: changedPic
                      ? changedPic.uri
                      : `${baseUrl}:8000${props.profile.data.profile_picture}`,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* Saves the new profile picture in the database */}
            <TouchableWithoutFeedback
              onPress={async () => {
                let data = new FormData();
                data.append('profile_picture', changedPic);
                data.append('username', props.profile.data.username);

                let profile_id;
                await axios
                  .get(
                    `${baseUrl}:8000/profiles/get_id/${props.profile.username}/`,
                  )
                  .then(response => {
                    profile_id = response.data.id;
                  })
                  .catch((err: any) => console.log(err));
                await axios
                  .patch(`${baseUrl}:8000/edit_profile/${profile_id}/`, data)
                  .catch((err: any) => console.log(err));
                setView({
                  main: false,
                  editProfile: true,
                  deletePost: false,
                  changeProfilePicture: false,
                  otherProfile: false,
                });
              }}>
              <View style={styles.change}>
                <Text style={{color: Colors.white}}>Change</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  profilePage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: filterHeight(SCREEN_HEIGHT),
  },
  profilePicture: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 50,
    marginLeft: normalize(25),
    borderWidth: 1,
    borderColor: Colors.black,
  },
  profilePictureBorder: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  profileView: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
    columnGap: 20,
    backgroundColor: Colors.white,
  },
  profileDescription: {
    display: 'flex',
    width: '47.5%',
    flexDirection: 'column',
    rowGap: 5,
  },
  typeViewItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 20,
    width: '33.33%',
  },
  scrollView: {
    height: '75%',
    backgroundColor: Colors.white,
    width: '100%',
  },
  post: {
    backgroundColor: 'white',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: normalize(15),
    borderWidth: 0.8,
    borderColor: 'grey',
  },
  postImageContainer: {
    width: normalize(70),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: normalize(60),
    height: normalize(60),
    display: 'flex',
    backgroundColor: 'black',
    borderRadius: 25,
    overflow: 'hidden',
  },
  postText: {
    display: 'flex',
    flexDirection: 'column',
    width: '65%',
    marginLeft: 20,
  },
  postOptions: {
    width: '40%',
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
    right: 170,
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
  settingsOptionContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingTop: 20,
    width: '85%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  settingsOptionContainerNoBorder: {
    paddingTop: 20,
    width: '85%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  settingsOptionContainerOther: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingTop: 20,
    paddingBottom: 20,
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    columnGap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOptionContainerOtherMain: {
    borderColor: 'gray',
    paddingTop: 20,
    paddingBottom: 0,
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    columnGap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOption: {
    fontSize: 20,
  },
  userSettings: {
    backgroundColor: Colors.white,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  changeProfileContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    height: 600,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
    padding: 20,
  },
  change: {
    width: 200,
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'rgb(17, 87, 64)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeProfilePicture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  changeProfilePictureBorder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.black,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  editProfileButton: {
    backgroundColor: '#D7D7D7',
    padding: 5,
    borderRadius: 10,
    textAlign: 'center',
    height: 25,
    lineHeight: 17.5,
  },
  outerCircle: {
    position: 'absolute',
    right: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1,
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    rowGap: 10,
  },
  toggle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 300,
    width: '100%',
  },
  navigationBar: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    height: '11%',
  },
  home: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 30,
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '1%',
  },
  deleteYes: {
    padding: 10,
    borderRadius: 10,
    width: 100,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
  },
  deleteNo: {
    padding: 10,
    borderRadius: 10,
    width: 100,
    backgroundColor: 'rgb(17, 87, 64)',
    color: 'white',
    textAlign: 'center',
  },
});
export default Profile;
