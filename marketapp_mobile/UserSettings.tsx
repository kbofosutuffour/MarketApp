/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {format} from 'date-fns';

import {Dimensions, Platform, PixelRatio} from 'react-native';
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
    return SCREEN_HEIGHT * 0.725;
  } else if (height < 716) {
    return SCREEN_HEIGHT * 0.765;
  } else if (height < 780) {
    return SCREEN_HEIGHT * 0.8;
  }
}

function Profile(props): JSX.Element {
  const options = [
    'Change Password',
    'Edit Profile',
    'History',
    'Blocked Users',
  ];

  const [dateCreated, setDateCreated] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [userSettings, setUserSettings] = useState({});

  useEffect(() => {
    setUserSettings(props.userSettings);
    setDateCreated(props.date);
  }, [props.userSettings]);

  return (
    <View style={styles.userSettings}>
      <View style={styles.blackArrow}>
        <TouchableWithoutFeedback
          onPress={() => props.setView({settings: true})}>
          <Image
            style={styles.blackArrow}
            source={require('./media/black_left_arrow.png')}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.profileDescription}>
        <Image
          source={{
            uri: 'http://10.0.2.2:8000' + props.profile.profile_picture,
          }}
          style={styles.profilePictureBorder}
        />
        <View>
          <Text style={{fontSize: 25, color: 'black'}}>
            {props.profile.username}
          </Text>
          <Text style={{fontSize: 15, color: 'gray'}}>
            {props.profile.email ? props.profile.email : '[No email]'}
          </Text>
          <Text style={{fontSize: 15, color: 'gray', width: 150}}>
            {/* {dateCreated && userSettings.data.show_joined_date
              ? 'Joined ' +
                format(new Date(dateCreated[0], dateCreated[1]), 'MMMM yyyy')
              : ''} */}
          </Text>
        </View>
      </View>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              if (value === 'Change Password') {
                props.setView({changePassword: true});
              } else if (value === 'Edit Profile') {
                props.viewProfile();
              }
            }}>
            <View
              style={
                value === 'Change Password'
                  ? styles.settingsOptionContainerTop
                  : value === 'Blocked Users'
                  ? styles.settingsOptionContainerBottom
                  : styles.settingsOptionContainer
              }>
              <Text style={styles.settingsOption}>{value}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

