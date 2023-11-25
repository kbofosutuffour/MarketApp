/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
// import uuid from 'react-native-uuid';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  // DebugInstructions,
  // LearnMoreLinks,
  // ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import axios from 'axios';
import ProductDescription from './ProductDescription';
import Profile from './Profile';
import Chats from './Chats';
import UserSettings from './UserSettings';
import CreatePost from './Post';

function Footer(props): JSX.Element {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.goldBar} />
      <View style={styles.footer}>
        <TouchableWithoutFeedback onPress={props.returnHome}>
          <Image source={require('./media/home-05.png')} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={props.viewChats}>
          <Image source={require('./media/message-chat-square.png')} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={props.viewProfile}>
          <Image source={require('./media/user-01.png')} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

function NavBar(props): JSX.Element {
  return (
    <>
      <View style={styles.navigationBar}>
        <View>
          <Text style={styles.home}>{props.type}</Text>
        </View>
        <View style={{width: 180}}>
          {props.searchedPosts.showSearchBar && (
            <TextInput
              style={styles.input}
              onSubmitEditing={text => props.searchPosts(text.nativeEvent.text)}
            />
          )}
        </View>
        {props.type === 'Home' && (
          <TouchableWithoutFeedback
            onPress={() => {
              props.setSearch({...props.searchedPosts, showSearchBar: true});
              props.setPosts({...props.posts, showPosts: false});
            }}>
            <View style={styles.searchContainer}>
              <Image source={require('./media/search.png')} />
            </View>
          </TouchableWithoutFeedback>
        )}
        {props.type === 'Profile' && (
          <TouchableWithoutFeedback
            onPress={() => {
              props.viewSettings();
            }}>
            <View style={styles.searchContainer}>
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
    <TouchableWithoutFeedback
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
          <Text>{props.data.product}</Text>
          <Text>{props.data.username}</Text>
          <Text>${props.data.price}</Text>
        </View>
        <View style={styles.editPost}></View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function Categories(): JSX.Element {
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
          <View style={styles.categoryItem}>
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
        );
      })}
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'rgb(17, 87, 64)',
    flex: 1,
  };

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

  const [showChats, setChats] = useState(false);

  const [showSettings, setSettings] = useState(false);
  const [showPost, setPost] = useState({
    showPost: false,
    id: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios
      .get('http://10.0.2.2:8000/posts')
      .then(res => {
        console.log(res.data)
        setPosts({
          showPosts: true,
          posts: res.data,
        });
      })
      .catch((err: any) => console.log(err));
    await axios
      .get('http://10.0.2.2:8000/profile/NarutoUzumaki')
      .then(res => {
        console.log(res.data, res.data.id, 'id')
        setProfile({
          showProfile: false,
          data: res.data,
        });
      })
      .catch((err: any) => console.log(err));
  };

  const searchPosts = (text: string) => {
    var results: any[] = [];

    var prepositions = ['the', 'and', 'or', 'at', 'in', 'of'];
    var input = text
      .toLowerCase()
      .split(' ')
      .filter(value => {
        return !prepositions.includes(value);
      });
    var add_item = false;
    for (let i = 0; i < posts.posts.length; i++) {
      var prod = posts.posts[i].product
        .toLowerCase()
        .split(' ')
        .filter((value: string) => {
          // eslint-disable-next-line prettier/prettier
              return ((value != 'and') && (value != 'the'))
        });

      var desc = posts.posts[i].description
        .toLowerCase()
        .split(' ')
        .filter((value: string) => {
          // eslint-disable-next-line prettier/prettier
              return ((value != 'and') && (value != 'the'));
        });

      input.forEach((element: any) => {
        if (prod.includes(element) || desc.includes(element)) {
          add_item = true;
        }
      });
      if (add_item) {
        try {
          results.push(posts.posts[i]);
        } catch {
          console.log('error');
        }
      }
      add_item = false;
    }

    setSearch({
      showSearchBar: true,
      showResults: true,
      posts: results,
    });
  };

  const returnHome = () => {
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: true});
    setProfile({...profile, showProfile: false});
    setChats(false);
    setSettings(false);
    setPost({...showPost, showPost: false});
  };

  const viewProfile = () => {
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: true});
    setChats(false);
    setSettings(false);
    setPost({...showPost, showPost: false});
  };

  const viewChats = () => {
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: false});
    setChats(true);
    setSettings(false);
    setPost({...showPost, showPost: false});
  };

  const viewSettings = () => {
    setDesc({
      showDesc: false,
      post: {},
    });
    setPosts({...posts, showPosts: false});
    setProfile({...profile, showProfile: false});
    setChats(false);
    setSettings(true);
    setPost({...showPost, showPost: false});
  };

  const viewPost = (id = null) => {
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
    console.log('test')
  };

  const [settings, setSettingsTitle] = useState({
    settings: false,
    text: 'Settings',
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
        !showPost.showPost && (
          <View>
            <NavBar
              searchedPosts={searchedPosts}
              posts={posts}
              searchPosts={searchPosts}
              setPosts={setPosts}
              setSearch={setSearch}
              type={'Home'}
              viewSettings={viewSettings}
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
                    return <Post data={post} setDesc={setDesc} />;
                  })}
                {searchedPosts.showResults &&
                  searchedPosts.posts.length > 0 &&
                  searchedPosts.posts.map(post => {
                    return <Post data={post} setDesc={setDesc} />;
                  })}
                {searchedPosts.showSearchBar && !searchedPosts.showResults && (
                  <Categories />
                )}
              </View>
            </ScrollView>
            <View>
              <TouchableWithoutFeedback onPress={() => viewPost()}>
                <Image
                  source={require('./media/plus_sign.png')}
                  style={styles.addPost}
                />
              </TouchableWithoutFeedback>
            </View>
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
            />
          </View>
        )}
      {prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
        !showPost.showPost && (
          <>
            <ProductDescription post={prodDesc.post} returnHome={returnHome} />
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
            />
          </>
        )}
      {!prodDesc.showDesc &&
        profile.showProfile &&
        !showChats &&
        !showSettings &&
        !showPost.showPost && (
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
            />
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
            />
          </>
        )}
      {!prodDesc.showDesc &&
        !profile.showProfile &&
        showChats &&
        !showSettings &&
        !showPost.showPost && (
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
            <Chats profile={profile.data} />
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
            />
          </>
        )}
      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        showSettings &&
        !showPost.showPost && (
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
            />
            <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
            />
          </>
        )}
      {!prodDesc.showDesc &&
        !profile.showProfile &&
        !showChats &&
        !showSettings &&
        showPost.showPost && (
          <>
            {/* <NavBar
              searchedPosts={searchedPosts}
              posts={posts}
              searchPosts={searchPosts}
              setPosts={setPosts}
              setSearch={setSearch}
              type={'Settings'}
              viewSettings={viewSettings}
            /> */}
            <CreatePost
              username={'admin'}
              returnHome={returnHome}
              showPost={showPost}
            />
            {/* <Footer
              returnHome={returnHome}
              viewProfile={viewProfile}
              viewChats={viewChats}
            /> */}
          </>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 20,
    padding: 20,
  },
  home: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 30,
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: 7.5,
  },
  scrollView: {
    height: '82.5%',
  },
  highlight: {
    fontWeight: '700',
  },
  searchContainer: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 180,
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
  footerContainer: {
    flex: 1,
    backgroundColor: 'rgb(17, 87, 64)',
    height: 85,
  },
  footer: {
    display: 'flex',
    backgroundColor: 'rgb(17, 87, 64)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 40,
    paddingTop: 20,
  },
  footerImage: {
    width: 100,
    height: 100,
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  addPost: {
    width: 75,
    height: 75,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 35,
  },
});

export default App;
