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
        </View>
        <View style={styles.editPost} />
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * @returns All possible categories for a post
 */
function Categories(props): JSX.Element {
  //Component that displays all of the possible categories for a post.
  //Shown when the user is performing a search

  const categories = [
    'Furniture',
    'Clothing',
    'Free Stuff',
    'Vehicles',
    'W&M Merch',
    'Hobbies',
    'Office Supplies',
    'Dorm Goods',
    'Food',
    'Entertainment',
    'Books/Textbooks',
    'Misc.',
  ];

  return (
    <View style={styles.category}>
      {categories.map(value => {
        return (
          <>
            <TouchableWithoutFeedback onPress={() => props.setCategory(value)}>
              <View
                style={
                  props.category === value
                    ? styles.categoryItemSelected
                    : styles.categoryItem
                }>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: 'gray',
                    borderRadius: 10,
                    width: 80,
                    height: 80,
                  }}
                />
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
  });

  const [settings, setSettingsTitle] = useState({
    settings: false,
    text: 'Settings',
  });

  const [showPost, setPost] = useState({
    showPost: false,
    id: null,
  });

  const [showChats, setChats] = useState(false);

  const [showSettings, setSettings] = useState(false);

  const [category, setCategory] = useState('');
  const [reportUser, setReporting] = useState({
    showReport: false,
    post: {},
    profile: {},
    sentFrom: user.username,
  });

  // When the defined components finish rendering, fetch
  // The posts that are currently stored in the database
  useEffect(() => {
    fetchData();
  }, [user.username]);

  // The axios is a JavaScript library that is used to perform
  // various HTTP requests from existing API's.  Common HTTP requests
  // include get, post, put, and delete
  const fetchData = async () => {
    // asynchronous function that gets all existing posts
    await axios
      .get('http://10.0.2.2:8000/posts')
      .then(res => {
        setPosts({
          showPosts: true,
          posts: res.data,
        });
      })
      .catch((err: any) => console.log(err));

    // asynchronous function that gets the profile information
    // for the given username
    // TODO: Create a state variable for the user that is logged in

    if (user.username) {
      await axios
        .get('http://10.0.2.2:8000/profile/' + user.username)
        .then(res => {
          setProfile({
            showProfile: false,
            data: res.data,
          });
        })
        .catch((err: any) => console.log(err));
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

      var desc = posts.posts[i].description
        .toLowerCase()
        .split(' ')
        .filter((value: string) => {
          // eslint-disable-next-line prettier/prettier
              return ((value !== 'and') && (value !== 'the'));
        });

      var post_category = posts.posts[i].category;

      input.forEach((element: any) => {
        if (category.length) {
          if (
            category.toUpperCase() === post_category &&
            (prod.includes(element) || desc.includes(element))
          ) {
            try {
              results.push(posts.posts[i]);
            } catch {
              console.log('error');
            }
          }
        } else {
          if (prod.includes(element) || desc.includes(element)) {
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
    setProfile({...profile, showProfile: false});
    setChats(false);
    setSettings(false);
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
    setSettings(false);
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
    setSettings(false);
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
    setSettings(false);
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
    setSettings(true);
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
   * @param id
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
    setSettings(false);
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
    setSettings(false);
    setPost({...showPost, showPost: false});
    setSearch({...searchedPosts, showSearchBar: false});
    setReporting({
      showReport: true,
      post: post,
      profile: profile_data,
      sentFrom: user.username,
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/* SaveAreaView Components make it so that developers can safely view the styling layout on different device sizes */}

      {/* Many of the created components/functions hold a props parameter.  Here is where we define what information is stored in
      that props parameter, which can then be accessed inside of the component via props.{attribute} */}

      {/* Notice how the following components will only render if the preceding conditions for each bracket is true.
          This produces the effect of changing what is seen on the screen */}

      {/* Login/Register Page */}
      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
        !showPost.showPost &&
        user.showLogin &&
        !reportUser.showReport && (
          <Login returnHome={returnHome} redirect={user.redirect} />
        )}

      {/* Home Page */}
      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
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
                      post.status !== 'SOLD'
                    ) {
                      return <Post data={post} setDesc={setDesc} />;
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

      {prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
        !showPost.showPost &&
        !user.showLogin &&
        !reportUser.showReport && (
          <>
            <ProductDescription
              post={prodDesc.post}
              returnHome={returnHome}
              viewChats={viewChats}
              current_user={profile.data.username}
              current_user_pfp={profile.data.profile_picture}
              viewReport={viewReport}
            />
          </>
        )}

      {/* Profile Page */}

      {!prodDesc.showDesc &&
        profile.showProfile &&
        !showChats &&
        !showSettings &&
        !showPost.showPost &&
        !user.showLogin &&
        !reportUser.showReport && (
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
              profile={profile.data}
              returnHome={returnHome}
              posts={posts.posts}
              viewSettings={viewSettings}
              viewPost={viewPost}
              current_user={user.username}
              onMain={true}
              viewReport={viewReport}
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

      {!prodDesc.showDesc &&
        !profile.showProfile &&
        showChats &&
        !showSettings &&
        !showPost.showPost &&
        !user.showLogin &&
        !reportUser.showReport && (
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

      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        showSettings &&
        !showPost.showPost &&
        !user.showLogin &&
        !reportUser.showReport && (
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
              settings={settings}
              setSettingsTitle={setSettingsTitle}
              login={login}
              profile={profile.data}
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

      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
        showPost.showPost &&
        !user.showLogin &&
        !reportUser.showReport && (
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
    backgroundColor: 'rgb(17, 87, 64)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 20,
    rowGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
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
    padding: 10,
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
});

export default App;