function ChangePassword(props: any): JSX.Element {
  const [passwordState, setPasswordState] = useState({
    sendCode: false,
    createPassword: false,
  });

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState({
    username: '',
    password: '',
    confirm: '',
    email: email,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const [code, setCode] = useState({
    code: '',
    codeSent: false,
  });
  const [inputCode, setInputCode] = useState('');
  // Add username as soon as the component renders
  useEffect(() => {
    setNewPassword({...newPassword, username: props.profile.username});
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const verify = async (inputEmail: string = '', inputCode: string = '') => {
    // Making sure the inputEmail is from a W&M email domain
    let domain = inputEmail ? inputEmail.split('@')[1] : '';

    if (inputEmail && domain === 'wm.edu') {
      setNewPassword({...newPassword, email: inputEmail});
      await axios
        .post('http://10.0.2.2:8000/users/verify/', {email: email})
        .then(response => {
          setCode({
            code: response.data.code,
            codeSent: true,
          });
        })
        .catch((err: any) => {
          console.log(err);
          setErrorMessage(
            'Error with the validation process.  Please try again.',
          );
        });
    } else if (inputCode === code.code && code.code.length) {
      setPasswordState({
        sendCode: false,
        createPassword: true,
      });
    } else if (!inputEmail || domain !== 'wm.edu') {
      setErrorMessage('Please enter a valid W&M address');
    }
  };

  const changePassword = async () => {
    if (
      newPassword.password === newPassword.confirm &&
      newPassword.password.length >= 8 &&
      newPassword.username.length
    ) {
      await axios
        .post('http://10.0.2.2:8000/users/change_password/', newPassword)
        .then(response => {
          setPasswordState({
            sendCode: false,
            createPassword: true,
          });
        })
        .catch((err: any) => console.log(err));
    } else if (
      newPassword.password !== newPassword.confirm &&
      newPassword.password.length
    ) {
      setErrorMessage('Passwords do not match.  Please try again.');
    } else if (newPassword.password.length < 8) {
      setErrorMessage('Insufficient password length.  Please try again');
    } else if (!newPassword.username.length) {
      setErrorMessage('Please enter your username');
    } else {
      setErrorMessage('An unknown error has occurred');
    }
  };

  return (
    <>
      {!passwordState.createPassword && !passwordState.sendCode && (
        <>
          <View style={styles.userSettings}>
            <View style={styles.blackArrow}>
              <TouchableWithoutFeedback
                onPress={() => props.setView({profile: true})}>
                <Image
                  style={styles.blackArrow}
                  source={require('./media/black_left_arrow.png')}
                />
              </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback
              onPress={() =>
                setPasswordState({
                  sendCode: true,
                  createPassword: false,
                })
              }>
              <View style={styles.supportOptionContainerTop}>
                <Text style={styles.settingsOption}>
                  Change from existing password
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => props.login('Forgot Password')}>
              <View style={styles.settingsOptionContainerBottom}>
                <Text style={styles.settingsOption}>Forgot Password</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </>
      )}
      {passwordState.sendCode && (
        <>
          <View style={styles.loginContainer}>
            <View style={styles.blackArrow}>
              <TouchableWithoutFeedback
                onPress={() => props.setView({profile: true})}>
                <Image
                  style={styles.blackArrow}
                  source={require('./media/black_left_arrow.png')}
                />
              </TouchableWithoutFeedback>
            </View>
            <Image
              style={styles.wmLogo}
              source={require('./media/wm_logo_green.png')}
            />
            <View style={styles.loginText}>
              <Text style={styles.header}>Verify your W&M email account</Text>
              <View style={styles.emailInput}>
                <TextInput
                  placeholder="Enter your school email"
                  onChangeText={text => setEmail(text)}
                  value={email}
                  style={styles.inputSmall}
                />
                <TouchableWithoutFeedback
                  onPress={() => verify((inputEmail = email))}>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      width: 90,
                      height: 35,
                      borderRadius: 15,
                      backgroundColor: code.codeSent
                        ? 'rgb(138,178,147)'
                        : 'rgb(176,211,229)',
                      color: 'black',
                      textAlign: 'center',
                      lineHeight: 35,
                    }}>
                    {code.codeSent ? 'Code Sent' : 'Send Code'}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.emailInput}>
                <TextInput
                  placeholder="Enter your verification code"
                  onChangeText={text => setInputCode(text)}
                  value={inputCode}
                  style={styles.inputSmall}
                />
                <TouchableWithoutFeedback>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      backgroundColor:
                        inputCode === code.code && inputCode.length
                          ? 'rgb(138,178,147)'
                          : 'rgb(176,211,229)',
                      width: 90,
                      height: 30,
                      borderRadius: 10,
                      color: 'black',
                      textAlign: 'center',
                      lineHeight: 30,
                    }}>
                    {inputCode === code.code && inputCode.length
                      ? 'Verified'
                      : 'Pending'}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback>
                <Text style={styles.forgotPassword}>Resend Code</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => verify(null, inputCode)}>
                <Text style={styles.loginButton}>Verify Code</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  props.setLoginState({
                    login: false,
                    register: false,
                    forgotPassword: false,
                    verifyEmail: true,
                  })
                }>
                <Text>Don't have an account? Click here to Sign Up</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </>
      )}
      {passwordState.createPassword && (
        <>
          <View style={styles.loginContainer}>
            <View style={styles.blackArrow}>
              <TouchableWithoutFeedback
                onPress={() => props.setView({profile: true})}>
                <Image
                  style={styles.blackArrow}
                  source={require('./media/black_left_arrow.png')}
                />
              </TouchableWithoutFeedback>
            </View>
            <Image
              style={styles.wmLogo}
              source={{
                uri: 'http://10.0.2.2:8000/' + props.profile.profile_picture,
              }}
            />
            <View style={styles.loginText}>
              <Text style={styles.header}>Create a new password</Text>
              <TextInput
                placeholder="Enter your password"
                onChangeText={text =>
                  setNewPassword({...newPassword, password: text})
                }
                style={styles.input}
                textContentType="password"
                secureTextEntry={true}
              />
              <TextInput
                placeholder="Confirm your password"
                onChangeText={text =>
                  setNewPassword({...newPassword, confirm: text})
                }
                style={styles.input}
                textContentType="password"
                secureTextEntry={true}
              />
            </View>

            <Text>Password must contain 8 characters</Text>
            <TouchableWithoutFeedback
              style={styles.loginButton}
              onPress={() => {
                changePassword();
              }}>
              <Text style={styles.loginButton}>Create a new password</Text>
            </TouchableWithoutFeedback>
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

function Notifications(props: any): JSX.Element {
  const [newMessages, setNewMessages] = useState(true);
  const [likedPostUpdates, setLikedPostUpdates] = useState(true);
  const [userSettings, setUserSettings] = useState({});
  const [profileID, setProfileID] = useState('');

  useEffect(() => {
    showNotifications();
  }, []);

  const showNotifications = async () => {
    let profile_id;
    await axios
      .get('http://10.0.2.2:8000/profiles/get_id/' + props.profile + '/')
      .then(response => {
        setProfileID(response.data.id);
        profile_id = response.data.id;
      })
      .catch((err: any) => console.log(err));
    await axios
      .get('http://10.0.2.2:8000/user_settings/' + profile_id)
      .then(response => {
        setNewMessages(response.data.new_messages);
        setLikedPostUpdates(response.data.liked_posts_updates);
        setUserSettings(response.data);
      })
      .catch(error => console.log(error));
  };

  const changedNewMessages = async choice => {
    let data = userSettings;
    data.new_messages = choice;
    await axios
      .patch(
        'http://10.0.2.2:8000/user_settings/new_messages/' + profileID + '/',
        data,
      )
      .then(response => {
        setNewMessages(choice);
      })
      .catch(error => console.log(error));
  };

  const changedLikedPosts = async choice => {
    let data = userSettings;
    data.liked_post_updates = choice;
    await axios
      .patch(
        'http://10.0.2.2:8000/user_settings/liked_posts/' + profileID + '/',
        data,
      )
      .then(response => {
        setLikedPostUpdates(choice);
      })
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.userSettings}>
      <View style={styles.blackArrow}>
        <TouchableWithoutFeedback
          onPress={() => props.setView({settings: true})}>
          <Image
            style={styles.blackArrow}
            source={require('./media/black_left_arrow.png')}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>New Messages</Text>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={{fontSize: 12.5}}>
            Pink Bunny: 'Hello, I would like to purchase this'
          </Text>
          <View style={styles.toggle}>
            <View style={{width: 20}}>
              <Text>On</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => changedNewMessages(true)}>
              <View style={styles.outerCircle}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: newMessages ? Colors.black : Colors.white,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.toggle}>
            <View style={{width: 20}}>
              <Text>Off</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => changedNewMessages(false)}>
              <View style={styles.outerCircle}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: !newMessages ? Colors.black : Colors.white,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>

      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>Liked Post Updates</Text>
        </View>
        <View style={styles.toggleContainer}>
          <Text style={{fontSize: 12.5}}>
            'Calligraphy Pens and Inks' price has gone down from $20.50 to
            $18.00
          </Text>
          <View style={styles.toggle}>
            <View style={{width: 20}}>
              <Text>On</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => changedLikedPosts(true)}>
              <View style={styles.outerCircle}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: likedPostUpdates
                      ? Colors.black
                      : Colors.white,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.toggle}>
            <View style={{width: 20}}>
              <Text>Off</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => changedLikedPosts(false)}>
              <View style={styles.outerCircle}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: !likedPostUpdates
                      ? Colors.black
                      : Colors.white,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
}

