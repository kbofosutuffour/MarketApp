/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, useContext} from 'react';
import {Dimensions, Platform, PixelRatio} from 'react-native';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import axios from 'axios';
import ProductDescription from './ProductDescription';
import Profile from './Profile';
import Chats from './Chats';
import UserSettings from './UserSettings';
import CreatePost from './Post';
import Login from './Login';
import Report from './Report';
import Landing from './Landing';
import Footer from './Footer';

import {formatDistance} from 'date-fns';
import uuid from 'react-native-uuid';
import {Categories} from './Categories';

export const UserContext = React.createContext(null);

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

/**
 * Function to make font sizes, margin sizes,
 * and other related sizing consistent
 * @param size the desired size
 * @returns a consistent size to match across different phones
 */
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
    return SCREEN_HEIGHT * 0.725;
  } else if (height < 716) {
    return SCREEN_HEIGHT * 0.765;
  } else if (height < 780) {
    return SCREEN_HEIGHT * 0.8;
  }
}

function NavBar(props: any): JSX.Element {
  //Navigation Bar component that is displayed on top of various screens

  const [input, setInput] = useState('');

  return (
    <>
      <View style={styles.navigationBar}>
        {/* Only show the type of nav bar if the search bar is not being used */}
        <View
          style={
            !props.searchedPosts.showSearchBar ? styles.navigationBarType : {}
          }>
          <Text style={styles.home}>
            {!props.searchedPosts.showSearchBar ? props.type : ''}
          </Text>
        </View>

        {/* Show the search icon if the user is on the home screen */}
        {props.type === 'Home' && (
          <>
            {props.searchedPosts.showSearchBar && (
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <TouchableWithoutFeedback>
                    <Image
                      style={styles.searchButton}
                      source={require('./media/search-gray.png')}
                    />
                  </TouchableWithoutFeedback>
                  <TextInput
                    style={styles.input}
                    onSubmitEditing={text =>
                      props.searchPosts(text.nativeEvent.text, props.category)
                    }
                    onChangeText={text => setInput(text)}
                    value={input}
                    placeholder={
                      props.searchedPosts.showSearchBar && props.category
                        ? 'Search in ' + props.category + ':'
                        : ''
                    }
                  />
                  <TouchableWithoutFeedback
                    onPress={() => {
                      props.setCategory('');
                      props.setSearch({
                        showSearchBar: true,
                        showResults: false,
                        posts: [],
                      });
                      setInput('');
                    }}>
                    <Image
                      style={styles.searchButton}
                      source={require('./media/cancel-gray.jpg')}
                    />
                  </TouchableWithoutFeedback>
                </View>
                <View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      props.setPosts({
                        ...props.posts,
                        showPosts: true,
                        showResults: false,
                      });
                      props.setCategory('');
                      props.setSearch({
                        showSearchBar: false,
                        showResults: false,
                        posts: [],
                      });
                    }}>
                    <View style={styles.cancelButton}>
                      <Text
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          color: Colors.white,
                          textAlign: 'center',
                          height: 20,
                          lineHeight: 20,
                          fontSize: 17.5,
                        }}>
                        cancel
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )}
            {!props.searchedPosts.showSearchBar && (
              <TouchableWithoutFeedback
                onPress={() => {
                  props.setSearch({
                    ...props.searchedPosts,
                    showSearchBar: true,
                  });
                  props.setPosts({...props.posts, showPosts: false});
                }}>
                <View style={styles.searchButtonContainer}>
                  <Image
                    source={require('./media/search.png')}
                    style={{width: normalize(40), height: normalize(40)}}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </>
        )}

        {/* Show the settings icon if the user is on the home screen */}
        {(props.type === 'Profile' || props.type === 'Settings') && (
          <TouchableWithoutFeedback
            onPress={() => {
              props.viewSettings();
            }}>
            <View style={styles.searchButtonContainer}>
              <Image
                source={require('./media/settings-white.png')}
                style={{width: normalize(40), height: normalize(40)}}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      <View style={styles.goldBar} />
    </>
  );
}

