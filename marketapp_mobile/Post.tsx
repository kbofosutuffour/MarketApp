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
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as ImagePicker from 'expo-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';

function EditPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const [display, setDisplay] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios
      .get('http://10.0.2.2:8000/posts/' + props.id)
      .then(response => {
        props.setPost(response.data);
        setDisplay(response.data.display_image);
      })
      .catch((err: any) => console.log(err));
  };

  const postData = async () => {
    let data = new FormData();
    for (const [key, value] of Object.entries(props.post)) {
      data.append(key, value);
    }
    await axios
      .patch('http://10.0.2.2:8000/posts/' + props.id + '/', data)
      .then(response => {
        console.log(response);
      })
      .catch((err: any) => console.log(err));
  };

  const chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    let image = {
      uri: res[0].uri,
      type: res[0].type,
      name: 'image',
    };
    props.setPost({...props.post, display_image: image});
    setDisplay(res[0].uri);
  };

  return (
    <>
      <View style={styles.postItem}>
        <Button
          title="Select your display image"
          onPress={chooseImage}
          color={'rgb(17, 87, 64)'}
        />
        {display && (
          <Image source={{uri: display}} style={{width: 200, height: 200}} />
        )}
      </View>
      <View style={styles.postItem}>
        <TextInput
          placeholder="Product"
          onChangeText={value => props.setPost({...props.post, product: value})}
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
    </>
  );
}

function NewPost(props): JSX.Element {
  //Image upload documentation: https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/imagepicker.mdx

  const [display, setDisplay] = useState('');

  const postData = async () => {
    let data = new FormData();
    for (const [key, value] of Object.entries(props.post)) {
      data.append(key, value);
    }
    // data.append('username', props.post.username);
    // data.append('product', props.post.product);
    // data.append('price', props.post.price);
    await axios
      .post('http://10.0.2.2:8000/posts/', data)
      .then(response => {
        console.log(response);
      })
      .catch((err: any) => console.log(err));
  };

  const chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    let image = {
      uri: res[0].uri,
      type: res[0].type,
      name: 'image.png',
    };
    props.setPost({...props.post, display_image: image});
    setDisplay(res[0].uri);
  };

  return (
    <>
      <View style={styles.postItem}>
        <Button
          title="Select your display image"
          onPress={chooseImage}
          color={'rgb(17, 87, 64)'}
        />
        {display && (
          <Image source={{uri: display}} style={{width: 200, height: 200}} />
        )}
      </View>
      <View style={styles.postItem}>
        <TextInput
          placeholder="Product"
          onChangeText={value => props.setPost({...props.post, product: value})}
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

      <TouchableOpacity
        onPress={() => {
          postData();
          props.returnHome();
        }}
        style={styles.submit}>
        <View>
          <Text style={{color: Colors.white, fontSize: 30}}>PUBLISH</Text>
        </View>
      </TouchableOpacity>
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
    height: '20%',
    padding: 5,
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