function Privacy(props: any): JSX.Element {
  return (
    <View style={styles.userSettings}>
      <View style={styles.blackArrow}>
        <TouchableWithoutFeedback
          onPress={() => props.setView({settings: true})}>
          <Image
            style={styles.blackArrow}
            source={require('./media/black_left_arrow.png')}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>Privacy Policy</Text>
        </View>
        <View style={styles.toggleContainer}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 15}}>View our Privacy Policy Here</Text>
          </View>
        </View>
      </View>
      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>Terms and Conditions</Text>
        </View>
        <View style={styles.toggleContainer}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 15}}>
              View our Terms and Conditions here:
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HelpOrFeedback(props: any): JSX.Element {
  const [view, setView] = useState({
    help: true,
    feedback: false,
  });

  const [content, setContent] = useState('');

  const sendFeedback = async () => {
    axios.post('http://10.0.2.2:8000/feedback/', {
      username: props.profile.id,
      email: props.profile.email,
      first_name: props.profile.first_name,
      last_name: props.profile.last_name,
      content: content,
    });

    // Return to the mains settings screen with a message telling
    // the user the message was sent
    props.setView({settings: true});
    props.setErrorMessage('Feedback submitted.  Thank you for your input!');
    setContent('');
  };

  return (
    <>
      {view.help && (
        <View style={styles.userSettings}>
          <View style={styles.blackArrow}>
            <TouchableWithoutFeedback
              onPress={() => props.setView({support: true})}>
              <Image
                style={styles.blackArrow}
                source={require('./media/black_left_arrow.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.helpHeader}>
            <Text style={styles.settingsOption}>Contact Us</Text>
          </View>
          <View style={styles.notificationSettingsContainer}>
            <View style={styles.helpContainer}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 17.5,
                  textAlign: 'center',
                  width: '70%',
                }}>
                Give us feedback or contact us at marketappwm@gmail.com
              </Text>
              <TouchableWithoutFeedback
                onPress={() =>
                  setView({
                    help: false,
                    feedback: true,
                  })
                }>
                <Text style={styles.submitFeedback}>Send Feedback</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      )}
      {view.feedback && (
        <View style={styles.userSettings}>
          <View style={styles.blackArrow}>
            <TouchableWithoutFeedback
              onPress={() => props.setView({support: true})}>
              <Image
                style={styles.blackArrow}
                source={require('./media/black_left_arrow.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.userFeedbackSettings}>
            <View style={styles.feedbackContainer}>
              <Text>Tell us how we can improve!</Text>
              <TextInput
                style={styles.feedbackInput}
                multiline={true}
                textAlignVertical={'top'}
                onChangeText={text => setContent(text)}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  sendFeedback();
                }}>
                <Text style={styles.submitFeedback}>Send Feedback</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.maxLimitContainer}>
            <Text
              style={{
                color: Colors.black,
                fontSize: normalize(15),
                textAlign: 'center',
                width: '70%',
              }}>
              If reached max. limit or for more concerns/issues, please contact
              us at marketappwm@gmail.com
            </Text>
          </View>
        </View>
      )}
    </>
  );
}