function Post(props: any): JSX.Element {
  const [options, showOptions]: [boolean, Function] = useState(false);

  /**
   * Get's the number of seconds since the post has been created
   * @param postDateTime the datetime of the post
   * @returns the the number of seconds since the post has been created
   */
  const getDifference = (postDateTime: string) => {
    if (postDateTime) {
      let temp = postDateTime.split('T');
      let [date, time] = [temp[0].split('-'), temp[1].split(':')];
      let post = new Date(
        Number(date[0]),
        Number(date[1]) - 1,
        Number(date[2]),
        Number(time[0]) - 4,
        Number(time[1]),
        Number(time[2].split('.')[0]),
      );
      return formatDistance(new Date(), post, {includeSeconds: true});
    }
  };

  return (
    <TouchableWithoutFeedback //Makes the post component react to a tap
      onPress={() => {
        props.setHasLoaded(false);
        props.setDesc({
          showDesc: true,
          post: props.data,
        });
      }}>
      <View style={styles.post}>
        <View style={styles.postImageContainer}>
          <Image
            style={styles.postImage}
            source={{uri: props.data.display_image}}
          />
        </View>
        <View style={styles.postText}>
          <Text style={{color: 'black', fontSize: 17.5}}>
            {props.data.product}
          </Text>
          <Text style={{fontSize: normalize(10)}}>{props.data.username}</Text>
          <Text style={{fontSize: normalize(10)}}>${props.data.price}</Text>
          <Text style={styles.postedDate}>
            {'Posted ' + getDifference(props.data.date) + ' ago'}
          </Text>
        </View>

        {props.user && (
          <TouchableWithoutFeedback
            onPress={() =>
              props.showPostOptions({
                showOptions: true,
                post: props.data,
              })
            }>
            <View style={styles.editPost}>
              <Image
                style={styles.editButtons}
                source={require('./media/edit_post.png')}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* Editing options for posts on the home page*/}
        {props.user && options && false && (
          <View style={styles.postOptions}>
            {/* Only admins should be able to delete posts */}
            {props.user.admin && (
              <TouchableWithoutFeedback
                onPress={() => {
                  props.setDelete({
                    data: props.data,
                    deletePost: true,
                  });
                }}>
                <Text>Delete Post</Text>
              </TouchableWithoutFeedback>
            )}

            <TouchableWithoutFeedback
              onPress={() => props.countFlagPost(props.data.id)}>
              <Text>Flag Post</Text>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * @returns Application that is displayed on the screen
 */
function App(): JSX.Element {
  //These state variables dictate the what screen is currently being displayed
  //Some state variables hold data that is used in that screen state
  const [user, setUser] = useState({
    username: null,
    showLogin: true,
    redirect: '',
    admin: false,
  });

  const [posts, setPosts] = useState({
    showPosts: true,
    posts: [],
  });

  const [searchedPosts, setSearch] = useState({
    showSearchBar: false,
    showResults: false,
    posts: [],
  });

  const [prodDesc, setDesc] = useState({
    showDesc: false,
    post: {},
  });

  const [profile, setProfile] = useState({
    showProfile: false,
    data: {},
    settings: {},
    date: '',
    id: '',
    posts: [],
    liked_posts: [],
  });

  const [settings, setUserSettings] = useState({
    showSettings: false,
    title: 'Settings',
    data: {},
  });

  const [violations, setViolations] = useState([]);

  const [showPost, setPost] = useState({
    showPost: false,
    id: null,
  });

  const [showChats, setChats] = useState(false);
  const [chatNotifications, setChatNotifications] = useState(0);

  const [rooms, setRooms] = useState({});

  const [category, setCategory] = useState('');
  const [reportUser, setReporting] = useState({
    showReport: false,
    post: {},
    profile: {},
    sentFrom: user.username,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [hasSeenDraft, setHasSeenDraft] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(false);

  const [deletePost, setDelete]: [any, Function] = useState({
    data: {},
    deletePost: false,
  });

  // Used for the post pop-up options
  const [postOptions, showPostOptions] = useState({
    showOptions: false,
    post: {},
  });

  /**
   * Boolean on whether to order posts on the homescreen by
   * relevancy or by date posted
   */
  const [relevancy, setRelevancy] = useState({
    showRelevancy: true,
    posts: [],
  });

  /**
   * Sets the current page on the home screen
   */

  const [page, setPage] = useState(1);

  // When the defined components finish rendering, fetch
  // posts and profile information from the database
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username]);

  // Used to remove the landing screen if a user is logged in
  // and their data has been retrieved from the database
  useEffect(() => {
    if (Object.keys(profile.data).length) {
      setHasLoaded(true);
    }
  }, [profile]);

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  const inProdMode = false;
  const emulator = false;
  const devURL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000';
  const prodURL = 'https://marketappwm-django-api.link';
  const ngrok = 'https://classic-pegasus-factual.ngrok-free.app';

  // The axios is a JavaScript library that is used to perform
  // various HTTP requests from existing API's.  Common HTTP requests
  // include get, post, put, and delete

  /**
   * gets all posts stored in the database as well as profile information
   * of the current user
   */
  const fetchData = async () => {
    await getPosts(1);
    setPage(1);

    // asynchronous function that gets the profile information
    // for the given username
    // TODO: Create a state variable for the user that is logged in
    let data = {
      showProfile: false,
      data: {},
      settings: {},
      date: '',
      id: '',
      posts: [],
      liked_posts: [],
    };

    if (user.username) {
      await axios
        .get(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/profile/${
            user.username
          }`,
        )
        .then(res => {
          data.showProfile = false;
          data.data = res.data;
        })
        .catch((err: any) => console.log(err));
      await getRooms();
      let profile_id;
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/profiles/get_date_created/${user.username}`,
        )
        .then(res => {
          data.date = res.data.date.split('-');
        });
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/profiles/get_id/${user.username}`,
        )
        .then(res => {
          profile_id = res.data.id;
          data.id = res.data.id;
        })
        .catch((err: any) => console.log(err));
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/posts/get_posts/${user.username}`,
        )
        .then(res => {
          data.posts = res.data;
        })
        .catch((err: any) => console.log(err));
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/profiles/get_liked_posts/${user.username}`,
        )
        .then(res => {
          data.liked_posts = res.data.liked_posts;
        })
        .catch((err: any) => console.log(err));
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/user_settings/${profile_id}`,
        )
        .then(res => {
          data.settings = res.data;
          setUserSettings({...settings, data: res.data});
        })
        .catch((err: any) => console.log(err));
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/violation/get_violations/${profile_id}`,
        )
        .then(res => {
          setViolations(res.data.violations);
        })
        .catch((err: any) => console.log(err));
      setProfile(data);
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/user_recommendations/${user.username}`,
        )
        .then(res => {
          let results: any[] = [];
          let post_ids = res.data.posts;

          for (let i = 0; i < post_ids.length; i++) {
            for (let j = 0; j < posts.posts.length; j++) {
              if (post_ids[i] == posts.posts[j].id) {
                results.push(posts.posts[j]);
              }
            }
          }

          setRelevancy({...relevancy, posts: results});
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  /**
   * asynchronous function that gets all existing posts
   */
  const getPosts = async (page = 1) => {
    await axios
      .get(
        `${
          inProdMode ? prodURL : emulator ? devURL : ngrok
        }/posts/?page=${page}`,
      )
      .then(res => {
        if (res.data.length === 0) {
          setErrorMessage(
            'There are currently no posts.  Create a post or try again later.',
          );
        }
        setPosts({
          showPosts: true,
          posts:
            page === 1
              ? res.data.results.reverse()
              : posts.posts.concat(res.data.results.reverse()),
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  /**
   * Individual function to retrieve the settings information from a specific user
   */
  const getUserSettings = async () => {
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/user_settings/${
          profile.data.id
        }`,
      )
      .then(res => {
        setProfile({...profile, settings: res.data});
        setUserSettings({...settings, data: res.data});
      });
  };

  /**
   * Individual function to retrieve the profile information from a specific user
   */
  const getProfile = async () => {
    let data = {};
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/profile/${
          user.username
        }`,
      )
      .then(res => {
        data = res.data;
      })
      .catch((err: any) => console.log(err));
    setProfile({...profile, data: data});
    await getPosts(page);
  };

  /**
   * Individual function to retrieve the chat rooms for a specific user
   */
  const getRooms = async () => {
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/rooms/get_rooms/${
          user.username
        }`,
      )
      .then(res => {
        setRooms(res.data);
      })
      .catch((err: any) => console.log(err));
  };

  /**
   * Function used to show results of a user's search
   * @param text user's input on the search bar
   */
  const searchPosts = async (text: string, category: string) => {
    var results: any[] = [];
    var post_ids: any[] = [];

    // Send the user search to the searching algorithm function in the backend
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/search/${text}/${
          user.username
        }`,
      )
      .then(res => {
        post_ids = res.data.posts;
      })
      .catch((err: any) => console.log(err));

    // Changing the order of posts shown on screen based on the ranking
    // Given from the searching algorithm
    for (let i = 0; i < post_ids.length; i++) {
      for (let j = 0; j < posts.posts.length; j++) {
        if (post_ids[i] == posts.posts[j].id) {
          results.push(posts.posts[j]);
        }
      }
    }

    setSearch({
      showSearchBar: true,
      showResults: true,
      posts: results,
    });
  };

  // These functions are called by various buttons and
  // button on the app to change the state variables,
  // Which then changes what page is shown on the screen

  /**
   * Switches to login/register page
   */
  const login = (redirect = '') => {
    setUser({
      username: null,
      showLogin: true,
      redirect: redirect,
      admin: false,
    });
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({
      showProfile: false,
      data: {},
      settings: {},
      date: '',
      id: '',
      posts: [],
      liked_posts: [],
    });
    setChats(false);
    setUserSettings({...settings, showSettings: false});
    setPost({...showPost, showPost: false});
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: false,
      post: {},
      profile: {},
      sentFrom: user.username,
    });
    setHasLoaded(false);
  };

  /**
   * Switches to home page
   * @param username the username of the current user logged on
   */
  const returnHome = (username = null, admin = false) => {
    // needed for weird bug with calling a function through props
    username = typeof username === 'string' ? username : null;

    // if a new user has logged on, change the state username
    // otherwise (i.e changing from profile to homepage), use the same
    // username
    if (username) {
      setUser({
        username: username,
        showLogin: false,
        redirect: '',
        admin: admin,
      });
    } else {
      setUser({...user, showLogin: false, redirect: ''});
    }

    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: true});
    setProfile({...profile, showProfile: false});
    setChats(false);
    setUserSettings({...settings, showSettings: false});
    setPost({...showPost, showPost: false});
    setCategory('');
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: false,
      post: {},
      profile: {},
      sentFrom: user.username,
    });
  };

  /**
   * Switches to profile page
   */
  const viewProfile = () => {
    setUser({
      username: user.username,
      showLogin: false,
      redirect: '',
      admin: user.admin,
    });
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: true});
    setChats(false);
    setUserSettings({...settings, showSettings: false});
    setPost({...showPost, showPost: false});
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: false,
      post: {},
      profile: {},
      sentFrom: user.username,
    });
  };

  /**
   * Switches to chat rooms
   */
  const viewChats = () => {
    setUser({...user, showLogin: false});
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: false});
    setChats(true);
    setUserSettings({...settings, showSettings: false});
    setPost({...showPost, showPost: false});
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: false,
      post: {},
      profile: {},
      sentFrom: user.username,
    });
    setHasLoaded(true);
  };

  /**
   * Switches to the settings page
   */
  const viewSettings = () => {
    setUser({...user, showLogin: false});
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: false});
    setChats(false);
    setUserSettings({...settings, showSettings: true});
    setPost({...showPost, showPost: false});
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: false,
      post: {},
      profile: {},
      sentFrom: user.username,
    });
  };

  /**
   * Switches to the create/edit post screen
   * @param id the id of the post
   */
  const viewPost = (id = null) => {
    setUser({...user, showLogin: false});
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: false});
    setChats(false);
    setUserSettings({...settings, showSettings: false});
    setPost({
      showPost: true,
      id: id,
    });
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: false,
      post: {},
      profile: {},
      sentFrom: user.username,
    });
  };

  /**
   * Switches to the settings page
   */
  const viewReport = (post = {}, profile_data = {}) => {
    setUser({...user, showLogin: false});
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: false});
    setChats(false);
    setUserSettings({...settings, showSettings: false});
    setPost({...showPost, showPost: false});
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: true,
      post: post,
      profile: profile_data,
      sentFrom: user.username,
    });
  };

  /**
   * Boolean on whether the user is on top of the page
   */
  const [onTop, isOnTop] = useState(true);
  const [onBottom, isOnBottom] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  /**
   * Used to detect whether the user has scrolled to the
   * top of the page.  Used in conjunction with refreshPage to
   * refresh the page when user swipes down
   * @param height the height of the scroll view
   */
  const handleScroll = (height: number) => {
    isOnTop(height <= 0 ? true : false);
    isOnBottom(height !== 0 && height >= maxHeight ? true : false);
  };

  /**
   * Maximum vertical speed considered before
   * the page will refresh
   */
  const MAX_VELOCITY = 1.5;

  /**
   * Function responsible for reloading the page.
   * Reloads if the user is on the top of all posts
   * and their swiping velocity is over a specific threshold
   * @param velocity the vertical velocity of a user's scroll
   */
  const refreshPage = (velocity: number | undefined) => {
    if (onTop && velocity && velocity > MAX_VELOCITY) {
      setHasLoaded(false);
      showPostOptions({
        showOptions: false,
        post: {},
      });
      setPosts({
        ...posts,
        showPosts: true,
      });
      setCategory('');
      setSearch({
        showSearchBar: false,
        showResults: false,
        posts: [],
      });
      fetchData();
    }
  };

  const newPage = async (velocity: number | undefined) => {
    if (onBottom && velocity && velocity > MAX_VELOCITY) {
      console.log('onBottom', onBottom, velocity, MAX_VELOCITY);
      await getPosts(page + 1);
      setPage(page + 1);
    }
  };

  /**
   * Function to delete the post in the database
   * @param id The id of the selected post
   */
  const removePost = async (id: number | string) => {
    // Note: MUST delete additional post images before deleting a post
    // To maintain foreign key integrity in the database
    await axios
      .delete(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/images/${id}/`,
      )
      .catch((err: any) => console.log(err));
    await axios
      .delete(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/posts/${id}/`,
      )
      .catch((err: any) => console.log(err));
    setDelete({
      data: {},
      deletePost: false,
    });
    await getPosts(1);
    setPage(1);
    refreshPage(MAX_VELOCITY + 1);
  };

  /**
   * Adds the current user to a list of users who've flagged
   * a specific post.  If ten or more unique users have flagged the post,
   * the flag will be physically recorded on the post and removed from
   * access on the home page
   * @param post_id the id of the post being flagged
   */
  const countFlagPost = async (post_id: number | string) => {
    await axios
      .post(`${inProdMode ? prodURL : emulator ? devURL : ngrok}/flag/`, {
        post: post_id,
        flagged_by: profile.data.id,
      })
      .then(res => {
        if (res.data.number_of_flags >= 10) {
          flagPost(post_id);
        }
      })
      .catch((err: any) => console.log(err));
  };

  /**
   * Called when at least ten unique users have flagged a post.
   * The post will no longer be visible on the home
   * @param id
   */
  const flagPost = async (id: number | string) => {
    await axios
      .patch(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/posts/${id}/`,
        {flag: true},
      )
      .catch((err: any) => console.log(err));
  };

  /**
   * async function used to record a profile rating in the database
   * @param profile_id the id of the profile being rated
   * @param score the score of the profile (out of 5)
   */
  const rateProfile = async (
    profile_id: number | string,
    score: number | string,
  ) => {
    await axios
      .post(`${inProdMode ? prodURL : emulator ? devURL : ngrok}/ratings/`, {
        username: profile_id,
        rated_by: profile.data.id,
        score: score,
      })
      .catch((err: any) => console.log(err));
  };

  const backgroundStyle = {
    backgroundColor: !user.showLogin ? 'rgb(17, 87, 64)' : 'white',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/* SaveAreaView Components make it so that developers can safely view the styling layout on different device sizes */}

      {/* Many of the created components/functions hold a props parameter.  Here is where we define what information is stored in
          that props parameter, which can then be accessed inside of the component via props.{attribute} */}

      {/* Notice how the following components will only render if the preceding conditions for each bracket is true.
          This produces the effect of changing what is seen on the screen */}

      <UserContext.Provider value={{prodURL: prodURL}}>
        {/* useContext serves as a 'global state' data access for all child components of App.jsx.
            Each file will be able to access the data in the value parameter */}

        {/* Landing Page */}
        {!hasLoaded && <Landing showLogin={user.showLogin} />}

        {/* Login/Register Page */}
        {user.showLogin && (
          <Login returnHome={returnHome} redirect={user.redirect} />
        )}

        {/* Home Page */}
        {!prodDesc.showDesc &&
          !profile.showProfile &&
          !showChats &&
          !settings.showSettings &&
          !showPost.showPost &&
          !user.showLogin &&
          !reportUser.showReport && (
            <View style={styles.container}>
              <NavBar
                searchedPosts={searchedPosts}
                posts={posts}
                searchPosts={searchPosts}
                setPosts={setPosts}
                setSearch={setSearch}
                type={'Home'}
                viewSettings={viewSettings}
                category={category}
                setCategory={setCategory}
              />
              <View style={styles.mainView}>
                <View style={styles.postOrder}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setRelevancy({...relevancy, showRelevancy: false})
                    }>
                    <View
                      style={
                        !relevancy.showRelevancy
                          ? styles.postOrderItemChosen
                          : styles.postOrderItem
                      }>
                      <Text style={styles.postOrderText}>Newest</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setRelevancy({...relevancy, showRelevancy: true})
                    }>
                    <View
                      style={
                        relevancy.showRelevancy
                          ? styles.postOrderItemChosen
                          : styles.postOrderItem
                      }>
                      <Text style={styles.postOrderText}>Relevancy</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>

                <ScrollView
                  contentInsetAdjustmentBehavior="automatic"
                  scrollEventThrottle={3}
                  onScroll={event =>
                    handleScroll(event.nativeEvent.contentOffset.y)
                  }
                  onScrollEndDrag={event => {
                    refreshPage(Math.abs(event.nativeEvent.velocity?.y));
                    newPage(Math.abs(event.nativeEvent.velocity?.y));
                  }}
                  style={styles.scrollView}>
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      opacity: !deletePost.deletePost ? 1.0 : 0.6,
                    }}
                    onLayout={e =>
                      setMaxHeight(e.nativeEvent.layout.height - 545)
                    }>
                    {posts.showPosts &&
                      relevancy.showRelevancy &&
                      relevancy.posts.map(post => {
                        if (
                          post.status !== 'SOLD' &&
                          !post.draft &&
                          !post.flag
                        ) {
                          return (
                            <Post
                              data={post}
                              setDesc={setDesc}
                              user={user}
                              setDelete={setDelete}
                              countFlagPost={countFlagPost}
                              setHasLoaded={setHasLoaded}
                              key={uuid.v4()}
                              showPostOptions={showPostOptions}
                            />
                          );
                        } else if (
                          post.username === user.username &&
                          post.draft &&
                          !errorMessage &&
                          !hasSeenDraft
                        ) {
                          setErrorMessage(
                            'You have a draft. Would you like to continue writing it?',
                          );
                          setHasSeenDraft(true);
                        }
                      })}
                    {posts.showPosts &&
                      !relevancy.showRelevancy &&
                      posts.posts.map(post => {
                        /* Only show posts not created by the user on the home page */
                        if (
                          post.status !== 'SOLD' &&
                          !post.draft &&
                          !post.flag
                        ) {
                          return (
                            <Post
                              data={post}
                              setDesc={setDesc}
                              user={user}
                              setDelete={setDelete}
                              countFlagPost={countFlagPost}
                              setHasLoaded={setHasLoaded}
                              key={uuid.v4()}
                              showPostOptions={showPostOptions}
                            />
                          );
                        } else if (
                          post.username === user.username &&
                          post.draft &&
                          !errorMessage &&
                          !hasSeenDraft
                        ) {
                          setErrorMessage(
                            'You have a draft. Would you like to continue writing it?',
                          );
                          setHasSeenDraft(true);
                        }
                      })}
                    {searchedPosts.showResults &&
                      searchedPosts.posts.length > 0 &&
                      searchedPosts.posts.map(post => {
                        return (
                          <Post
                            data={post}
                            setDesc={setDesc}
                            user={user}
                            setDelete={setDelete}
                            countFlagPost={countFlagPost}
                            setHasLoaded={setHasLoaded}
                            key={uuid.v4()}
                            showPostOptions={showPostOptions}
                          />
                        );
                      })}
                    {searchedPosts.showSearchBar &&
                      !searchedPosts.showResults && (
                        <Categories
                          category={category}
                          setCategory={setCategory}
                        />
                      )}
                  </View>
                </ScrollView>
              </View>
              {!searchedPosts.showSearchBar && (
                <View>
                  <TouchableWithoutFeedback onPress={() => viewPost()}>
                    <Image
                      source={require('./media/plus_sign.png')}
                      style={styles.addPost}
                    />
                  </TouchableWithoutFeedback>
                </View>
              )}
              {deletePost.deletePost && (
                <View
                  style={{
                    backgroundColor: Colors.white,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    top: '30%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    height: '40%',
                    rowGap: 20,
                    padding: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Are you sure you want to delete this post?
                  </Text>
                  <Post data={deletePost.data} />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      columnGap: 10,
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => removePost(deletePost.data.id)}>
                      <Text style={styles.deleteYes}>YES</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        setDelete({
                          deletePost: false,
                          data: {},
                        })
                      }>
                      <Text style={styles.deleteNo}>NO</Text>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              )}
              <Footer
                returnHome={returnHome}
                viewProfile={viewProfile}
                viewChats={viewChats}
                type={'Home'}
                hasLoaded={hasLoaded}
                chatNotifications={chatNotifications}
              />
            </View>
          )}

        {/* Product Description Page */}

        {prodDesc.showDesc && (
          <>
            <ProductDescription
              post={prodDesc.post}
              all_posts={posts.posts}
              returnHome={returnHome}
              viewChats={viewChats}
              current_user={profile.data.username}
              current_user_pfp={profile.data.profile_picture}
              viewReport={viewReport}
              rateProfile={rateProfile}
              setHasLoaded={setHasLoaded}
              hasLoaded={hasLoaded}
              setRooms={setRooms}
            />
          </>
        )}

        {/* Profile Page */}

        {profile.showProfile && (
          <View style={styles.container}>
            <NavBar
              searchedPosts={searchedPosts}
              posts={posts}
              searchPosts={searchPosts}
              setPosts={setPosts}
              setSearch={setSearch}
              type={'Profile'}
              viewSettings={viewSettings}
            />
            <Profile
              profile={profile}
              returnHome={returnHome}
              all_posts={posts.posts}
              viewSettings={viewSettings}
              viewPost={viewPost}
              current_user={user.username}
              onMain={true}
              viewReport={viewReport}
              userSettings={settings}
              getProfile={getProfile}
              setHasLoaded={setHasLoaded}
              setProfile={setProfile}
            />
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
              type={'Profile'}
              hasLoaded={hasLoaded}
              chatNotifications={chatNotifications}
            />
          </View>
        )}

        {/* Chat Rooms */}

        {showChats && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              flex: 1,
              alignContent: 'left',
            }}>
            <NavBar
              searchedPosts={searchedPosts}
              posts={posts}
              searchPosts={searchPosts}
              setPosts={setPosts}
              setSearch={setSearch}
              type={'My Chats'}
              viewSettings={viewSettings}
            />
            <Chats
              profile={profile.data}
              current_user={user.username}
              rooms={rooms}
              showChats={showChats}
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
              hasLoaded={hasLoaded}
              chatNotifications={chatNotifications}
              setChatNotifications={setChatNotifications}
              getRooms={getRooms}
            />
          </View>
        )}
        {/* Settings Page */}

        {settings.showSettings && (
          <View style={styles.container}>
            <NavBar
              searchedPosts={searchedPosts}
              posts={posts}
              searchPosts={searchPosts}
              setPosts={setPosts}
              setSearch={setSearch}
              type={'Settings'}
              viewSettings={viewSettings}
            />
            <UserSettings
              viewSettings={viewSettings}
              userSettings={settings}
              setUserSettings={setUserSettings}
              login={login}
              profile={profile.data}
              date={profile.date}
              viewProfile={viewProfile}
              violations={violations}
              fetchData={fetchData}
              setHasLoaded={setHasLoaded}
            />
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
              type={'Profile'}
              hasLoaded={hasLoaded}
              chatNotifications={chatNotifications}
            />
          </View>
        )}

        {/* Create & Edit Post Page */}

        {showPost.showPost && (
          <>
            <CreatePost
              username={user.username}
              returnHome={returnHome}
              showPost={showPost}
              getProfile={getProfile}
              setHasLoaded={setHasLoaded}
              setErrorMessage={setErrorMessage}
            />
          </>
        )}
        {reportUser.showReport && (
          <Report
            user={Object.keys(reportUser.profile).length > 0}
            isPost={Object.keys(reportUser.post).length > 0}
            post={reportUser.post}
            profile={reportUser.profile}
            returnHome={returnHome}
            current_user={user.username}
          />
        )}
        {errorMessage && user.username && (
          <View style={styles.errorMessageContainer}>
            <View style={styles.errorMessageBanner}>
              <TouchableWithoutFeedback onPress={() => setErrorMessage('')}>
                <Text style={styles.exitErrorMessage}>Exit</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.errorMessageTextContainer}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                setErrorMessage('');
                viewProfile();
              }}>
              <Text style={styles.draftMessage}>Yes</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setErrorMessage('')}>
              <Text style={styles.draftMessage}>No</Text>
            </TouchableWithoutFeedback>
          </View>
        )}
        {postOptions.showOptions &&
          !searchedPosts.showResults &&
          user.username !== postOptions.post.username && (
            <View style={styles.newPostOptionsContainer}>
              <View style={{width: '80%'}}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (postOptions.post.id) {
                      countFlagPost(postOptions.post.id);
                    }
                  }}>
                  <Text style={styles.hidePost}>Flag Post</Text>
                </TouchableWithoutFeedback>
                {user.admin && (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      showPostOptions({
                        showOptions: false,
                        post: {},
                      })
                    }>
                    <Text style={styles.deletePost}>Delete Post</Text>
                  </TouchableWithoutFeedback>
                )}
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (Object.keys(postOptions.post).length) {
                      viewReport(postOptions.post);
                    }
                    showPostOptions({
                      showOptions: false,
                      post: {},
                    });
                  }}>
                  <Text style={styles.reportPost}>Report Post</Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={{width: '80%'}}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    showPostOptions({
                      showOptions: false,
                      post: {},
                    })
                  }>
                  <Text style={styles.closePostOptions}>Close</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
      </UserContext.Provider>
    </SafeAreaView>
  );
}

// This syntax is how styling is done for React Native Components.
// Notice its similarity to CSS stylesheets
// One major difference here is that components can really only have
// two display styles: flex and none.
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  navigationBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    top: 0,
    padding: 20,
  },
  navigationBarType: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '85%',
  },
  home: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: normalize(22.5),
    padding: 10,
  },
  mainView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    // height: SCREEN_HEIGHT * 0.01,
  },
  scrollView: {
    width: '100%',
  },
  highlight: {
    fontWeight: '700',
  },
  searchButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    width: '70%',
    height: normalize(40),
  },
  post: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(10),
    borderWidth: 1,
    borderColor: 'grey',
    columnGap: 10,
  },
  postImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: normalize(75),
    height: normalize(75),
    display: 'flex',
    backgroundColor: 'black',
    borderRadius: normalize(25),
    overflow: 'hidden',
  },
  postText: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  },
  postedDate: {
    position: 'relative',
    fontStyle: 'italic',
    fontSize: normalize(10),
  },
  product: {
    fontWeight: 'bold',
    fontSize: normalize(20),
    backgroundColor: 'white',
    width: 'auto',
  },
  username: {
    fontWeight: '200',
  },
  addPost: {
    width: normalize(50),
    height: normalize(50),
    position: 'absolute',
    bottom: normalize(25),
    right: 30,
    borderRadius: normalize(35),
    overflow: 'hidden',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '80%',
    columnGap: 10,
    overflow: 'hidden',
  },
  searchButton: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(20),
    overflow: 'hidden',
  },
  cancelButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessageContainer: {
    position: 'absolute',
    top: '20%',
    left: '32.5%',
    transform: [{translateX: -50}],
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#D7D7D7',
    borderRadius: 10,
    padding: 15,
    overflow: 'hidden',
  },
  errorMessageBanner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  exitErrorMessage: {
    backgroundColor: 'rgb(17, 87, 64)',
    color: Colors.white,
    height: 20,
    width: 50,
    textAlign: 'center',
    lineHeight: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  errorMessageTextContainer: {
    display: 'flex',
    height: 70,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'black',
    textAlign: 'center',
  },
  draftMessage: {
    backgroundColor: 'rgb(17, 87, 64)',
    color: Colors.white,
    textAlign: 'center',
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  editPost: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  editButtons: {
    width: 10,
    height: 30,
    position: 'relative',
    left: 10,
  },
  postOptions: {
    padding: 10,
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
    position: 'absolute',
    right: 50,
  },
  deleteYes: {
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: 100,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
  },
  deleteNo: {
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: 100,
    backgroundColor: 'rgb(17, 87, 64)',
    color: 'white',
    textAlign: 'center',
  },
  topPortion: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  newPostOptionsContainer: {
    backgroundColor: '#F2F2F2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: normalize(10),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    padding: normalize(10),
  },
  closePostOptions: {
    color: 'black',
    backgroundColor: 'white',
    padding: normalize(15),
    borderRadius: normalize(15),
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: 'white',
    textAlign: 'center',
    fontSize: 17.5,
  },
  hidePost: {
    color: 'black',
    backgroundColor: 'white',
    padding: normalize(15),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: 'white',
    fontSize: 17.5,
  },
  reportPost: {
    color: 'black',
    backgroundColor: 'white',
    padding: normalize(15),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderColor: 'white',
    fontSize: 17.5,
  },
  deletePost: {
    color: 'black',
    backgroundColor: 'white',
    padding: normalize(15),
    fontSize: 17.5,
  },
  postOrder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postOrderItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    width: '50%',
  },
  postOrderItemChosen: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    width: '50%',
  },
  postOrderText: {
    color: 'black',
    fontSize: normalize(20),
    padding: 5,
  },
});

export default App;
