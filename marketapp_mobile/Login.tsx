import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
// import DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'expo-image-picker';
import camera from './media/camera_1.png';

import {
  Button,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Dimensions, Platform, PixelRatio} from 'react-native';
import {UserContext} from './App';
import {PrivacyPolicy} from './PrivacyPolicy';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

/**
 * Function to make font sizes, margin sizes,
 * and other related sizing consistent
 * @param size the desired size
 * @returns a consistent size to match across different phones
 */
function normalize(size: any) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

function ForgotPassword(props): JSX.Element {
  const [passwordState, setPasswordState] = useState({
    sendCode: true,
    createPassword: false,
  });

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState({
    username: '',
    password: '',
    confirm: '',
    email: email,
  });
  const [code, setCode] = useState({
    code: '',
    codeSent: false,
  });
  const [inputCode, setInputCode] = useState('');

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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const verify = async (inputEmail: string = '', inputCode: string = '') => {
    // Making sure the inputEmail is from a W&M email domain
    let domain = inputEmail ? inputEmail.split('@')[1] : '';

    if (inputEmail && domain === 'wm.edu') {
      setNewPassword({...newPassword, email: inputEmail});
      await axios
        .post(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/users/verify/`,
          {
            email: email,
            username: username,
            register: 0,
          },
        )
        .then(response => {
          if (response.data.status === 400) {
            props.setErrorMessage(
              'Error with the validation process.  Make sure the email is used for this account and try again.',
            );
          } else {
            setCode({
              code: response.data.code,
              codeSent: true,
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else if (inputCode === code.code && code.code.length) {
      setPasswordState({
        sendCode: false,
        createPassword: true,
      });
    } else if (!inputEmail || domain !== 'wm.edu') {
      props.setErrorMessage('Please enter a valid W&M address');
    } else if (inputCode !== code.code) {
      props.setErrorMessage('Incorrect verification code.  Please try again');
    }
  };

  const changePassword = async () => {
    if (
      newPassword.password === newPassword.confirm &&
      newPassword.password.length >= 8 &&
      newPassword.username.length
    ) {
      await axios
        .post(
          `${
            inProdMode ? prodURL : emulator ? devURL : ngrok
          }/users/change_password/`,
          newPassword,
        )
        .then(res => {
          if (res.data.success) {
            props.setLoginState({
              login: true,
              register: false,
              forgotPassword: false,
              verifyEmail: false,
            });
          } else {
            props.setErrorMessage(
              'Username and email on file do not match.  Please re-enter your email and try again',
            );
          }
        })
        .catch((err: any) => console.log(err));
    } else if (
      newPassword.password !== newPassword.confirm &&
      newPassword.password.length
    ) {
      props.setErrorMessage('Passwords do not match.  Please try again.');
    } else if (newPassword.password.length < 8) {
      props.setErrorMessage('Insufficient password length.  Please try again');
    } else if (!newPassword.username.length) {
      props.setErrorMessage('Please enter your username');
    } else {
      props.setErrorMessage('An unknown error has occurred');
    }
  };

  return (
    <>
      {passwordState.sendCode && (
        <>
          <TouchableWithoutFeedback
            onPress={() =>
              props.setLoginState({
                login: true,
                register: false,
                forgotPassword: false,
                verifyEmail: false,
              })
            }>
            <Image
              style={styles.blackArrow}
              source={require('./media/black_left_arrow.png')}
            />
          </TouchableWithoutFeedback>
          <View style={styles.loginContainer}>
            <Image
              style={styles.wmLogo}
              source={require('./media/app_logo.png')}
            />
            <View style={styles.loginText}>
              <Text style={styles.header}>Verify your W&M email account</Text>
              <View style={styles.emailInput}>
                <TextInput
                  placeholder="Enter your school email"
                  placeholderTextColor={'gray'}
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
                      overflow: 'hidden',
                    }}>
                    {code.codeSent ? 'Code Sent' : 'Send Code'}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.emailInput}>
                <TextInput
                  placeholder="Enter your verification code"
                  placeholderTextColor={'gray'}
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
                      overflow: 'hidden',
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
          <TouchableWithoutFeedback
            onPress={() =>
              props.setLoginState({
                login: true,
                register: false,
                forgotPassword: false,
                verifyEmail: false,
              })
            }>
            <Image
              style={styles.blackArrow}
              source={require('./media/black_left_arrow.png')}
            />
          </TouchableWithoutFeedback>
          <View style={styles.loginContainer}>
            <Image
              style={styles.wmLogo}
              source={require('./media/app_logo.png')}
            />
            <View style={styles.loginText}>
              <Text style={styles.header}>Create a new password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={'gray'}
                onChangeText={text =>
                  setNewPassword({...newPassword, password: text})
                }
                style={styles.input}
                textContentType="password"
                secureTextEntry={true}
              />
            </View>
            <View style={styles.emailInput}>
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor={'gray'}
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
    </>
  );
}

function Register(props): JSX.Element {
  const [hasRead, setRead] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [email, setEmail] = useState('');
  const [agreed, setAgreement] = useState(false);

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    profile_picture: {},
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const [userSelect, setUsername] = useState({
    hasUser: false,
    isTaken: false,
  });

  const [profilePicture, setProfilePicture] = useState('');

  /**
   * Used to show that the user has viewed the Privacy Policy.
   * Required to create an account.
   */
  useEffect(() => {
    if (hasOpened) {
      setRead(true);
    }
  }, [hasOpened]);

  /**
   * Stores the email used for the verification into the profile
   */
  useEffect(() => {
    setEmail(props.email);
  }, [])

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

  const chooseImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!res.canceled) {
      setProfile({
        ...profile,
        profile_picture: {
          uri: res.assets[0].uri,
          type: 'image/jpeg',
          name: 'image.png',
        },
      });
      setProfilePicture(res.assets[0].uri);
    }
  };

  const checkUsername = () => {
    setUsername({
      hasUser: false,
      isTaken: false,
    });
  };

  const createAccount = async () => {
    let data = new FormData();
    let validInformation =
      profile.password === confirmPassword &&
      profile.password.length >= 8 &&
      profile.username.length > 0 &&
      agreed &&
      hasRead &&
      Object.keys(profile.profile_picture).length;

    if (validInformation) {
      let profile_id;
      for (const [key, value] of Object.entries(profile)) {
        data.append(key, value);
      }
      //TODO: Add logic for if user has a user set up, but NOT a password
      await axios
        .post(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/users/`,
          {
            username: profile.username,
            password: profile.password,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: email,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        // .then(response => {
        //   console.log(response);
        // })
        .catch((err: any) => {
          console.log(err);
          props.setErrorMessage(
            'An error has occurred within our server.  Please try again later',
          );
        });

      await axios
        .post(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/profiles/`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then(response => {
          console.log(response);
          profile_id = response.data.id;
        })
        .catch((err: any) => {
          console.log(err);
          props.setErrorMessage(
            'An error has occurred within our server.  Please try again later',
          );
        });

      await axios
        .post(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/user_settings/`,
          {
            username: profile_id,
          },
        )
        .then(() => props.returnHome(profile.username))
        .catch((err: any) => console.log(err));
    } else if (profile.password !== confirmPassword) {
      props.setErrorMessage('Passwords do not match.  Please try again.');
    } else if (profile.password.length < 8) {
      props.setErrorMessage('Insufficient password length.  Please try again.');
    } else if (profile.username.length === 0) {
      props.setErrorMessage('Please enter a username.');
    } else if (!Object.keys(profile.profile_picture).length) {
      props.setErrorMessage('Please select a profile picture');
    } else if (!agreed) {
      props.setErrorMessage(
        'Must accept Terms and Conditions and Privacy Policy',
      );
    } else if (!hasRead) {
      props.setErrorMessage(
        'Please view our Terms and Conditions and Privacy Policy',
      );
    } else {
      props.setErrorMessage(
        'An unknown error has occurred.  Please try again later',
      );
    }
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() =>
          props.setLoginState({
            login: false,
            register: false,
            forgotPassword: true,
            verifyEmail: false,
          })
        }>
        <Image
          style={styles.blackArrow}
          source={require('./media/black_left_arrow.png')}
        />
      </TouchableWithoutFeedback>
      <View style={styles.loginContainer}>
        <TouchableWithoutFeedback onPress={() => chooseImage()}>
          <View style={styles.profilePicture}>
            <Image
              source={profilePicture ? {uri: profilePicture} : camera}
              width={profilePicture ? 150 : 100}
              height={profilePicture ? 150 : 100}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.createAccountText}>
          <TextInput
            placeholder="Enter your first name"
            placeholderTextColor={'gray'}
            onChangeText={text => setProfile({...profile, first_name: text})}
            value={profile.first_name}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your last name"
            placeholderTextColor={'gray'}
            onChangeText={text => setProfile({...profile, last_name: text})}
            value={profile.last_name}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor={'gray'}
            onChangeText={text => setProfile({...profile, username: text})}
            value={profile.username}
            style={styles.input}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              setUsername({
                hasUser: true,
                isTaken: false,
              });
            }}>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                backgroundColor: !userSelect.hasUser
                  ? 'rgb(176,211,229)'
                  : userSelect.isTaken
                  ? 'rgb(233,132,132)'
                  : 'rgb(138,178,147)',
                width: 150,
                height: 30,
                borderRadius: 10,
                textAlign: 'center',
                lineHeight: 30,
                overflow: 'hidden',
              }}>
              {!userSelect.hasUser
                ? 'Check nickname'
                : userSelect.isTaken
                ? 'Nickname Taken'
                : 'Great Nickname!'}
            </Text>
          </TouchableWithoutFeedback>

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={'gray'}
            onChangeText={text => setProfile({...profile, password: text})}
            style={styles.input}
            value={profile.password}
            textContentType="password"
            secureTextEntry={true}
          />
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor={'gray'}
            onChangeText={text => setConfirmPassword(text)}
            value={confirmPassword}
            style={styles.input}
            textContentType="password"
            secureTextEntry={true}
          />
          <Text style={styles.usernameWarning}>
            *Usernames are not changeable
          </Text>

          <View style={styles.termsAndConditionsContainer}>
            <TouchableWithoutFeedback onPress={() => setAgreement(!agreed)}>
              <View style={styles.outerCircle}>
                <View
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    backgroundColor: agreed ? Colors.black : Colors.white,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={{width: '80%', textAlign: 'center'}}>
              I have read and agreed to the
              <Text style={styles.termsAndConditionsBold}>
                {' Terms and Conditions '}
              </Text>
              and
              {/* eslint-disable-next-line prettier/prettier */}
              <TouchableWithoutFeedback onPress={() => setHasOpened(true)}>
                <Text style={styles.privacyPolicyBold}> Privacy Policy</Text>
              </TouchableWithoutFeedback>
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={() => createAccount()}>
            <Text style={styles.createAccountButton}>Create Account</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              props.setLoginState({
                login: true,
                register: false,
                forgotPassword: false,
                verifyEmail: false,
              })
            }>
            <Text>Already have an account? Click here</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
      {hasOpened && (
        <View style={styles.privacyPolicyContainer}>
          <View style={styles.errorMessageBanner}>
            <TouchableWithoutFeedback onPress={() => setHasOpened(false)}>
              <Text style={styles.exitErrorMessage}>Close</Text>
            </TouchableWithoutFeedback>
          </View>
          <PrivacyPolicy />
        </View>
      )}
    </>
  );
}