function Support(props: any): JSX.Element {
  var options = ['Violations', 'Help'];
  return (
    <View style={styles.userSettings}>
      <View style={styles.blackArrow}>
        <TouchableWithoutFeedback
          onPress={() => props.setView({settings: true})}>
          <Image
            style={styles.blackArrow}
            source={require('./media/black_left_arrow.png')}
          />
        </TouchableWithoutFeedback>
      </View>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              if (value === 'Violations') {
                props.setView({violations: true});
              } else if (value === 'Help') {
                props.setView({helpOrFeedback: true});
              }
            }}>
            <View
              style={
                value === 'Violations'
                  ? styles.supportOptionContainerTop
                  : styles.settingsOptionContainerBottom
              }>
              <Text style={styles.settingsOption}>{value}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

function Violations(props: any): JSX.Element {
  interface template {
    scamming: boolean;
    harassment: boolean;
    illegal_goods: boolean;
    nickname: boolean;
    language: boolean;
    no_show: boolean;
    post_name: boolean;
    damaged_product: boolean;
    already_sold: boolean;
  }

  const [settings, setSettings]: [template, Function] = useState({
    scamming: false,
    harassment: false,
    illegal_goods: false,
    nickname: false,
    language: false,
    no_show: false,
    post_name: false,
    damaged_product: false,
    already_sold: false,
  });

  const violations = [
    'scamming',
    'harassment',
    'illegal_goods',
    'nickname',
    'language',
    'no_show',
    'post_name',
    'damaged_product',
    'already_sold',
  ];

  return (
    <View style={styles.userSettings}>
      <View style={styles.blackArrow}>
        <TouchableWithoutFeedback
          onPress={() => props.setView({support: true})}>
          <Image
            style={styles.blackArrow}
            source={require('./media/black_left_arrow.png')}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>Violations</Text>
        </View>
        <View style={styles.toggleContainer}>
          {props.violations.map((type: any) => {
            console.log(violations, 'test')
            return (
              violations.includes(type.toLowerCase()) && (
                <View style={styles.violationsToggle}>
                  <View>
                    <Text style={{width: 100}}>
                      {type.toUpperCase().split('_').join(' ')}
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setSettings({
                        ...settings,
                        [type]: !settings[type as keyof template],
                      });
                    }}>
                    <Text
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        backgroundColor: settings[type as keyof template]
                          ? 'rgb(17, 87, 64)'
                          : '#D7D7D7',
                        color: settings[type as keyof template]
                          ? Colors.white
                          : Colors.black,
                        position: 'absolute',
                        right: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 60,
                        height: 25,
                        lineHeight: 25,
                        borderRadius: 10,
                        textAlign: 'center',
                      }}>
                      Appeal
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              )
            );
          })}
        </View>
      </View>
    </View>
  );
}

