/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Footer from './Footer';
import {format, formatDistance} from 'date-fns';
import {Dimensions, Platform, PixelRatio} from 'react-native';
import uuid from 'react-native-uuid';
import {UserContext} from './App';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
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
    return SCREEN_HEIGHT * 0.7;
  }
  if (height < 716) {
    return SCREEN_HEIGHT * 0.765;
  } else if (height < 780) {
    return SCREEN_HEIGHT * 0.8;
  } else {
    return SCREEN_HEIGHT * 0.82;
  }
}

/**
 *
 * @param props
 * @returns button lead to DM's of two users stored in the props object
 */
function Room(props): JSX.Element {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.setRooms({...props.rooms, showRooms: false});
        props.getChats(
          props.id,
          props.buyer,
          props.rooms.buyer_profile_picture,
          props.seller,
          props.rooms.seller_profile_picture,
          props.display_image,
          props.product,
        );
      }}>
      <View style={styles.room}>
        <Image
          style={styles.roomImage}
          source={{
            uri: props.profile_picture,
          }}
        />
        <View>
          <Text style={{color: 'black', fontSize: normalize(17.5)}}>
            {props.other_user}
          </Text>
        </View>
        <Image
          style={styles.productImage}
          source={{uri: props.display_image}}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * @param postDateTime the datetime of the post
 * @returns the time stamp from the date string parameter
 */
const getDate = (postDateTime: string, separator: boolean = false) => {
  if (postDateTime.length) {
    let temp = postDateTime.split('T');
    let [date, time] = [temp[0].split('-'), temp[1].split(':')];
    let post = new Date(
      Number(date[0]),
      Number(date[1]) - 1,
      Number(date[2]),
      Number(time[0]),
      Number(time[1]),
      Number(time[2].split('.')[0]),
    );
    return format(post, separator ? 'MMMM d, y' : 'eee p');
  }
};

/**
 * @returns an individual message generated from data stored in the props object
 */
function Message(props: any): JSX.Element {
  let left = props.data.username !== props.current_user;

  return (
    <>
      {left && (
        <View style={styles.leftMessage}>
          <Image
            style={styles.profilePicture}
            source={{uri: props.profile_picture}}
          />
          <View style={styles.message}>
            <Text>{props.data.value}</Text>
            {props.data.image && (
              <Image
                style={styles.messagePicture}
                source={{uri: props.data.image}}
              />
            )}
            <Text style={styles.date}>{getDate(props.data.date)}</Text>
          </View>
        </View>
      )}
      {!left && (
        <View style={styles.rightMessage}>
          <View style={styles.userMessage}>
            <Text>{props.data.value}</Text>
            {props.data.image && (
              <Image
                style={styles.messagePicture}
                source={{uri: props.data.image}}
              />
            )}
            <Text style={styles.date}>{getDate(props.data.date)}</Text>
          </View>
          <Image
            style={styles.profilePicture}
            source={{uri: props.profile_picture}}
          />
        </View>
      )}
    </>
  );
}

/**
 * @returns Chat room screen that holds all possible conversations that the user is involved in
 */
