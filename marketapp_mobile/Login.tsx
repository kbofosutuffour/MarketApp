import axios from 'axios';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';

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

function ForgotPassword(props): JSX.Element {
  const [passwordState, setPasswordState] = useState({
    sendCode: true,
    createPassword: false,
  });

  const [email, setEmail] = useState('');
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
          props.setErrorMessage(
            'Error with the validation process.  Please try again.',
          );
        });
    } else if (inputCode === code.code && code.code.length) {
      setPasswordState({
        sendCode: false,
        createPassword: true,
      });
    } else if (!inputEmail || domain !== 'wm.edu') {
      props.setErrorMessage('Please enter a valid W&M address');
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
          props.setLoginState({
            login: true,
            register: false,
            forgotPassword: false,
            verifyEmail: false,
          });
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
              source={require('./media/wm_logo_green.png')}
            />
            <View style={styles.loginText}>
              <Text style={styles.header}>Create a new password</Text>
              <View style={styles.emailInput}>
                <TextInput
                  placeholder="Enter your username"
                  onChangeText={text =>
                    setNewPassword({...newPassword, username: text})
                  }
                  style={styles.input}
                />
              </View>
              <TextInput
                placeholder="Enter your password"
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
  const [email, setEmail] = useState('');

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

  const chooseImage = async () => {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    setProfile({
      ...profile,
      profile_picture: {
        uri: res[0].uri,
        type: res[0].type,
        name: 'image.png',
      },
    });
    setProfilePicture(res[0].uri);
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
      Object.keys(profile.profile_picture).length;

    if (validInformation) {
      for (const [key, value] of Object.entries(profile)) {
        data.append(key, value);
      }
      await axios
        .post('http://10.0.2.2:8000/users/', {
          username: profile.username,
          password: profile.password,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: email,
        })
        .then(response => {
          console.log(response);
        })
        .catch((err: any) => {
          console.log(err);
          props.setErrorMessage(
            'An error has occurred within our server.  Please try again later',
          );
        });

      await axios
        .post('http://10.0.2.2:8000/profiles/', data)
        .then(response => {
          console.log(response);
          props.returnHome(profile.username);
        })
        .catch((err: any) => {
          console.log(err);
          props.setErrorMessage(
            'An error has occurred within our server.  Please try again later',
          );
        });
    } else if (profile.password !== confirmPassword) {
      props.setErrorMessage('Passwords do not match.  Please try again.');
    } else if (profile.password.length < 8) {
      props.setErrorMessage('Insufficient password length.  Please try again.');
    } else if (profile.username.length === 0) {
      props.setErrorMessage('Please enter a username.');
    } else if (!Object.keys(profile.profile_picture).length) {
      props.setErrorMessage('Please select a profile picture');
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
          <Image
            style={styles.profilePicture}
            source={
              profilePicture
                ? {uri: profilePicture}
                : require('./media/camera.png')
            }
          />
        </TouchableWithoutFeedback>

        <View style={styles.createAccountText}>
          <TextInput
            placeholder="Enter your first name"
            onChangeText={text => setProfile({...profile, first_name: text})}
            value={profile.first_name}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your last name"
            onChangeText={text => setProfile({...profile, last_name: text})}
            value={profile.last_name}
            style={styles.input}
          />
          <TextInput
            placeholder="Re-enter your email address"
            onChangeText={text => setEmail(text)}
            value={email}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your username"
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
            onChangeText={text => setProfile({...profile, password: text})}
            style={styles.input}
            value={profile.password}
            textContentType="password"
            secureTextEntry={true}
          />
          <TextInput
            placeholder="Confirm your password"
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
            <Text>I have read and agreed to the </Text>
            <Text style={styles.termsAndConditionsBold}>
              Terms and Conditions{' '}
            </Text>
          </View>
          <View style={styles.termsAndConditionsContainer}>
            <Text> and </Text>
            <Text style={styles.termsAndConditionsBold}>Privacy Policy</Text>
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const verify = async (inputEmail: string = '', inputCode: string = '') => {
    // Making sure the inputEmail is from a W&M email domain
    let domain = inputEmail ? inputEmail.split('@')[1] : '';

    if (inputEmail && domain === 'wm.edu') {
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
        <Image
          style={styles.wmLogo}
          source={require('./media/wm_logo_green.png')}
        />
        <View style={styles.loginText}>
          <Text style={styles.header}>Verify your W&M email account</Text>
          <View style={styles.emailInput}>
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter your school email"
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
                  width: 100,
                  height: 30,
                  borderRadius: 10,
                  textAlign: 'center',
                  lineHeight: 30,
                }}>
                {code.codeSent ? 'Code Sent' : 'Send Code'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.emailInput}>
            <TextInput
              style={styles.inputSmall}
              placeholder="Please enter your verification code here"
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
                  width: 100,
                  height: 30,
                  borderRadius: 10,
                  textAlign: 'center',
                  lineHeight: 30,
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
  })

  const login = async () => {
    const data = {
      username: info.username,
      password: info.password,
    };
    if (data.username && data.password) {
      await axios
        .post('http://10.0.2.2:8000/users/login/', data)
        .then(response => {
          if (response.data.login) {
            if (response.data.register) {
              setLoginState({
                login: false,
                register: true,
                forgotPassword: false,
                verifyEmail: false,
              });
            } else {
              props.returnHome(info.username);
            }
          } else {
            setErrorMessage('Invalid Login Credentials.  Please try again.');
            setInfo({...info, password: ''});
          }
        })
        .catch((err: any) => console.log(err));
      setInfo({
        username: '',
        password: '',
      });
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
              source={require('./media/wm_logo_green.png')}
            />
            <View style={styles.loginText}>
              <Text style={styles.header}>
                Welcome to Market App at William and Mary
              </Text>
              <TextInput
                placeholder="Enter username"
                onChangeText={text => setInfo({...info, username: text})}
                value={info.username}
                style={styles.input}
              />
              <TextInput
                placeholder="Enter Password"
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
    rowGap: 20,
  },
  loginText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
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
  createAccountButton: {
    width: 250,
    height: 40,
    borderRadius: 15,
    backgroundColor: 'rgb(17, 87, 64)',
    textAlign: 'center',
    lineHeight: 40,
    color: Colors.white,
    margin: 10,
  },
  header: {
    fontSize: 20,
    width: 250,
    textAlign: 'center',
  },
  createAccount: {
    textDecorationLine: 'underline',
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
  },
  wmLogo: {
    width: 200,
    height: 200,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 150,
    height: 150,
    padding: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: Colors.black,
    overflow: 'hidden',
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
    rowGap: 0,
  },
  termsAndConditionsBold: {
    fontWeight: 'bold',
  },
  usernameWarning: {
    marginTop: 10,
    marginBottom: 30,
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
});

export default Login;