function UserSettings(props: any): JSX.Element {
  const [view, setView]: [any, Function] = useState({settings: true});

  const [errorMessage, setErrorMessage] = useState('');

  const options = [
    'Settings',
    'Profile',
    'Notifications',
    'Privacy',
    'Support',
    'Violations',
    'Logout',
  ];

  return (
    <>
      {view.settings && (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: '#f6f7f5',
            height: filterHeight(SCREEN_HEIGHT),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: !errorMessage ? 1 : 0.6,
          }}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={{
                uri: 'http://10.0.2.2:8000' + props.profile.profile_picture,
              }}
              style={styles.profilePictureBorder}
            />
          </View>
          {options.map(value => {
            return (
              value !== 'Settings' &&
              value !== 'Violations' &&
              value !== 'Logout' && (
                <>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setView({[value.toLowerCase()]: true});
                      props.setUserSettings({
                        ...props.userSettings,
                        title: value,
                      });
                    }}>
                    <View
                      style={
                        value === 'Profile'
                          ? styles.settingsOptionContainerTop
                          : value === 'Support'
                          ? styles.settingsOptionContainerBottom
                          : styles.settingsOptionContainer
                      }>
                      <Text style={styles.settingsOption}>{value}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </>
              )
            );
          })}
          <TouchableWithoutFeedback
            onPress={() => {
              setView({helpOrFeedback: true});
            }}>
            <View style={styles.settingsOptionSendFeedback}>
              <Text style={styles.settingsOption}>Send Feedback</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => props.login()}>
            <View style={styles.settingsOptionLogOut}>
              <Text style={styles.settingsOption}>Log Out</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
      {view.profile && (
        <Profile
          profile={props.profile}
          setView={setView}
          date={props.date}
          userSettings={props.userSettings.data}
          viewProfile={props.viewProfile}
        />
      )}
      {view.notifications && (
        <Notifications
          profile={props.profile.username}
          userSettings={props.userSettings.data}
          setView={setView}
        />
      )}
      {view.privacy && (
        <Privacy userSettings={props.userSettings.data} setView={setView} />
      )}
      {view.support && <Support setView={setView} />}
      {view.violations && (
        <Violations
          userSettings={props.userSettings.data}
          setView={setView}
          violations={props.violations}
        />
      )}
      {view.changePassword && (
        <ChangePassword
          profile={props.profile}
          setView={setView}
          login={props.login}
        />
      )}
      {view.helpOrFeedback && (
        <HelpOrFeedback
          profile={props.profile}
          setView={setView}
          setErrorMessage={setErrorMessage}
        />
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
  profilePictureContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    width: normalize(90),
    height: normalize(90),
    borderRadius: normalize(45),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(30),
    marginBottom: normalize(15),
  },
  profileDescription: {
    display: 'flex',
    width: '80%',
    height: 125,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(30),
    marginBottom: normalize(15),
    columnGap: 10,
  },
  profilePictureBorder: {
    width: normalize(90),
    height: normalize(90),
    borderRadius: normalize(45),
    borderColor: Colors.black,
  },
  userSettings: {
    backgroundColor: '#f6f7f5',
    height: filterHeight(SCREEN_HEIGHT),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  settingsOptionContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: normalize(40),
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  settingsOptionContainerTop: {
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'gray',
    height: normalize(40),
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  settingsOptionContainerBottom: {
    borderColor: 'gray',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: normalize(40),
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  settingsOptionSendFeedback: {
    borderRadius: 20,
    height: normalize(40),
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c3e6b5',
    paddingLeft: 10,
    marginTop: 20,
  },
  settingsOptionLogOut: {
    borderColor: 'gray',
    borderRadius: 20,
    height: normalize(40),
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingLeft: 10,
    marginTop: normalize(30),
  },
  notificationSettingsContainer: {
    backgroundColor: Colors.white,
    borderColor: 'gray',
    borderRadius: 20,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 60,
    paddingBottom: 10,
  },
  helpHeader: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 60,
  },
  notificationHeader: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: normalize(40),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 10,
  },
  settingsOption: {
    fontSize: normalize(15),
  },
  outerCircle: {
    position: 'absolute',
    right: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1,
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    rowGap: 10,
  },
  helpContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    rowGap: 30,
  },
  toggle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 300,
    width: '100%',
  },
  violationsToggle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 215,
    width: '100%',
  },
  supportOptionContainerTop: {
    marginTop: 50,
    borderBottomWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'gray',
    height: 50,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  blackArrow: {
    position: 'absolute',
    left: normalize(7.5),
    top: normalize(7.5),
    width: 20,
    height: 20,
  },
  loginContainer: {
    backgroundColor: Colors.white,
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
  wmLogo: {
    width: 150,
    height: 150,
    borderRadius: 25,
    overflow: 'hidden',
  },
  loginText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
  header: {
    fontSize: 20,
    width: 250,
    textAlign: 'center',
    color: Colors.black,
  },
  emailInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    width: 300,
    height: 50,
    color: Colors.black,
    paddingLeft: 10,
    margin: 0,
  },
  inputSmall: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    width: 225,
    height: 50,
    color: Colors.black,
    paddingLeft: 10,
    margin: 0,
  },
  loginButton: {
    width: 250,
    height: 40,
    borderRadius: 15,
    backgroundColor: 'rgb(17, 87, 64)',
    textAlign: 'center',
    lineHeight: 40,
    color: Colors.white,
  },
  errorMessageContainer: {
    position: 'absolute',
    top: '20%',
    left: '32.5%',
    transform: [{translateX: -50}],
    width: 250,
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#D7D7D7',
    borderRadius: 10,
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
  submitFeedback: {
    width: '70%',
    height: 40,
    borderRadius: 15,
    backgroundColor: 'rgb(17, 87, 64)',
    textAlign: 'center',
    lineHeight: 40,
    color: Colors.white,
  },
  feedbackContainer: {
    backgroundColor: Colors.white,
    width: '100%',
    height: normalize(225),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    rowGap: 10,
  },
  feedbackInput: {
    width: '80%',
    height: '50%',
    backgroundColor: '#D0D3D4',
    borderRadius: 20,
    padding: 20,
  },
  userFeedbackSettings: {
    backgroundColor: '#f6f7f5',
    display: 'flex',
    height: '70%',
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxLimitContainer: {
    backgroundColor: Colors.white,
    borderColor: 'gray',
    borderRadius: 20,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default UserSettings;