function Verify(props): JSX.Element {
  const [code, setCode] = useState({
    code: '',
    codeSent: false,
  });

  const [email, setEmail] = useState('');
  const [inputCode, setInputCode] = useState('');

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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const verify = async (inputEmail: string = '', inputCode: string = '') => {
    // Making sure the inputEmail is from a W&M email domain
    let domain = inputEmail ? inputEmail.split('@')[1] : '';

    if (inputEmail && domain === 'wm.edu') {
      // Passes the email from the verification screen to the create profile screen
      props.setEmail(inputEmail);

      await axios
        .post(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/users/verify/`,
          {email: email, register: 1},
        )
        .then(response => {
          setCode({
            code: response.data.code,
            codeSent: true,
          });
        })
        .catch((err: any) => {
          console.log(err);
          props.setErrorMessage(
            'Error with validation process. Please try again.',
          );
        });
    } else if (inputCode === code.code && code.code.length) {
      props.setLoginState({
        login: false,
        register: true,
        forgotPassword: false,
        verifyEmail: false,
      });
    } else if (inputCode !== code.code) {
      props.setErrorMessage('Incorrect verification code.  Please try again.');
    } else if (!inputEmail || domain !== 'wm.edu') {
      props.setErrorMessage('Please enter a valid W&M address');
    }
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() =>
          props.setLoginState({
            login: true,
            register: false,
            forgotPassword: false,
            verifyEmail: false,
          })
        }>
        <Image
          style={styles.blackArrow}
          source={require('./media/black_left_arrow.png')}
        />
      </TouchableWithoutFeedback>
      <View style={styles.loginContainer}>
        <Image style={styles.wmLogo} source={require('./media/app_logo.png')} />
        <View style={styles.loginText}>
          <Text style={styles.header}>Verify your W&M email account</Text>
          <View style={styles.emailInput}>
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter your school email"
              placeholderTextColor={'gray'}
              onChangeText={text => setEmail(text)}
            />
            <TouchableWithoutFeedback
              style={{
                backgroundColor: code.codeSent ? Colors.green : Colors.blue,
              }}
              onPressOut={() => verify(email)}>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: code.codeSent
                    ? 'rgb(138,178,147)'
                    : 'rgb(176,211,229)',
                  fontSize: normalize(12.5),
                  padding: 7.5,
                  borderRadius: 10,
                  textAlign: 'center',
                  lineHeight: 30,
                  overflow: 'hidden',
                }}>
                {code.codeSent ? 'Code Sent' : 'Send Code'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.emailInput}>
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter verification code"
              placeholderTextColor={'gray'}
              onChangeText={text => setInputCode(text)}
            />
            <TouchableWithoutFeedback>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor:
                    inputCode === code.code && inputCode.length
                      ? 'rgb(138,178,147)'
                      : 'rgb(176,211,229)',
                  fontSize: normalize(12.5),
                  padding: 7.5,
                  borderRadius: 10,
                  textAlign: 'center',
                  lineHeight: 30,
                  overflow: 'hidden',
                }}
                onPress={() => verify(null, inputCode)}>
                {inputCode === code.code && inputCode.length
                  ? 'Verified'
                  : 'Pending'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={() => verify(null, inputCode)}>
            <Text style={styles.loginButton}>Continue Sign Up</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              props.setLoginState({
                login: true,
                register: false,
                forgotPassword: false,
                verifyEmail: false,
              })
            }>
            <Text style={styles.createAccount}>
              Already have an account? Click here
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );
}

function Login(props): JSX.Element {
  const [loginState, setLoginState] = useState({
    login: true,
    register: false,
    forgotPassword: false,
    verifyEmail: false,
  });

  const [info, setInfo] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  /**
   * The email the user is creating the account with.
   * Passed from the verification screen to the create account screen
   */
  const [email, setEmail] = useState('');

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

  // Redirect to Forgot Password screen immediately if desired from app
  useState(() => {
    if (props.redirect === 'Forgot Password') {
      setLoginState({
        login: false,
        register: false,
        forgotPassword: true,
        verifyEmail: false,
      });
    }
  });

  const login = async () => {
    const data = {
      username: info.username,
      password: info.password,
    };
    if (data.username && data.password) {
      await axios
        .post(
          `${inProdMode ? prodURL : emulator ? devURL : ngrok}/users/login/`,
          data,
        )
        .then(response => {
          console.log(response.data)
          if (response.data.login) {
            if (response.data.register) {
              setLoginState({
                login: false,
                register: true,
                forgotPassword: false,
                verifyEmail: false,
              });
            } else {
              // passing the login user and if the user is an admin
              props.returnHome(info.username, response.data.admin);
            }
          } else {
            setErrorMessage('Invalid Login Credentials.  Please try again.');
            setInfo({...info, password: ''});
          }
        })
        .catch((err: any) => console.log(err));
      setInfo({...info, password: ''});
    } else {
      setErrorMessage('Please enter login information.');
      setInfo({...info, password: ''});
    }
  };

  return (
    <>
      {loginState.login && (
        <>
          <View style={styles.loginContainer}>
            <Image
              style={styles.wmLogo}
              source={require('./media/app_logo.png')}
            />
            <View style={styles.loginText}>
              <Text style={styles.title}>Welcome to BOTL</Text>
              <TextInput
                placeholder="Enter username"
                placeholderTextColor={'gray'}
                onChangeText={text => setInfo({...info, username: text})}
                value={info.username}
                style={styles.input}
              />
              <TextInput
                placeholder="Enter Password"
                placeholderTextColor={'gray'}
                onChangeText={text => setInfo({...info, password: text})}
                value={info.password}
                style={styles.input}
                textContentType="password"
                secureTextEntry={true}
              />
              <TouchableWithoutFeedback onPress={() => login()}>
                <Text style={styles.loginButton}>Log In</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  setLoginState({
                    login: false,
                    register: false,
                    forgotPassword: true,
                    verifyEmail: false,
                  })
                }>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  setLoginState({
                    login: false,
                    register: false,
                    forgotPassword: false,
                    verifyEmail: true,
                  })
                }>
                <Text style={styles.createAccount}>Create a new account</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </>
      )}
      {loginState.register && (
        <Register
          setLoginState={setLoginState}
          setInfo={setInfo}
          info={info}
          returnHome={props.returnHome}
          setErrorMessage={setErrorMessage}
          email={email}
        />
      )}
      {loginState.forgotPassword && (
        <ForgotPassword
          setLoginState={setLoginState}
          setErrorMessage={setErrorMessage}
        />
      )}
      {loginState.verifyEmail && (
        <Verify
          setLoginState={setLoginState}
          setErrorMessage={setErrorMessage}
          email={email}
          setEmail={setEmail}
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
  loginContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: normalize(15),
  },
  loginText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: normalize(7.5),
  },
  loginButton: {
    minWidth: 200,
    borderRadius: 15,
    padding: 5,
    fontSize: normalize(15),
    backgroundColor: 'rgb(17, 87, 64)',
    textAlign: 'center',
    lineHeight: 40,
    color: Colors.white,
    overflow: 'hidden',
  },
  createAccountButton: {
    width: 250,
    height: 40,
    borderRadius: 15,
    backgroundColor: 'rgb(17, 87, 64)',
    textAlign: 'center',
    lineHeight: 40,
    color: Colors.white,
    margin: 10,
    overflow: 'hidden',
  },
  header: {
    fontSize: normalize(15),
    textAlign: 'center',
  },
  title: {
    fontSize: normalize(22.5),
    textAlign: 'center',
  },
  createAccount: {
    textDecorationLine: 'underline',
    fontSize: normalize(12.5),
    color: 'gray',
    margin: 10,
  },
  createAccountText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    color: 'rgb(17, 87, 64)',
    textDecorationLine: 'underline',
    fontSize: normalize(12.5),
  },
  wmLogo: {
    width: normalize(150),
    height: normalize(150),
    borderRadius: normalize(25),
    overflow: 'hidden',
  },
  profilePicture: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(75),
    borderWidth: 2,
    borderColor: Colors.black,
    overflow: 'hidden',
  },
  emailInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    fontSize: normalize(15),
    width: normalize(250),
    height: normalize(40),
    color: Colors.black,
    paddingLeft: 10,
    margin: 0,
  },
  inputLeft: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    width: normalize(270),
    height: normalize(40),
    color: Colors.black,
    paddingLeft: 10,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  inputSmall: {
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    width: normalize(200),
    height: 50,
    color: Colors.black,
    paddingLeft: 10,
    margin: 0,
    fontSize: normalize(12.5),
  },
  blackArrow: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 20,
    height: 20,
  },
  termsAndConditionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 0,
  },
  termsAndConditionsBold: {
    fontWeight: 'bold',
  },
  privacyPolicyBold: {
    fontWeight: 'bold',
    color: 'blue',
    textDecorationLine: 'underline',
  },
  usernameWarning: {
    marginTop: 10,
    marginBottom: normalize(20),
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
  privacyPolicyContainer: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    transform: [{translateX: -50}],
    maxWidth: normalize(300),
    maxHeight: normalize(400),
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
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'black',
    textAlign: 'center',
  },
  outerCircle: {
    display: 'flex',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Login;
