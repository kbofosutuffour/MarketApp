/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';

import {
  Image,
  Platform,
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
import {UserContext} from './App';

function UserOptions(props): JSX.Element {
  const [selected, setSelected] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelected(!selected);

        // must use !selected because Report component has not re-rendered, so
        // the state variable has not changed yet
        if (!selected) {
          props.setSelected(props.selected.add(props.reason));
        } else {
          props.selected.delete(props.reason);
        }
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
          overflow: 'hidden',
          width: 250,
        }}>
        {props.reason}
      </Text>
    </TouchableWithoutFeedback>
  );
}

function Report(props): JSX.Element {
  const [confirmed, canSubmit] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * The base url used to access images and other data within the app directory.
   * Different between Android and iOS
   */
  // const {baseUrl} = useContext(UserContext);
  const inProdMode = true;
  const emulator = false;
  const devURL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000';
  const prodURL = 'https://marketappwm-django-api.link';
  const ngrok = 'https://classic-pegasus-factual.ngrok-free.app';

  const user_options = {
    'Inappropriate nickname': 'NICKNAME',
    Scam: 'SCAMMING',
    Harassment: 'HARASSMENT',
    'Use of Inappropriate language': 'HARASSMENT',
    Spamming: 'SCAMMING',
    "Didn't show up": 'NO SHOW',
  };

  const post_options = {
    'Inaccurate post names/description': 'POST NAME',
    'Inappropriate post names/description': 'POST NAME',
    Scams: 'SCAMMING',
    'Damaged product': 'DAMMAGED PRODUCTS',
    'Already sold': 'ALREADY SOLD',
    "Didn't show up": 'NO SHOW',
  };

  /** Function used to save a report to the database
   * @param user whether the report involves a user
   * @param post whether the report involves a post
   * @param violation the type of violation
   */
  const submitReport = async (
    user = false,
    post = false,
    violation: string,
  ) => {
    let profile_id = null;
    let current_user_id = null;

    // Getting the id of the user being reported
    if (user) {
      await axios
        .get(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/profiles/get_id/${props.profile.username}/`,
        )
        .then(response => {
          profile_id = response.data.id;
        })
        .catch((err: any) => console.log(err));
    }

    //TODO: create logic for reporting posts

    // Getting the id of the user making the report (current user)
    await axios
      .get(
        `${inProdMode ? prodURL : emulator ? devURL : ngrok}/profiles/get_id/${
          props.current_user
        }/`,
      )
      .then(response => {
        current_user_id = response.data.id;
      })
      .catch((err: any) => console.log(err));

    let data = {
      violation: user ? user_options[violation] : post_options[violation],
      profile: profile_id,
      post: props.post.id,
      reported_by: current_user_id,
    };
    await axios
      .post(`${inProdMode ? prodURL : emulator ? devURL : ngrok}/report/`, data)
      .catch((err: any) => console.log(err));
  };

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
          <View
            style={{
              display: 'flex',
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 15,
              width: '100%',
              height: '89%',
              opacity: !errorMessage ? 1.0 : 0.6,
            }}>
            <Text style={{fontSize: 17.5, color: 'black'}}>
              Would you like to report this user?
            </Text>

            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: `${inProdMode ? prodURL : emulator ? devURL : ngrok}${
                    props.profile.profile_picture
                  }`,
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
                  overflow: 'hidden',
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
              {Object.keys(user_options).map(value => {
                return (
                  <UserOptions
                    reason={value}
                    setSelected={setSelected}
                    selected={selected}
                  />
                );
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
                    overflow: 'hidden',
                    fontSize: 17.5,
                    textAlign: 'center',
                  }}>
                  Return
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!confirmed) {
                    setErrorMessage(
                      'Please confirm before continuing the report',
                    );
                  } else if (selected.size < 1) {
                    setErrorMessage(
                      'Please select your reason(s) for reporting',
                    );
                  } else {
                    selected.forEach(async value => {
                      await submitReport(false, true, value);
                    });
                    props.returnHome();
                  }
                }}>
                <Text
                  style={{
                    width: '50%',
                    padding: 10,
                    backgroundColor: confirmed
                      ? 'rgb(17, 87, 64)'
                      : 'rgba(208,211,212, 1)',
                    color: confirmed ? 'white' : 'black',
                    borderRadius: 15,
                    overflow: 'hidden',
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
          <View
            style={{
              display: 'flex',
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 10,
              width: '100%',
              height: '89%',
              opacity: errorMessage ? 0.6 : 1.0,
            }}>
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
                  overflow: 'hidden',
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
              {Object.keys(post_options).map(value => {
                return (
                  <UserOptions
                    reason={value}
                    setSelected={setSelected}
                    selected={selected}
                  />
                );
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
                    overflow: 'hidden',
                    fontSize: 17.5,
                    textAlign: 'center',
                    padding: 10,
                  }}>
                  Return
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!confirmed) {
                    setErrorMessage(
                      'Please confirm before continuing the report',
                    );
                  } else if (selected.size < 1) {
                    setErrorMessage(
                      'Please select your reason(s) for reporting',
                    );
                  } else {
                    selected.forEach(async value => {
                      await submitReport(false, true, value);
                    });
                    props.returnHome();
                  }
                }}>
                <Text
                  style={{
                    width: '40%',
                    padding: 10,
                    backgroundColor: confirmed
                      ? 'rgb(17, 87, 64)'
                      : 'rgba(208,211,212, 1)',
                    color: confirmed ? 'white' : 'black',
                    borderRadius: 15,
                    overflow: 'hidden',
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

const styles = StyleSheet.create({
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
    backgroundColor: 'rgba(208,211,212, 0.5)',
    borderRadius: 15,
    overflow: 'hidden',
    padding: 15,
    width: '70%',
  },
  confirm: {
    backgroundColor: 'rgb(17, 87, 64)',
    color: 'white',
    width: '50%',
    borderRadius: 15,
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  post: {
    width: 80,
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
  },
  errorMessageContainer: {
    //TODO: Fix hard-coded numbers
    position: 'absolute',
    transform: [{translateX: 50}, {translateY: 300}],
    width: 300,
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#D7D7D7',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 15,
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
export default Report;
