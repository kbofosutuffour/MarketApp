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

function Footer(): JSX.Element {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        <Image source={require('./media/home-05.png')} />
        <Image source={require('./media/message-chat-square.png')} />
        <Image source={require('./media/user-01.png')} />
      </View>
    </View>
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
}): JSX.Element {
  return (
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

  useEffect(() => {
    axios
      .get('http://10.0.2.2:8000/posts')
      .then(res => {
        setPosts({
          showPosts: true,
          posts: res.data,
        });
        console.log(res.data);
      })
      .catch((err: any) => console.log(err));
  }, []);

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
      console.log(posts.posts[i])
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
          console.log(prod, desc, element);
          add_item = true;
        }
      });
      if (add_item) {
        try {
          console.log(i);
          results.push(posts.posts[i]);
        } catch {
          console.log('');
        }
      }
      add_item = false;
    }

    setSearch({
      showSearchBar: true,
      showResults: true,
      posts: results,
    });

    // return temp;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar backgroundColor={backgroundStyle.backgroundColor} />
      <View style={styles.navigationBar}>
        <View>
          <Text style={styles.home}>Home</Text>
        </View>
        <View style={{width: 180}}>
          {searchedPosts.showSearchBar && (
            <TextInput
              style={styles.input}
              onSubmitEditing={text => searchPosts(text.nativeEvent.text)}
            />
          )}
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            setSearch({...searchedPosts, showSearchBar: true});
            setPosts({...posts, showPosts: false});
          }}>
          <View style={styles.searchContainer}>
            <Image source={require('./media/search.png')} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.goldBar}></View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {posts.showPosts &&
            posts.posts.map(post => {
              return <Post data={post} />;
            })}
          {searchedPosts.showResults &&
            searchedPosts.posts.length > 0 &&
            searchedPosts.posts.map(post => {
              return <Post data={post} />;
            })}
          {searchedPosts.showSearchBar && !searchedPosts.showResults && (
            <Categories />
          )}
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // sectionContainer: {
  //   marginTop: 32,
  //   paddingHorizontal: 24,
  // },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
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
    paddingTop: 20,
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
});

export default App;
