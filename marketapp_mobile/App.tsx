/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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

import vehicles from './media/categories/Vehicles-96.png';
import food from './media/categories/Food-96.png';
import clothes from './media/categories/Clothes-96.png';
import entertainment from './media/categories/Entertainments-96.png';
import free_stuff from './media/categories/Free_stuff-96.png';
import furniture from './media/categories/Furniture-96.png';
import hobbies from './media/categories/Hobbies-96.png';
import book from './media/categories/Book-96.png';
import dorm_goods from './media/categories/Dorm_goods-96.png';
import supplies from './media/categories/Office_Supplies-96.png';
import misc from './media/categories/Misc-96.png';
import wm_logo from './media/categories/wm_logo.jpg';

import {formatDistance} from 'date-fns';

function Footer(props): JSX.Element {
  //Footer component that is displayed on various screens
  return (
    <View style={styles.footerContainer}>
      <View style={styles.goldBar} />
      <View style={styles.footer}>
        <View // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:
              props.type === 'Home' ? 'rgb(185, 151, 91)' : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback onPress={props.returnHome}>
            <Image source={require('./media/home-05.png')} />
          </TouchableWithoutFeedback>
        </View>
        <View // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:
              props.type === 'Chats' ? 'rgb(185, 151, 91)' : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback onPress={props.viewChats}>
            <Image source={require('./media/message-chat-square.png')} />
          </TouchableWithoutFeedback>
        </View>
        <View // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:
              props.type === 'Profile'
                ? 'rgb(185, 151, 91)'
                : 'rgb(17, 87, 64)',
            borderRadius: 30,
          }}>
          <TouchableWithoutFeedback onPress={props.viewProfile}>
            <Image source={require('./media/user-01.png')} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

function NavBar(props): JSX.Element {
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
                    <View
                      style={styles.searchButton}
                      // source={require('./media/user-01.png')}
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
                    <View
                      style={styles.searchButton}
                      // source={require('./media/user-01.png')}
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
                  <Image source={require('./media/search.png')} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </>
        )}

        {/* Show the settings icon if the user is on the home screen */}
        {props.type === 'Profile' && (
          <TouchableWithoutFeedback
            onPress={() => {
              props.viewSettings();
            }}>
            <View style={styles.searchButtonContainer}>
              <Image
                source={require('./media/settings.png')}
                style={{width: 50, height: 50}}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      <View style={styles.goldBar} />
    </>
  );
}

