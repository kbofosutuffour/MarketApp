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
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';
import {UserContext} from './App';

function EditPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const [display, setDisplay] = useState('');
  const [images, setImages] = useState([]);
  const [newData, setNewData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios
      .get(`${baseUrl}:8000/posts/${props.id}`)
      .then(response => {
        props.setPost(response.data);
        setDisplay(response.data.display_image);
      })
      .catch((err: any) => console.log(err));

    await axios
      .get(`${baseUrl}:8000/images/${props.id}`)
      .then(response => {
        let response_images = Object.values(response.data);
        let newList = [];
        for (let i = 0; i < response_images.length; i++) {
          if (typeof response_images[i] !== 'number') {
            newList.push(response_images[i]);
          }
        }
        setImages(newList);
        console.log(newList);
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
          type: 'image/' + display.split('.')[displayLength - 1],
          name: 'image.png',
        });
      } else {
        data.append(key, value);
      }
    }

    await axios
      .patch(`${baseUrl}:8000/edit_post/${props.id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch((err: any) => console.log(err, data));
  };

  const chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    let image = {
      uri: res[0].uri,
      type: res[0].type,
      name: 'image.png',
    };
    props.setPost({
      ...props.post,
      display_image: {
        uri: res[0].uri,
        type: res[0].type,
        name: 'image.png',
      },
    });
    setNewData(image);
    setDisplay(res[0].uri);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '90%',
      }}>
      <ScrollView>
        <View style={styles.postItem}>
          <Button
            title="Select your display image"
            onPress={chooseImage}
            color={'rgb(17, 87, 64)'}
          />
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
            placeholder="Product"
            onChangeText={value =>
              props.setPost({...props.post, product: value})
            }
            style={styles.input}
            value={props.post.product}
          />
        </View>
        <View style={styles.postItemPrice}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            placeholder="Enter Price"
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
          <Picker
            selectedValue={props.post.category}
            onValueChange={itemValue => {
              if (props.categories.includes(itemValue)) {
                props.setPost({...props.post, category: itemValue});
              }
            }}
            style={styles.pickerItem}>
            {props.categories.map((value: string) => {
              return <Picker.Item label={value} value={value} />;
            })}
            <Picker.Item label={'test'} value={'test'} />
          </Picker>
        </View>
        <View style={styles.postItemDraft}>
          <Text>{props.post.draft ? 'Save as Draft' : 'Save as Post'}</Text>
          <Switch
            trackColor={{false: '#767577', true: 'rgb(17, 87, 64)'}}
            value={props.post.draft}
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
            multiline={true}
            numberOfLines={4}
            style={styles.descriptionInput}
            textAlignVertical={'top'}
            onChangeText={value =>
              props.setPost({...props.post, description: value})
            }
            value={props.post.description}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          postData();
          props.returnHome();
        }}
        style={styles.submit}>
        <View>
          <Text style={{color: Colors.white, fontSize: 30}}>EDIT POST</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function NewPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const [display, setDisplay] = useState('');
  const [images, setImages] = useState([]);

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const baseUrl =
    Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost';

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
      .post(`${baseUrl}:8000/posts/`, post, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
      .post(`${baseUrl}:8000/images/`, additional_images, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .catch((err: any) => console.log(err));

    props.returnHome();
    props.getProfile();
    props.setHasLoaded(false);
  };

  /**
   * Function to allow the user to select an image on their device
   * for their new post
   */
  const chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
      allowMultiSelection: true,
    });

    let image = {
      uri: res[0].uri,
      type: res[0].type,
      name: 'image.png',
    };

    props.setPost({...props.post, display_image: image});
    setDisplay(res[0].uri);

    let data = [];
    data.push(null);

    for (let i = 1; i < res.length; i++) {
      image = {
        uri: res[i].uri,
        type: res[i].type,
        name: 'image.png',
      };
      data.push(image);
    }
    setImages(data);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '90%',
      }}>
      <ScrollView>
        <View style={styles.postItem}>
          <Button
            title="Select your image(s)"
            onPress={chooseImage}
            color={'rgb(17, 87, 64)'}
          />
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
            placeholder="Product"
            onChangeText={value =>
              props.setPost({...props.post, product: value})
            }
            style={styles.input}
          />
        </View>
        <View style={styles.postItemPrice}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            placeholder="Enter Price"
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
          <Picker
            selectedValue={props.post.category}
            onValueChange={itemValue => {
              if (props.categories.includes(itemValue)) {
                props.setPost({...props.post, category: itemValue});
              }
            }}
            style={styles.pickerItem}>
            {props.categories.map((value: string) => {
              return <Picker.Item label={value} value={value} />;
            })}
            <Picker.Item label={'test'} value={'test'} />
          </Picker>
        </View>
        <View style={styles.postItemDraft}>
          <Text>{props.post.draft ? 'Save as Draft' : 'Save as Post'}</Text>
          <Switch
            trackColor={{false: '#767577', true: 'rgb(17, 87, 64)'}}
            value={props.post.draft}
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
            multiline={true}
            numberOfLines={4}
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
            await postData();
          }}
          style={styles.submit}>
          <View>
            <Text style={{color: Colors.white, fontSize: 30}}>PUBLISH</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
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
    status: null,
  });

  const categories = [
    'CLOTHING',
    'FURNITURE',
    'FREE STUFF',
    'VEHICLES',
    'TECHNOLOGY',
    'HOBBIES',
    'OFFICE SUPPLIES',
    'DORM GOODS',
    'FOOD',
    'ENTERTAINMENT',
    'BOOKS',
    'MISC.',
  ];

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
            categories={categories}
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
            categories={categories}
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
    padding: 5,
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
    padding: 5,
  },
  postItemPrice: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    width: '100%',
    padding: 5,
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
    padding: 5,
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
    height: '40%',
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
});

export default CreatePost;