function Chats(props): JSX.Element {
  const [rooms, setRooms] = useState({
    showRoom: false,
    rooms: [],
  });
  const [chats, setChats] = useState({
    showChats: false,
    chats: [],
    id: null,
    buyer: {
      username: null,
      profile_picture: null,
    },
    seller: {
      username: null,
      profile_picture: null,
    },
    image: '',
    product: '',
  });

  const [text, setText] = useState('');

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const emulator = false;
  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000';
  const ngrok = 'https://classic-pegasus-factual.ngrok-free.app';

  /**
   * Holds a reference to the scroll view used
   * to display the chat; necessary for automatically
   * scrolling to the bottom immediately after this component
   * is created.
   */
  const scrollViewRef = useRef(); //used for scrolling

  /**
    Variable that serves as a web socket object.
    Changes when a user selects a specific room
  */
  let ws: MutableRefObject<null> | MutableRefObject<WebSocket> =
    React.useRef(null);

  /*
    Creates a new web socket for the current chat room.
    Web sockets (made using Django Channels) are necessary for
    having real-time chat functionality
  */
  useEffect(() => {
    if (chats.id) {
      ws.current = new WebSocket(`ws://10.0.2.2/ws/chat/${chats.id}`);
      ws.current.onopen = () => {
        // connection opened
        // ws.current?.send('connection opened'); // send a message
        console.log('connection opened');
      };

      ws.current.onmessage = e => {
        // a message was received
        let new_chats = chats.chats;
        let data = JSON.parse(e.data);
        new_chats.push(data);
        setChats({...chats, chats: new_chats});
      };

      ws.current.onerror = e => {
        // an error occurred
        console.log(e);
      };

      ws.current.onclose = e => {
        // connection closed
        if (e.code !== 1006) {
          console.log(e.code, e.reason);
        }
      };
    }
  }, [chats.id]);

  /**
   * Returns user to the home page after
   * closing the web socket for chatting
   */
  const returnHome = () => {
    ws.current?.close();
    props.returnHome();
  };

  /**
   * Switches user to the profile page
   * after closing the web socket for chatting
   */
  const viewProfile = () => {
    ws.current?.close();
    props.viewProfile();
  };

  /**
   * Switches user to chat rooms after closing
   * the web socket for chatting; removes all
   * state information for a specific chat room
   */
  const viewChats = () => {
    separatorDate.current = '';
    ws.current?.close();
    setRooms({...rooms, showRoom: true});
    setChats({
      showChats: false,
      chats: [],
      id: null,
      buyer: {
        username: null,
        profile_picture: null,
      },
      seller: {
        username: null,
        profile_picture: null,
      },
      image: '',
      product: '',
    });
  };

  /**
   * Value to hold the current day of messages.  Used
   * to separate the messages by day
   */
  const separatorDate = useRef('');

  // After the page is rendered, retrieve all of the chatrooms the user is in
  // from the database
  useEffect(() => {
    setRooms({
      showRoom: true,
      rooms: props.rooms,
    });
  }, []);

  /**
   * @param id the id of the room that stores the messages between the buyer and seller
   * @param buyer the username of the buyer
   * @param bpf the profile picture of the buyer
   * @param seller the username of the seller
   * @param spf the profile picture of the seller
   * @param image the display image of a product
   * @param product the name of the product being discussed
   */
  var getChats = (
    id,
    buyer = null,
    bpf = null,
    seller = null,
    spf = null,
    image = null,
    product = null,
  ) => {
    var chat_request = `${
      emulator ? baseUrl : ngrok
    }/messages/get_messages/${id}`;
    axios
      .get(chat_request)
      .then(res => {
        if (buyer || seller) {
          setChats({
            ...chats,
            id: id,
            showChats: true,
            chats: res.data,
            buyer: {
              username: buyer,
              profile_picture: bpf,
            },
            seller: {
              username: seller,
              profile_picture: spf,
            },
            image: image,
            product: product,
          });
        } else {
          setChats({...chats, chats: res.data});
        }
        setRooms({...rooms, showRoom: false});
      })
      .catch((err: any) => console.log(err));
  };

  /**
   * Sends a message to the other user via the
   * implemented web socket (Django channel), and then
   * stores the message in the database.
   * @param value the text message
   * @param room_id the unique id of the chat room
   */
  const sendMessage = async (value: string, room_id: string) => {
    let data = {
      value: value,
      username: props.profile.username,
      room: room_id,
      image: null,
    };
    await axios
      .post(`${emulator ? baseUrl : ngrok}/messages/`, data)
      .then(() => {
        // If there isn't a webserver running,
        // show the new message on the sender side
        if (!ws.current?.readyState) {
          getChats(room_id);
        }
      })
      .catch((err: any) => console.log(err));
    if (ws.current?.readyState) {
      ws.current?.send(JSON.stringify(data));
    }
  };
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          flex: 1,
        }}>
        {rooms.showRoom && (
          <ScrollView style={{backgroundColor: Colors.white, width: '100%'}}>
            {rooms.rooms.buyers.map(value => {
              return (
                <Room
                  other_user={value.seller}
                  rooms={value}
                  chats={chats}
                  setRooms={setRooms}
                  getChats={getChats}
                  profile_picture={value.seller_profile_picture}
                  display_image={value.image}
                  product={value.product}
                  id={value.id}
                  seller={false}
                  buyer={true}
                  key={uuid.v4()}
                />
              );
            })}
            {rooms.showRoom &&
              !chats.showChats &&
              rooms.rooms.sellers.map(value => {
                return (
                  <Room
                    other_user={value.buyer}
                    rooms={value}
                    chats={chats}
                    setRooms={setRooms}
                    getChats={getChats}
                    profile_picture={value.buyer_profile_picture}
                    display_image={value.image}
                    product={value.product}
                    id={value.id}
                    seller={value.seller}
                    buyer={value.buyer}
                    key={uuid.v4()}
                  />
                );
              })}
          </ScrollView>
        )}
        {!rooms.showRoom && chats.showChats && (
          <View
            style={{
              backgroundColor: Colors.white,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flex: 1,
              // marginBottom: normalize(70),
            }}>
            <View style={styles.post}>
              <View style={styles.postImageContainer}>
                <Image
                  style={styles.postImage}
                  source={{
                    uri: chats.image,
                  }}
                />
              </View>

              <View style={styles.postText}>
                <Text style={{color: 'black', fontSize: 17.5}}>
                  {chats.product}
                </Text>
              </View>
              <View style={styles.editPost}>
                <Image
                  style={styles.editButtons}
                  source={require('./media/edit_post.png')}
                />
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              onContentSizeChange={async () =>
                await scrollViewRef.current.scrollToEnd({animated: false})
              }
              style={{overflow: 'hidden'}}>
              {chats.chats.map(value => {
                let img =
                  value.username == props.profile.username
                    ? `${emulator ? baseUrl : ngrok}${
                        props.profile.profile_picture
                      }`
                    : value.username == chats.buyer.username
                    ? chats.buyer.profile_picture
                    : chats.seller.profile_picture;
                let buyer = value.username == chats.buyer.username;

                // Logic for separating the messages by day
                let messageDate = getDate(value.date, true);
                let newSeparator =
                  messageDate !== separatorDate.current ? true : false;

                if (newSeparator) {
                  separatorDate.current = messageDate;
                }

                return (
                  <>
                    {newSeparator && (
                      <View style={styles.dateSeparator}>
                        <Text>{messageDate}</Text>
                      </View>
                    )}
                    <Message
                      data={value}
                      profile_picture={img}
                      buyer={buyer}
                      seller={!buyer}
                      current_user={props.profile.username}
                      key={uuid.v4()}
                    />
                  </>
                );
              })}
            </ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={value => setText(value)}
                value={text}
              />
              <Button
                title={'send'}
                color={'rgb(185, 151, 91)'}
                onPress={async () => {
                  await sendMessage(text, chats.id);
                  setText('');
                }}
              />
            </View>
          </View>
        )}
      </View>
      <Footer
        returnHome={returnHome}
        viewProfile={viewProfile}
        viewChats={viewChats}
        type={'Chats'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  message: {
    padding: 20,
    backgroundColor: '#f6f7f5',
    borderRadius: 20,
    overflow: 'hidden',
    width: 200,
  },
  userMessage: {
    padding: 20,
    backgroundColor: 'rgb(185, 151, 91)',
    borderRadius: 20,
    overflow: 'hidden',
    width: 200,
  },
  leftMessage: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    columnGap: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightMessage: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    columnGap: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roomImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(35),
    overflow: 'hidden',
    backgroundColor: Colors.black,
  },
  productImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(35),
    overflow: 'hidden',
    backgroundColor: Colors.black,
    position: 'absolute',
    right: 30,
  },
  profilePicture: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    overflow: 'hidden',
    backgroundColor: Colors.black,
  },
  messagePicture: {
    width: 50,
    height: 50,
  },
  room: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    borderColor: 'gray',
    borderWidth: 0.5,
    rowGap: 20,
    columnGap: 30,
  },
  date: {
    marginTop: 10,
    fontSize: 10,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: normalize(50),
    columnGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#f6f7f5',
    width: '65%',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: Colors.black,
    height: '80%',
  },
  send: {
    backgroundColor: 'rgb(185, 151, 91)',
    borderRadius: 10,
    overflow: 'hidden',
    height: '80%',
  },
  post: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 0.8,
    borderColor: 'grey',
    zIndex: 1,
  },
  postImageContainer: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(15),
    overflow: 'hidden',
    display: 'flex',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(15),
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: 'black',
  },
  postText: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
  },
  editPost: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  editButtons: {
    width: 10,
    height: 30,
  },
  dateSeparator: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
});

export default Chats;
