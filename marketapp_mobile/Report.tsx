/* eslint-disable react-native/no-inline-styles */
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

function UserOptions(props): JSX.Element {
  const [selected, setSelected] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelected(!selected);
        props.setSelected(props.reason);
      }}>
      <Text
        style={{
          color: 'black',
          backgroundColor: selected
            ? 'rgba(208,211,212, 1)'
            : 'rgba(208,211,212, .5)',
          textAlign: 'center',
          padding: 10,
          borderRadius: 15,
          width: 250,
        }}>
        {props.reason}
      </Text>
    </TouchableWithoutFeedback>
  );
}

function Report(props): JSX.Element {
  const [confirmed, canSubmit] = useState(false);
  const [selected, setSelected] = useState('');

  const user_options = [
    'Inappropriate nickname',
    'Scam',
    'Harassment',
    'Use of Inappropriate language',
    'Spamming',
    "Didn't show up",
    'Other',
  ];

  const post_options = [
    'Inaccurate post names/description',
    'Inappropriate post names/description',
    'Scams',
    'Damaged product',
    'Already sold',
    "Didn't show up",
    'Other',
  ];
  return (
    <>
      {props.user && (
        <>
          {/* Report screen navigation bar */}
          <View style={styles.navigationBar}>
            <Text style={{fontSize: 25, color: 'white'}}>Report a User</Text>
          </View>
          <View style={styles.goldBar} />

          {/* Report screen body */}
          <View style={styles.reportContainer}>
            <Text style={{fontSize: 17.5, color: 'black'}}>
              Would you like to report this user?
            </Text>

            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: 'http://10.0.2.2:8000' + props.profile.profile_picture,
                }}
                style={styles.image}
              />
              <Text style={{fontSize: 17.5, color: 'black'}}>
                {props.profile.username}
              </Text>
            </View>

            <TouchableWithoutFeedback onPress={() => canSubmit(!confirmed)}>
              <Text
                style={{
                  width: '50%',
                  padding: 5,
                  backgroundColor: confirmed
                    ? 'rgb(17, 87, 64)'
                    : 'rgba(208,211,212, 1)',
                  color: confirmed ? 'white' : 'black',
                  borderRadius: 15,
                  fontSize: 17.5,
                  textAlign: 'center',
                }}>
                Press to Confirm
              </Text>
            </TouchableWithoutFeedback>

            {/* Select reason for report */}
            <View style={styles.select}>
              <Text style={{fontSize: 20, color: 'black', textAlign: 'center'}}>
                Select your reasons for reporting
              </Text>
            </View>

            <View style={styles.reasonContainer}>
              {user_options.map(value => {
                return <UserOptions reason={value} setSelected={setSelected} />;
              })}
            </View>

            {/* Submit button */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '80%',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 10,
              }}>
              <TouchableWithoutFeedback onPress={() => props.returnHome()}>
                <Text
                  style={{
                    width: '40%',
                    padding: 10,
                    backgroundColor: 'rgb(17, 87, 64)',
                    color: 'white',
                    borderRadius: 15,
                    fontSize: 17.5,
                    textAlign: 'center',
                  }}>
                  Return
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Text
                  style={{
                    width: '50%',
                    padding: 10,
                    backgroundColor: confirmed
                      ? 'rgb(17, 87, 64)'
                      : 'rgba(208,211,212, 1)',
                    color: confirmed ? 'white' : 'black',
                    borderRadius: 15,
                    fontSize: 17.5,
                    textAlign: 'center',
                  }}>
                  {'Report ' + props.profile.username}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </>
      )}
      {props.isPost && (
        <>
          {/* Report screen navigation bar */}
          <View style={styles.navigationBar}>
            <Text style={{fontSize: 25, color: 'white'}}>Report a Post</Text>
          </View>
          <View style={styles.goldBar} />

          {/* Report screen body */}
          <View style={styles.reportContainerPost}>
            <Text style={{fontSize: 20, color: 'black'}}>
              Would you like to report this post?
            </Text>

            <View style={styles.profileContainer}>
              <Image
                source={{uri: props.post.display_image}}
                style={styles.post}
              />
              <View>
                <Text style={{fontSize: 17.5, color: 'black'}}>
                  {props.post.product}
                </Text>
                <Text>{props.post.username}</Text>
                <Text>${props.post.price}</Text>
              </View>
            </View>

            <TouchableWithoutFeedback onPress={() => canSubmit(!confirmed)}>
              <Text
                style={{
                  width: '50%',
                  padding: 5,
                  backgroundColor: confirmed
                    ? 'rgb(17, 87, 64)'
                    : 'rgba(208,211,212, 1)',
                  color: confirmed ? 'white' : 'black',
                  borderRadius: 15,
                  fontSize: 17.5,
                  textAlign: 'center',
                }}>
                Press to Confirm
              </Text>
            </TouchableWithoutFeedback>

            {/* Select reason for report */}
            <View style={styles.select}>
              <Text style={{fontSize: 20, color: 'black', textAlign: 'center'}}>
                Select your reasons for reporting
              </Text>
            </View>

            <View style={styles.reasonContainer}>
              {post_options.map(value => {
                return <UserOptions reason={value} setSelected={setSelected} />;
              })}
            </View>

            {/* Submit button */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '80%',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 10,
              }}>
              <TouchableWithoutFeedback onPress={() => props.returnHome()}>
                <Text
                  style={{
                    width: '40%',
                    backgroundColor: 'rgb(17, 87, 64)',
                    color: 'white',
                    borderRadius: 15,
                    fontSize: 17.5,
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  Return
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Text
                  style={{
                    width: '40%',
                    padding: 10,
                    backgroundColor: confirmed
                      ? 'rgb(17, 87, 64)'
                      : 'rgba(208,211,212, 1)',
                    color: confirmed ? 'white' : 'black',
                    borderRadius: 15,
                    fontSize: 17.5,
                    textAlign: 'center',
                  }}>
                  Report this post
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  reportContainer: {
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 15,
    width: '100%',
    height: '89%',
  },
  reportContainerPost: {
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
    width: '100%',
    height: '89%',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
    backgroundColor: 'rgba(208,211,212, 0.5)',
    borderRadius: 15,
    padding: 15,
    width: '70%',
  },
  confirm: {
    backgroundColor: 'rgb(17, 87, 64)',
    color: 'white',
    width: '50%',
    borderRadius: 15,
    textAlign: 'center',
    padding: 10,
  },
  reasonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
  select: {
    width: '90%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  navigationBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    height: '10%',
  },
  goldBar: {
    backgroundColor: 'rgb(185, 151, 91)',
    height: '1%',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 35,
  },
  post: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
});
export default Report;