function Post(props: {
  //Component that holds the information on the provided post in the props object
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
  /**
   * Get's the number of seconds since the post has been created
   * @param postDateTime the datetime of the post
   * @returns the the number of seconds since the post has been created
   */
  const getDifference = (postDateTime: string) => {
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
  };

  return (
    <TouchableWithoutFeedback //Makes the post component react to a tap
      onPress={() => {
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
          <Text>{props.data.username}</Text>
          <Text>${props.data.price}</Text>
          <Text style={{position: 'relative', top: 20, fontStyle: 'italic'}}>
            {'Posted ' + getDifference(props.data.date) + ' ago'}
          </Text>
        </View>
        <View style={styles.editPost} />
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * Component that displays all of the possible categories for a post.
 * Shown when the user is performing a search
 * @returns All possible categories for a post
 */
function Categories(props): JSX.Element {
  const categories = {
    Furniture: furniture,
    Clothing: clothes,
    'Free Stuff': free_stuff,
    Vehicles: vehicles,
    'W&M Merch': wm_logo,
    Hobbies: hobbies,
    'Office Supplies': supplies,
    'Dorm Goods': dorm_goods,
    Food: food,
    Entertainment: entertainment,
    'Books/Textbooks': book,
    'Misc.': misc,
  };

  return (
    <View style={styles.category}>
      {Object.keys(categories).map(value => {
        return (
          <>
            <TouchableWithoutFeedback onPress={() => props.setCategory(value)}>
              <View
                style={
                  props.category === value
                    ? styles.categoryItemSelected
                    : styles.categoryItem
                }>
                <Image source={categories[value]} />
                <Text>{value}</Text>
              </View>
            </TouchableWithoutFeedback>
          </>
        );
      })}
    </View>
  );
}

/**
 * @returns Application that is displayed on the screen
 */
function App(): JSX.Element {
  //The main component that is displayed on the screen.

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'rgb(17, 87, 64)',
    flex: 1,
  };

  //These state variables dictate the what screen is currently being displayed
  //Some state variables hold data that is used in that screen state
  const [user, setUser] = useState({
    username: null,
    showLogin: true,
    redirect: '',
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

  const [showPost, setPost] = useState({
    showPost: false,
    id: null,
  });

  const [showChats, setChats] = useState(false);

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

  const [hasloaded, setHasLoaded] = useState(false);

  // When the defined components finish rendering, fetch
  // posts and profile informaiton from the database
  useEffect(() => {
    fetchData();
  }, [user.username]);

  // Used to remove the landing screen if a user is logged in
  // and their data has been retrieved from the database
  useEffect(() => {
    if (Object.keys(profile.data).length) {
      setHasLoaded(true);
    }
  }, [profile]);

  // The axios is a JavaScript library that is used to perform
  // various HTTP requests from existing API's.  Common HTTP requests
  // include get, post, put, and delete

  /**
   * gets all posts stored in the database as well as profile information
   * of the current user
   */
  const fetchData = async () => {
    // asynchronous function that gets all existing posts
    await axios
      .get('http://10.0.2.2:8000/posts')
      .then(res => {
        if (res.data.length === 0) {
          setErrorMessage(
            'There are currently no posts.  Create a post or try again later.',
          );
        }
        setPosts({
          showPosts: true,
          posts: res.data,
        });
      })
      .catch((err: any) => {
        console.log(err);
        // setErrorMessage(
        //   'There are currently no posts.  Create a post or try again later.',
        // );
      });

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
        .get('http://10.0.2.2:8000/profile/' + user.username)
        .then(res => {
          data.showProfile = false;
          data.data = res.data;
        })
        .catch((err: any) => console.log(err));
      await axios
        .get('http://10.0.2.2:8000/rooms/get_rooms/' + user.username)
        .then(res => {
          setRooms(res.data);
        })
        .catch((err: any) => console.log(err));
      let profile_id;
      await axios
        .get('http://10.0.2.2:8000/profiles/get_date_created/' + user.username)
        .then(res => {
          data.date = res.data.date.split('-');
        });
      await axios
        .get('http://10.0.2.2:8000/profiles/get_id/' + user.username)
        .then(res => {
          profile_id = res.data.id;
          data.id = res.data.id;
        });
      await axios
        .get('http://10.0.2.2:8000/posts/get_posts/' + user.username)
        .then(res => {
          data.posts = res.data;
        });
      await axios
        .get('http://10.0.2.2:8000/profiles/get_liked_posts/' + user.username)
        .then(res => {
          data.liked_posts = res.data.liked_posts;
        });
      await axios
        .get('http://10.0.2.2:8000/user_settings/' + profile_id)
        .then(res => {
          data.settings = res.data;
          setUserSettings({...settings, data: res.data});
        });
      setProfile(data);
    }
  };

  // function used to show results of a user search
  /**
   * Function used to show results of a user's search
   * @param text user's input on the search bar
   */
  const searchPosts = (text: string, category: string) => {
    var results: any[] = [];

    var prepositions = ['the', 'and', 'or', 'at', 'in', 'of'];
    var input = text
      .toLowerCase()
      .split(' ')
      .filter(value => {
        return !prepositions.includes(value);
      });
    for (let i = 0; i < posts.posts.length; i++) {
      var prod = posts.posts[i].product
        .toLowerCase()
        .split(' ')
        .filter((value: string) => {
          // eslint-disable-next-line prettier/prettier
              return ((value !== 'and') && (value !== 'the'))
        });

      let desc = posts.posts[i].description
        .toLowerCase()
        .split(' ')
        .filter((value: string) => {
          // eslint-disable-next-line prettier/prettier
              return ((value !== 'and') && (value !== 'the'));
        });

      let post_category = posts.posts[i].category;
      let post_username = posts.posts[i].username;

      input.forEach((element: any) => {
        if (category.length) {
          if (
            category.toUpperCase() === post_category &&
            (prod.includes(element) || desc.includes(element)) &&
            post_username !== user.username
          ) {
            try {
              results.push(posts.posts[i]);
            } catch {
              console.log('error');
            }
          }
        } else {
          if (
            (prod.includes(element) || desc.includes(element)) &&
            post_username !== user.username
          ) {
            try {
              results.push(posts.posts[i]);
            } catch {
              console.log('error');
            }
          }
        }
      });
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
  const returnHome = (username = null) => {
    // needed for weird bug with calling a function through props
    username = typeof username === 'string' ? username : null;

    // if a new user has logged on, change the state username
    // otherwise (i.e changing from profile to homepage), use the same
    // username
    if (username) {
      setUser({username: username, showLogin: false, redirect: ''});
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

  /**
   * Used to detect whether the user has scrolled to the
   * top of the page.  Used in conjunction with refreshPage to
   * refresh the page when user swipes down
   * @param height the height of the scroll view
   */
  const handleScroll = (height: number) => {
    isOnTop(height === 0 ? true : false);
  };

  /**
   * Maximum vertical speed considered before
   * the page will refresh
   */
  const MAX_VELOCITY = 4;

  /**
   * Function responsible for reloading the page.
   * Reloads if the user is on the top of all posts
   * and their swiping velocity is over a specific threshold
   * @param velocity the vertical velocity of a user's scroll
   */
  const refreshPage = (velocity: number | undefined) => {
    if (onTop && velocity && velocity > MAX_VELOCITY) {
      setHasLoaded(false);
      fetchData();
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/* SaveAreaView Components make it so that developers can safely view the styling layout on different device sizes */}

      {/* Many of the created components/functions hold a props parameter.  Here is where we define what information is stored in
      that props parameter, which can then be accessed inside of the component via props.{attribute} */}

      {/* Notice how the following components will only render if the preceding conditions for each bracket is true.
          This produces the effect of changing what is seen on the screen */}

      {/* Landing Page */}
      {!hasloaded && <Landing showLogin={user.showLogin} />}

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
          <View>
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
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              scrollEventThrottle={3}
              onScroll={event =>
                handleScroll(event.nativeEvent.contentOffset.y)
              }
              onScrollEndDrag={event =>
                refreshPage(event.nativeEvent.velocity?.y)
              }
              style={styles.scrollView}>
              <View
                style={{
                  backgroundColor: isDarkMode ? Colors.black : Colors.white,
                }}>
                {posts.showPosts &&
                  posts.posts.map(post => {
                    /* Only show posts not created by the user on the home page */
                    if (
                      post.username !== user.username &&
                      post.status !== 'SOLD' &&
                      !post.draft
                    ) {
                      return <Post data={post} setDesc={setDesc} />;
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
                    return <Post data={post} setDesc={setDesc} />;
                  })}
                {searchedPosts.showSearchBar && !searchedPosts.showResults && (
                  <Categories category={category} setCategory={setCategory} />
                )}
              </View>
            </ScrollView>
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
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
              type={'Home'}
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
          />
        </>
      )}

      {/* Profile Page */}

      {profile.showProfile && (
        <>
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
          />
          <Footer
            returnHome={returnHome}
            viewProfile={viewProfile}
            viewChats={viewChats}
            type={'Profile'}
          />
        </>
      )}

      {/* Chat Rooms */}

      {showChats && (
        <>
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
            viewChats={viewChats}
            current_user={user.username}
            rooms={rooms}
          />
          <Footer
            returnHome={returnHome}
            viewProfile={viewProfile}
            viewChats={viewChats}
            type={'Chats'}
          />
        </>
      )}

      {/* Settings Page */}

      {settings.showSettings && (
        <>
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
          />
          <Footer
            returnHome={returnHome}
            viewProfile={viewProfile}
            viewChats={viewChats}
            type={'Profile'}
          />
        </>
      )}

      {/* Create & Edit Post Page */}

      {showPost.showPost && (
        <>
          <CreatePost
            username={user.username}
            returnHome={returnHome}
            showPost={showPost}
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
    </SafeAreaView>
  );
}

// This syntax is how styling is done for React Native Components.
// Notice its similarity to CSS stylesheets
// One major difference here is that components can really only have
// two display styles: flex and none.
const styles = StyleSheet.create({
  navigationBar: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    height: '10%',
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
    fontSize: 30,
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '1%',
  },
  scrollView: {
    height: '82%',
  },
  highlight: {
    fontWeight: '700',
  },
  searchButtonContainer: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '70%',
    height: '80%',
  },
  post: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
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
  },
  product: {
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: 'white',
    width: 'auto',
  },
  username: {
    fontWeight: '200',
  },
  editPost: {
    backgroundColor: 'white',
  },
  category: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  categoryItem: {
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
  },
  categoryItemSelected: {
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    borderWidth: 5,
    borderColor: 'rgb(185, 151, 91)',
  },
  footerContainer: {
    flex: 1,
    backgroundColor: 'rgb(17, 87, 64)',
    height: '10%',
  },
  footer: {
    display: 'flex',
    backgroundColor: 'rgb(17, 87, 64)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 40,
    paddingTop: 10,
    paddingBottom: 10,
  },
  addPost: {
    width: 75,
    height: 75,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 35,
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
  },
  searchButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: Colors.black,
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
  },
});

export default App;
