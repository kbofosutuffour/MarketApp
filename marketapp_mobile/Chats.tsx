import axios from 'axios';
import React, {useEffect, useState} from 'react';

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
          <Text>{props.other_user}</Text>
        </View>
        <Image style={styles.roomImage} source={{uri: props.product}} />
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * @returns an individual message generated from data stored in the props object
 */
function Message(props): JSX.Element {
  if (props.seller) {
    return (
      <View style={styles.sellerMessage}>
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
          <Text style={styles.date}>{props.data.date}</Text>
        </View>
      </View>
    );
  } else if (props.buyer) {
    return (
      <View style={styles.buyerMessage}>
        <View style={styles.message}>
          <Text>{props.data.value}</Text>
          {props.data.image && (
            <Image
              style={styles.messagePicture}
              source={{uri: props.data.image}}
            />
          )}
          <Text style={styles.date}>{props.data.date}</Text>
        </View>
        <Image
          style={styles.profilePicture}
          source={{uri: props.profile_picture}}
        />
      </View>
    );
  } else {
    return <></>;
  }
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
  });

  // After the page is rendered, retrieve all of the chatrooms the user is in
  // from the database
  useEffect(() => {
    var room_request =
      'http://10.0.2.2:8000/rooms/get_rooms/' + props.profile.username;
    axios
      .get(room_request)
      .then(res => {
        setRooms({
          showRoom: true,
          rooms: res.data,
        });
      })
      .catch((err: any) => console.log(err));
  }, []);

  /**
   * 
   * @param id the id of the room that stores the messages between the buyer and seller
   * @param buyer the username of the buyer
   * @param bpf the profile picture of the buyer
   * @param seller the username of the seller
   * @param spf the profile picture of the seller
   */
  var getChats = (id, buyer, bpf, seller, spf) => {
    var chat_request = 'http://10.0.2.2:8000/messages/get_messages/' + id;
    axios
      .get(chat_request)
      .then(res => {
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
        });
        setRooms({...rooms, showRoom: false});
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: 'rgb(17, 87, 64)',
        height: '80%',
      }}>
      {rooms.showRoom &&
        rooms.rooms.buyers.map(value => {
          return (
            <Room
              other_user={value.seller}
              rooms={rooms}
              chats={chats}
              setRooms={setRooms}
              getChats={getChats}
              profile_picture={value.seller_profile_picture}
              product={value.image}
              id={value.id}
              seller={false}
              buyer={true}
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
              product={value.image}
              id={value.id}
              seller={value.seller}
              buyer={value.buyer}
            />
          );
        })}
      {!rooms.showRoom && chats.showChats && (
        <>
          <ScrollView>
            {chats.chats.map(value => {
              var img =
                value.username == chats.buyer.username
                  ? chats.buyer.profile_picture
                  : chats.seller.profile_picture;
              var buyer = value.username == chats.buyer.username;
              return (
                <Message
                  data={value}
                  profile_picture={img}
                  buyer={buyer}
                  seller={!buyer}
                />
              );
            })}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} />
            <Button title={'send'} color={'rgb(185, 151, 91)'}/>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 200,
  },
  sellerMessage: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    columnGap: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buyerMessage: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    columnGap: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roomImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.black,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messagePicture: {
    width: 50,
    height: 50,
  },
  room: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    borderColor: 'gray',
    borderWidth: 0.5,
    rowGap: 20,
    columnGap: 20,
  },
  date: {
    marginTop: 10,
    fontSize: 10,
  },
  inputContainer: {
    backgroundColor: 'rgb(17, 87, 64)',
    display: 'flex',
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    height: 30,
    width: '65%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    marginTop: 10,
  },
  send: {
    backgroundColor: 'rgb(185, 151, 91)',
    borderRadius: 10,
  },
});

export default Chats;
