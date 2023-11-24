import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {
  Button,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as ImagePicker from 'expo-image-picker';
import DocumentPicker from 'react-native-document-picker';

// function EditPost(props): JSX.Element {
//   const [post, setPost] = useState({});

//   useEffect(() => {
//     fetchData(props.id);
//   }, []);

//   const fetchData = async id => {
//     await axios
//       .get('http://10.0.2.2:8000/posts/' + id)
//       .then(res => {
//         props.setPost({
//           product: res.data.product,
//           username: res.data.username,
//           display_image: res.data.display_image,
//           description: res.data.description,
//           price: res.data.price,
//           draft: res.data.draft,
//           category: res.data.category,
//           status: res.data.status,
//         });
//       })
//       .catch((err: any) => console.log(err));
//   };
// }

function NewPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const postData = async () => {
    await axios
      .post('http://10.0.2.2:8000/posts/', props.post)
      .then(response => {
        console.log(response);
      })
      .catch((err: any) => console.log(err));
  };

  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // If permission is denied, show an alert
      Alert.alert(
        'Permission Denied',
        `Sorry, we need camera
             roll permission to upload images.`,
      );
    } else {
      // Launch the image library and get
      // the selected image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // If an image is selected (not cancelled),
        // update the file state variable
        props.setPost({...props.post, display_image: result.assets[0].uri});

        // Clear any previous errors
        // setError(null);
      }
    }
  };

  const chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    let temp = JSON.stringify(res);
    let final = JSON.parse(temp);
    // console.log('res : ', final[0].uri);
    props.setPost({...props.post, display_image: final[0].uri});
  };

  return (
    <>
      <View style={styles.postItem}>
        <Button title="Select your display image" onPress={chooseImage} />
        {console.log(props.post)}
        {props.post.display_image && (
          <Image
            source={{uri: props.post.display_image}}
            style={{width: 200, height: 200}}
          />
        )}
      </View>
      <View style={styles.postItem}>
        <TextInput
          placeholder="Product"
          onChangeText={value => props.setPost({...props.post, product: value})}
          style={styles.input}
        />
      </View>
      <View style={styles.postItem}>
        <TextInput
          placeholder="Price"
          onChangeText={value => {
            if (Number(value)) {
              props.setPost({...props.post, price: Number(value)});
            }
          }}
          style={styles.input}
        />
      </View>
      <View style={styles.postItem}>
        <TextInput placeholder="Title" style={styles.input} />
      </View>
      <View style={styles.postItem}>
        <Text>{props.post.draft ? 'Save as Draft' : 'Save as Post'}</Text>
        <Switch
          onValueChange={() =>
            props.setPost({...props.post, draft: !props.post.draft})
          }
        />
      </View>
      <View style={styles.postItem}>
        <Button
          title="SELLING"
          color={
            props.post.status === 'SELLING' ? 'rgb(185, 151, 91)' : Colors.blue
          }
          onPress={() => {
            props.setPost({...props.post, status: 'SELLING'});
          }}
        />
        <Button
          title="PENDING"
          color={
            props.post.status === 'PENDING' ? 'rgb(185, 151, 91)' : Colors.blue
          }
          onPress={() => {
            props.setPost({...props.post, status: 'PENDING'});
          }}
        />
        <Button
          title="SOLD"
          color={
            props.post.status === 'SOLD' ? 'rgb(185, 151, 91)' : Colors.blue
          }
          onPress={() => props.setPost({...props.post, status: 'SOLD'})}
        />
      </View>
      <View style={styles.postItem}>
        <TextInput
          placeholder="Write a description for your product here:"
          numberOfLines={4}
          style={styles.input}
        />
      </View>

      <Button
        title="SUBMIT"
        onPress={() => {
          postData();
          props.returnHome();
        }}
      />
    </>
  );
}

function CreatePost(props): JSX.Element {
  const [view, setView] = useState({
    newPost: true,
    editPost: false,
  });

  const [post, setPost] = useState({
    product: null,
    username: props.username,
    display_image: null,
    description: null,
    price: null,
    draft: false,
    category: null,
    status: null,
  });

  const categories = [
    'CLOTHING',
    'FURNITURE',
    'FREE_STUFF',
    'VEHICLES',
    'TECHNOLOGY',
    'HOBBIES',
    'OFFICE_SUPPLIES',
    'DORM_GOODS',
    'FOOD',
    'ENTERTAINMENT',
    'BOOKS',
    'MISC',
  ];

  const status = ['SELLING', 'PENDING', 'SOLD'];

  return (
    <>
      <View style={styles.postContainer}>
        <Button title={'Cancel'} onPress={props.returnHome} />
        {view.newPost && (
          <NewPost
            post={post}
            setPost={setPost}
            status={status}
            categories={categories}
            returnHome={props.returnHome}
          />
        )}
        {/* {view.editPost && <EditPost post={post} setPost={setPost} />} */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  postItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    padding: 5,
  },
  input: {
    width: '70%',
    // borderColor: 'gray',
    // borderWidth: 0.5,
  },
});

export default CreatePost;
