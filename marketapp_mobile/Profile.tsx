/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import DocumentPicker from 'react-native-document-picker';

/**
 * @param props
 * @returns A post created by the user
 */
function Post(props: {
  data: {
    display_image: any;
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
  };
  setDesc: any;
}): JSX.Element {
  const [options, showOptions] = useState(false);

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
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                color:
                  props.data.status === 'SELLING'
                    ? 'blue'
                    : props.data.status === 'PENDING'
                    ? 'rgb(185, 151, 91)'
                    : 'rgb(17, 87, 64)',
                fontWeight: 'bold',
              }}>
              {props.data.status}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={() => showOptions(!options)}>
            <View style={styles.editPost}>
              <Image
                style={styles.editButtons}
                source={require('./media/edit_post.png')}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Editing options for current user profile page */}
          {props.data.username === props.current_user && options && (
            <View style={styles.postOptions}>
              <TouchableWithoutFeedback
                onPress={() => props.viewPost(props.data.id)}>
                <Text>Edit Post</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  props.setDelete(props.data.id);
                  props.setView({
                    main: false,
                    editProfile: false,
                    deletePost: true,
                  });
                }}>
                <Text>Delete Post</Text>
              </TouchableWithoutFeedback>
            </View>
          )}

          {/* Editing options for viewing other profile page */}
          {props.data.username !== props.current_user && options && (
            <View style={styles.postOptions}>
              {console.log(props.current_user)}

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
 * Component which allows users to edit their profile
 * @param props
 * @returns Edit Profile Screen
 */
function EditProfile(props): JSX.Element {
  const [showDate, changeDateSettings] = useState(false);

  return (
    <View style={{height: '80%'}}>
      <Button
        title="Return"
        onPress={() =>
          props.setView({
            main: true,
            editProfile: false,
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
                main: false,
                editProfile: false,
                deletePost: false,
                changeProfilePicture: true,
              })
            }>
            <View>
              <Image
                source={{
                  uri: 'http://10.0.2.2:8000' + props.profile.profile_picture,
                }}
                style={styles.profilePictureBorder}
              />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={{color: 'black', fontSize: 22.5}}>
              {props.profile.username}
            </Text>
            <Text style={{textDecorationLine: 'underline'}}>
              {props.profile.email
                ? props.profile.email
                : 'useremail@email.com'}
            </Text>
            <Text>Date Joined</Text>
          </View>
        </View>

        <View style={styles.settingsOptionContainerNoBorder}>
          <View style={styles.toggle}>
            <View>
              <Text style={{color: 'black', fontSize: 17.5, width: 200}}>
                Show Joined Date
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => changeDateSettings(!showDate)}>
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
function Profile(props): JSX.Element {
  const [posts, setPosts] = useState([]); // Will hold all of the post created by the user

  // State variables that allows the user to switch between
  // The profile page, editing their profile, deleting a post,
  // and changing their profile picture
  const [view, setView] = useState({
    main: true,
    editProfile: false,
    deletePost: false,
    changeProfilePicture: false,
  });
  const [deletePostID, setDelete] = useState(null);
  const [changedPic, setChangedPic] = useState(null);

  const [type, setType] = useState({
    sell_history: true,
    buy_history: false,
    saved_posts: false,
  });

  /**
   * Function to delete the post in the database
   * @param id The id of the selected post
   */
  const removePost = async id => {
    await axios
      .delete('http://10.0.2.2:8000/posts/' + id + '/')
      .then(response => {
        console.log(response);
      })
      .catch((err: any) => console.log(err));
    setView({
      main: true,
      editProfile: false,
      deletePost: false,
      changeProfilePicture: false,
    });
    setDelete(null);
  };

  // Function that retrieves all of the post created
  // by the user currently in the database after the page renders
  useEffect(() => {
    var request =
      // eslint-disable-next-line prettier/prettier
      'http://10.0.2.2:8000/posts/get_posts/' + props.profile.username;
    axios
      .get(request)
      .then(res => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((err: any) => console.log(err));
  }, []);

  return (
    <>
      {view.main && (
        <View style={styles.profilePage}>
          <View style={styles.profileView}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: 'http://10.0.2.2:8000' + props.profile.profile_picture,
              }}
            />
            <View style={styles.profileDescription}>
              <Text style={{fontSize: 25}}>{props.profile.username}</Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  setView({
                    main: false,
                    editProfile: true,
                    deletePost: false,
                    changeProfilePicture: false,
                  });
                }}>
                <Text style={styles.editProfileButton}>Edit Profile</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.typeView}>
            <TouchableWithoutFeedback
              onPress={() =>
                setType({
                  sell_history: true,
                  buy_history: false,
                  saved_posts: false,
                })
              }>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderTopWidth: 0.5,
                  padding: 20,
                  width: '33.33%',
                  backgroundColor: type.sell_history ? Colors.white : '#D7D7D7',
                }}>
                <Text
                  style={{
                    color: type.sell_history ? 'black' : 'gray',
                    width: 50,
                    textAlign: 'center',
                    fontSize: 15,
                  }}>
                  Sell History
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                setType({
                  sell_history: false,
                  buy_history: true,
                  saved_posts: false,
                })
              }>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderTopWidth: 0.5,
                  padding: 20,
                  width: '33.33%',
                  backgroundColor: type.buy_history ? Colors.white : '#D7D7D7',
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
            <TouchableWithoutFeedback
              onPress={() =>
                setType({
                  sell_history: false,
                  buy_history: false,
                  saved_posts: true,
                })
              }>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderTopWidth: 0.5,
                  padding: 20,
                  width: '33.33%',
                  backgroundColor: type.saved_posts ? Colors.white : '#D7D7D7',
                }}>
                <Text
                  style={{
                    color: type.saved_posts ? 'black' : 'gray',
                    width: 50,
                    textAlign: 'center',
                    fontSize: 15,
                  }}>
                  Saved Posts
                </Text>
              </View>
            </TouchableWithoutFeedback>
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
              {posts.map(post => {
                if (type.saved_posts) {
                  if (
                    props.profile.saved_posts &&
                    props.profile.saved_posts.includes(post.id)
                  ) {
                    return (
                      <Post
                        data={post}
                        setDesc={props.setDesc}
                        viewPost={props.viewPost}
                        setView={setView}
                        setDelete={setDelete}
                        current_user={props.current_user}
                      />
                    );
                  }
                } else if (type.buy_history) {
                  //TODO: Add buy history to post model
                  return;
                } else if (type.sell_history) {
                  return (
                    <Post
                      data={post}
                      setDesc={props.setDesc}
                      viewPost={props.viewPost}
                      setView={setView}
                      setDelete={setDelete}
                      current_user={props.current_user}
                    />
                  );
                }
              })}
            </View>
          </ScrollView>
        </View>
      )}
      {view.editProfile && (
        <EditProfile profile={props.profile} setView={setView} />
      )}
      {view.deletePost && (
        <View
          style={{
            backgroundColor: Colors.white,
            width: '80%',
            height: '40%',
            display: 'flex',
            flexDirection: 'column',
            rowGap: 20,
          }}>
          <Text>Are you sure you want to delete this post?</Text>
          <View>
            <Button title="YES" onPress={() => removePost(deletePostID)} />
            <Button
              title="NO"
              onPress={() =>
                setView({
                  main: true,
                  editProfile: false,
                  deletePost: false,
                  changeProfilePicture: false,
                })
              }
            />
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
                      : 'http://10.0.2.2:8000' + props.profile.profile_picture,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* Saves the new profile picture in the database */}
            <TouchableWithoutFeedback
              onPress={async () => {
                let data = new FormData();
                data.append('profile_picture', changedPic);
                data.append('username', props.profile.username);

                let profile_id;
                await axios
                  .get(
                    'http://10.0.2.2:8000/profiles/get_id/' +
                      props.profile.username +
                      '/',
                  )
                  .then(response => {
                    console.log(response);
                    profile_id = response.data.id;
                  })
                  .catch((err: any) => console.log(err));
                await axios
                  .patch(
                    'http://10.0.2.2:8000/edit_profile/' + profile_id + '/',
                    data,
                  )
                  .then(response => {
                    console.log(response);
                  })
                  .catch((err: any) => console.log(err));
                setView({
                  main: false,
                  editProfile: true,
                  deletePost: false,
                  changeProfilePicture: false,
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
    height: '79%',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  profilePictureBorder: {
    width: 100,
    height: 100,
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
    columnGap: 15,
    backgroundColor: Colors.white,
  },
  profileDescription: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 5,
  },
  typeView: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
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
    padding: 15,
    borderWidth: 0.8,
    borderColor: 'grey',
  },
  postImageContainer: {
    width: 125,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: 100,
    height: 100,
    display: 'flex',
    backgroundColor: 'black',
    borderRadius: 25,
    overflow: 'hidden',
  },
  postText: {
    display: 'flex',
    flexDirection: 'column',
    width: '55%',
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
});
export default Profile;
