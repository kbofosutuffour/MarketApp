import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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
    <TouchableWithoutFeedback>
      <View style={styles.post}>
        <View style={styles.postImageContainer}>
          <Image
            style={styles.postImage}
            source={{
              uri: props.data.display_image,
            }}
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

function Profile(props): JSX.Element {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    var request =
      // eslint-disable-next-line prettier/prettier
      'http://10.0.2.2:8000/posts/get_posts/' + props.profile.username;
    axios
      .get(request)
      .then(res => {
        console.log(res.data)
        setPosts(res.data);
      })
      .catch((err: any) => console.log(err));
  }, []);

  return (
    <View style={styles.profilePage}>
      {/* {console.log(props.profile)} */}
      <View style={styles.profileView}>
        <Image
          style={styles.profilePicture}
          source={{uri: 'http://10.0.2.2:8000' + props.profile.profile_picture}}
        />
        <View>
          <Text>{props.profile.username}</Text>
          {/* <Button>Edit Profile</Button> */}
        </View>
      </View>
      <View style={styles.typeView}>
        <View style={styles.typeViewItem}>
          <Text>Sell History</Text>
        </View>
        <View style={styles.typeViewItem}>
          <Text>Buy History</Text>
        </View>
        <View style={styles.typeViewItem}>
          <Text>Saved Posts</Text>
        </View>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          {posts.map(post => {
            return <Post data={post} setDesc={props.setDesc} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  profilePage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginLeft: 50
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
  editPost: {
    backgroundColor: 'white',
  },
});
export default Profile;
