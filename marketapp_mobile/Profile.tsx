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
            <Text>{props.data.product}</Text>
            <Text>{props.data.username}</Text>
            <Text>${props.data.price}</Text>
          </View>
          <View style={styles.editPost}>
            <Image
              style={styles.editButtons}
              source={require('./media/edit_post.png')}
            />
          </View>
        </View>

        {/* Button to delete a post */}
        <TouchableWithoutFeedback
          onPress={() => {
            props.setDelete(props.data.id);
            props.setView({
              main: false,
              editProfile: false,
              deletePost: true,
            });
          }}>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Text>DELETE</Text>
          </View>
        </TouchableWithoutFeedback>
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
  return (
    <>
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
        <View style={styles.settingsOptionContainerOther}>
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
          <View styles={styles.profileText}>
            <Text>{props.profile.username}</Text>
            <Text>useremail@email.com</Text>
            <Text>Date Joined</Text>
          </View>
        </View>

        <View style={styles.settingsOptionContainer}>
          <Text style={styles.settingsOption}>Show Joined Date</Text>
        </View>

        <View style={styles.settingsOptionContainer}>
          <Text style={styles.settingsOption}>Change Password</Text>
        </View>
      </View>
    </>
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
            <View>
              <Text>{props.profile.username}</Text>
              <Button
                title="Edit Profile"
                onPress={() => {
                  setView({
                    main: false,
                    editProfile: true,
                    deletePost: false,
                    changeProfilePicture: false,
                  });
                }}
              />
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
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderWidth: 0.5,
                  padding: 20,
                  width: '33.33%',
                  backgroundColor: type.sell_history ? Colors.white : '#D7D7D7',
                }}>
                <Text>Sell History</Text>
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
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderWidth: 0.5,
                  padding: 20,
                  width: '33.33%',
                  backgroundColor: type.buy_history ? Colors.white : '#D7D7D7',
                }}>
                <Text>Buy History</Text>
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
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'gray',
                  borderWidth: 0.5,
                  padding: 20,
                  width: '33.33%',
                  backgroundColor: type.saved_posts ? Colors.white : '#D7D7D7',
                }}>
                <Text>Saved Posts</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Where the user's posts are shown */}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View
              style={{
                backgroundColor: Colors.white,
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
          // eslint-disable-next-line react-native/no-inline-styles
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
    height: 600,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginLeft: 50,
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.white,
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
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  postText: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  settingsOptionContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
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
  settingsOption: {
    fontSize: 20,
  },
  userSettings: {
    backgroundColor: Colors.white,
    height: '82.5%',
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
});
export default Profile;
