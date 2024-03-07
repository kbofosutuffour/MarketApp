/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';

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
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as ImagePicker from 'expo-image-picker';
// import DocumentPicker from 'react-native-document-picker';
import {UserContext} from './App';
import {Categories} from './Categories';
import {normalize} from './Profile';

function EditPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const [display, setDisplay] = useState('');
  const [images, setImages] = useState([]);
  const [newData, setNewData] = useState(null);
  const [category, showCategory] = useState(false);
  const [postCategory, setPostCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inProdMode = false;
  const emulator = false;
  const devURL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000';
  const prodURL = 'https://marketappwm-django-api.link';
  const ngrok = 'https://classic-pegasus-factual.ngrok-free.app';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/posts/${props.id}`,
      )
      .then(response => {
        props.setPost(response.data);
        setDisplay(response.data.display_image);
      })
      .catch((err: any) => console.log(err));

    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/images/${
          props.id
        }`,
      )
      .then(response => {
        let response_images = Object.values(response.data);
        let newList = [];
        for (let i = 0; i < response_images.length; i++) {
          if (typeof response_images[i] !== 'number') {
            newList.push(response_images[i]);
          }
        }
        setImages(newList);
      })
      .catch((err: any) => console.log(err));
  };

  const postData = async () => {
    let data = new FormData();
    for (const [key, value] of Object.entries(props.post)) {
      if (key === 'display_image') {
        let displayLength = display.split('.').length;
        data.append('display_image', {
          uri: display,
          type: 'image/jpeg',
          name: 'image.png',
        });
      } else {
        data.append(key, value);
      }
    }

    await axios
      .patch(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/edit_post/${
          props.id
        }/`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(() => props.returnHome())
      .catch((err: any) => {
        setErrorMessage(
          'There was a problem creating the post.  Please try again',
        );
        console.log(err);
      });
  };

  const chooseImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!res.canceled) {
      let image = {
        uri: res.assets[0].uri,
        type: 'image/jpeg',
        name: 'image.png',
      };
      props.setPost({
        ...props.post,
        display_image: {
          uri: res.assets[0].uri,
          type: 'image/jpeg',
          name: 'image.png',
        },
      });
      setNewData(image);
      setDisplay(res.assets[0].uri);
    }
  };

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '90%',
          opacity: category ? 0.6 : 1.0,
        }}>
        <ScrollView>
          <View style={styles.postItem}>
            <TouchableWithoutFeedback onPress={chooseImage}>
              <Text
                style={{
                  backgroundColor: 'rgb(17, 87, 64)',
                  padding: 10,
                  textAlign: 'center',
                  fontSize: normalize(15),
                  color: 'white',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                Select your image(s)
              </Text>
            </TouchableWithoutFeedback>
            <ScrollView style={styles.imagesContainer} horizontal={true}>
              {display && (
                <Image
                  source={{uri: display}}
                  style={{width: 200, height: 200}}
                />
              )}
              {images.map(image => {
                return (
                  image && (
                    <Image
                      source={{uri: image}}
                      style={{width: 200, height: 200}}
                    />
                  )
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.postItem}>
            <TextInput
              placeholder="Product Name"
              placeholderTextColor={'gray'}
              onChangeText={value =>
                props.setPost({...props.post, product: value})
              }
              style={styles.input}
              value={props.post.product}
            />
          </View>
          <View style={styles.postItemPrice}>
            <Text style={styles.dollarSign}>$ </Text>
            <TextInput
              placeholder=" Enter Price"
              placeholderTextColor={'gray'}
              onChangeText={value => {
                if (Number(value)) {
                  props.setPost({...props.post, price: Number(value)});
                }
              }}
              style={styles.input}
              value={props.post.price}
            />
          </View>
          <View style={styles.postItemCategory}>
            <Text>Category: {props.post.category}</Text>
            <TouchableWithoutFeedback onPress={() => showCategory(!category)}>
              <Text
                style={{
                  backgroundColor: 'rgb(17, 87, 64)',
                  padding: 10,
                  textAlign: 'center',
                  fontSize: normalize(15),
                  color: 'white',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                {postCategory ? postCategory : 'Choose Category'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.postItemDraft}>
            <Text>{props.post.draft ? 'Save as Draft' : 'Save as Post'}</Text>
            <Switch
              trackColor={{false: '#767577', true: 'rgb(17, 87, 64)'}}
              value={!props.post.draft}
              onValueChange={() =>
                props.setPost({...props.post, draft: !props.post.draft})
              }
            />
          </View>
          <View style={styles.postItemStatus}>
            <Button
              title="SELLING"
              color={
                props.post.status === 'SELLING'
                  ? 'rgb(185, 151, 91)'
                  : 'rgb(17, 87, 64)'
              }
              onPress={() => {
                props.setPost({...props.post, status: 'SELLING'});
              }}
            />
            <Button
              title="PENDING"
              color={
                props.post.status === 'PENDING'
                  ? 'rgb(185, 151, 91)'
                  : 'rgb(17, 87, 64)'
              }
              onPress={() => {
                props.setPost({...props.post, status: 'PENDING'});
              }}
            />
          </View>
          <View style={styles.postItemDescription}>
            <TextInput
              placeholder="Write a description for your product here:"
              placeholderTextColor={'gray'}
              multiline={true}
              numberOfLines={4}
              style={styles.descriptionInput}
              textAlignVertical={'top'}
              onChangeText={value =>
                props.setPost({...props.post, description: value})
              }
              value={
                props.post.description !== 'null' ? props.post.description : ''
              }
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            postData();
          }}
          style={styles.submit}>
          <View>
            <Text style={{color: Colors.white, fontSize: 30}}>EDIT POST</Text>
          </View>
        </TouchableOpacity>
      </View>
      {category && (
        <View style={styles.category}>
          <Categories
            newPost={true}
            setPost={props.setPost}
            post={props.post}
            showCategory={showCategory}
          />
        </View>
      )}
      {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <View style={styles.errorMessageBanner}>
            <TouchableWithoutFeedback onPress={() => setErrorMessage('')}>
              <Text style={styles.exitErrorMessage}>Exit</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.errorMessageTextContainer}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </View>
      )}
    </>
  );
}

function NewPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const [display, setDisplay] = useState('');
  const [images, setImages] = useState([]);
  const [category, showCategory] = useState(false);
  const [postCategory, setPostCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const inProdMode = false;
  const emulator = false;
  const devURL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000';
  const prodURL = 'https://marketappwm-django-api.link';
  const ngrok = 'https://classic-pegasus-factual.ngrok-free.app';

  const MAX_NUMBER_OF_IMAGES = 5;

  /**
   * Function used to create a new post in the database
   */
  const postData = async () => {
    // Data to create the new post
    let post = new FormData();
    for (const [key, value] of Object.entries(props.post)) {
      post.append(key, value);
    }

    let post_id;
    await axios
      .post(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/posts/`,
        post,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(response => {
        post_id = response.data.post_id;
      })
      .catch((err: any) => console.log(err));

    // Data to add any additional images for a post
    let additional_images = new FormData();
    additional_images.append('post', post_id);
    for (let i = 1; i < images.length; i++) {
      additional_images.append('image' + i, images[i]);
    }

    await axios
      .post(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/images/`,
        additional_images,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(() => {
        props.returnHome();
        props.getProfile();
        props.setHasLoaded(false);
      })
      .catch((err: any) => {
        setErrorMessage(
          'There was a problem creating the post.  Please try again',
        );
        console.log(err);
      });
  };

  /**
   * Function to allow the user to select an image on their device
   * for their new post
   */
  const chooseImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!res.canceled) {
      let image = {
        uri: res.assets[0].uri,
        type: 'image/jpeg',
        // TODO: find return value for Android phones
        // type: Platform.OS === 'iOS' ? res.assets[0].type : '',
        name: 'image.png',
      };

      props.setPost({...props.post, display_image: image});
      setDisplay(res.assets[0].uri);

      let data = [];
      data.push(null);

      for (let i = 1; i < res.assets.length; i++) {
        image = {
          uri: res.assets[i].uri,
          type: 'image/jpeg',
          name: 'image.png',
        };
        data.push(image);
      }
      setImages(data);
    }
  };

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '90%',
          opacity: category ? 0.6 : 1.0,
        }}>
        <ScrollView>
          <View style={styles.postItem}>
            <TouchableWithoutFeedback onPress={chooseImage}>
              <Text
                style={{
                  backgroundColor: 'rgb(17, 87, 64)',
                  padding: 10,
                  textAlign: 'center',
                  fontSize: normalize(15),
                  color: 'white',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                Select your image(s)
              </Text>
            </TouchableWithoutFeedback>
            <ScrollView style={styles.imagesContainer} horizontal={true}>
              {display && (
                <Image
                  source={{uri: display}}
                  style={{width: 200, height: 200}}
                />
              )}
              {images.map(image => {
                return (
                  image && (
                    <Image
                      source={{uri: image.uri}}
                      style={{width: 200, height: 200}}
                    />
                  )
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.postItem}>
            <TextInput
              placeholder="Product Name"
              placeholderTextColor={'gray'}
              onChangeText={value =>
                props.setPost({...props.post, product: value})
              }
              style={styles.input}
            />
          </View>
          <View style={styles.postItemPrice}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              placeholder=" Enter Price"
              placeholderTextColor={'gray'}
              onChangeText={value => {
                if (Number(value)) {
                  props.setPost({...props.post, price: Number(value)});
                }
              }}
              style={styles.input}
            />
          </View>
          <View style={styles.postItemCategory}>
            <Text>Category: {props.post.category}</Text>
            <TouchableWithoutFeedback onPress={() => showCategory(true)}>
              <Text
                style={{
                  backgroundColor: 'rgb(17, 87, 64)',
                  padding: 10,
                  textAlign: 'center',
                  fontSize: normalize(15),
                  color: 'white',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                {postCategory ? postCategory : 'Choose Category'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.postItemDraft}>
            <Text>{props.post.draft ? 'Save as Draft' : 'Save as Post'}</Text>
            <Switch
              trackColor={{false: '#767577', true: 'rgb(17, 87, 64)'}}
              value={!props.post.draft}
              onValueChange={() =>
                props.setPost({...props.post, draft: !props.post.draft})
              }
            />
          </View>
          {/* <View style={styles.postItemStatus}>
            <Button
              title="SELLING"
              color={
                props.post.status === 'SELLING'
                  ? 'rgb(185, 151, 91)'
                  : 'rgb(17, 87, 64)'
              }
              onPress={() => {
                props.setPost({...props.post, status: 'SELLING'});
              }}
            />
            <Button
              title="PENDING"
              color={
                props.post.status === 'PENDING'
                  ? 'rgb(185, 151, 91)'
                  : 'rgb(17, 87, 64)'
              }
              onPress={() => {
                props.setPost({...props.post, status: 'PENDING'});
              }}
            />
          </View> */}
          <View style={styles.postItemDescription}>
            <TextInput
              placeholder="Write a description for your product here:"
              placeholderTextColor={'gray'}
              multiline={true}
              style={styles.descriptionInput}
              textAlignVertical={'top'}
              onChangeText={value =>
                props.setPost({...props.post, description: value})
              }
            />
          </View>
        </ScrollView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={async () => {
              if (!hasSubmitted) {
                setHasSubmitted(true);
                await postData();
              }
            }}
            style={styles.submit}>
            <View>
              <Text style={{color: Colors.white, fontSize: 30}}>PUBLISH</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {category && (
        <View style={styles.category}>
          <Categories
            newPost={true}
            setPost={props.setPost}
            post={props.post}
            showCategory={showCategory}
          />
        </View>
      )}
      {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <View style={styles.errorMessageBanner}>
            <TouchableWithoutFeedback onPress={() => setErrorMessage('')}>
              <Text style={styles.exitErrorMessage}>Exit</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.errorMessageTextContainer}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </View>
      )}
    </>
  );
}

function CreatePost(props): JSX.Element {
  const [view, setView] = useState({
    newPost: props.showPost.id == null,
    editPost: props.showPost.id != null,
  });

  const [post, setPost] = useState({
    product: null,
    username: props.username,
    display_image: null,
    description: null,
    price: null,
    draft: false,
    category: 'MISC.',
    status: 'SELLING',
  });

  const status = ['SELLING', 'PENDING', 'SOLD'];
  const [onCancel, setOnCancel] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={props.returnHome}
        onPressIn={() => setOnCancel(!onCancel)}
        onPressOut={() => setOnCancel(!onCancel)}>
        <View style={{backgroundColor: Colors.white, padding: 10}}>
          <Text style={{fontSize: 15, color: onCancel ? 'red' : 'black'}}>
            Cancel
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.postContainer}>
        {view.newPost && (
          <NewPost
            post={post}
            setPost={setPost}
            status={status}
            returnHome={props.returnHome}
            username={props.username}
            getProfile={props.getProfile}
            setHasLoaded={props.setHasLoaded}
          />
        )}
        {view.editPost && (
          <EditPost
            post={post}
            setPost={setPost}
            status={status}
            returnHome={props.returnHome}
            username={props.username}
            id={props.showPost.id}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  postItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    padding: normalize(15),
  },
  postItemCategory: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    columnGap: 10,
    width: '100%',
    padding: normalize(15),
  },
  postItemPrice: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    padding: normalize(15),
  },
  postItemStatus: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    padding: 10,
  },
  postItemDraft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    padding: normalize(15),
    columnGap: 10,
  },
  postItemDescription: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    height: normalize(200),
    marginBottom: normalize(20),
    padding: 5,
  },
  imagesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: '70%',
    fontSize: 17.5,
    // borderColor: 'gray',
    // borderWidth: 0.5,
  },
  dollarSign: {
    fontSize: 17.5,
  },
  descriptionInput: {
    width: '95%',
    // borderColor: 'gray',
    // borderWidth: 0.5,
  },
  submit: {
    width: '95%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgb(17, 87, 64)',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  submitInner: {
    width: '95%',
    display: 'flex',
    position: 'absolute',
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.blue,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  pickerItem: {
    backgroundColor: 'rgb(17, 87, 64)',
    width: 50,
    height: 50,
  },
  category: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
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
});

export default CreatePost;
