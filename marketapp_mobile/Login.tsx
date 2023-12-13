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

  const verify = async (inputEmail = null, inputCode = null) => {
    if (inputEmail) {
      setNewPassword({...newPassword, email: inputEmail})
      await axios
        .post('http://10.0.2.2:8000/users/verify/', {email: email})
        .then(response => {
          setCode({
            code: response.data.code,
            codeSent: true,
          });
        })
        .catch((err: any) => console.log(err));
    } else if (inputCode === code.code && code.code.length) {
      setPasswordState({
        sendCode: false,
        createPassword: true,
      });
    }
  };

  const changePassword = async () => {
    if (
      newPassword.password == newPassword.confirm &&
      newPassword.password.length >= 8
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
    } else {
      console.log('Insufficient password');
      console.log(newPassword.password, newPassword.confirm)
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
                        ? 'green'
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
                  style={styles.inputSmall}
                />
                <TouchableWithoutFeedback>
                  <Text
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      width: 90,
                      height: 35,
                      borderRadius: 15,
                      backgroundColor: 'rgb(176,211,229)',
                      color: 'black',
                      textAlign: 'center',
                      lineHeight: 35,
                    }}>
                    {'Verify Code'}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback>
                <Text style={styles.forgotPassword}>Resend Code</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                // eslint-disable-next-line react-native/no-inline-styles
                onPress={() => verify(null, inputCode)}>
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
    let finished =
      profile.password === confirmPassword &&
      profile.password.length >= 8 &&
      profile.username.length > 0 &&
      Object.keys(profile.profile_picture).length;

    if (finished) {
      for (const [key, value] of Object.entries(profile)) {
        data.append(key, value);
      }
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
      .catch((err: any) => console.log(err));

    await axios
      .post('http://10.0.2.2:8000/profiles/', data)
      .then(response => {
        console.log(response);
        props.returnHome(profile.username);
      })
      .catch((err: any) => console.log(err));
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
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your last name"
            onChangeText={text => setProfile({...profile, last_name: text})}
            style={styles.input}
          />
          <TextInput
            placeholder="Re-enter your email address"
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter your username"
            onChangeText={text => setProfile({...profile, username: text})}
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
            textContentType="password"
            secureTextEntry={true}
          />
          <TextInput
            placeholder="Confirm your password"
            onChangeText={text => setConfirmPassword(text)}
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
  const [input, setInput] = useState('');

  const verify = async (inputEmail = null, inputCode = null) => {
    if (inputEmail) {
      await axios
        .post('http://10.0.2.2:8000/users/verify/', {email: email})
        .then(response => {
          setCode({
            code: response.data.code,
            codeSent: true,
          });
        })
        .catch((err: any) => console.log(err));
    } else if (inputCode === code.code && code.code.length) {
      props.setLoginState({
        login: false,
        register: true,
        forgotPassword: false,
        verifyEmail: false,
      });
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
              onChangeText={text => setInput(text)}
            />
            <TouchableWithoutFeedback>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: 'rgb(176,211,229)',
                  width: 100,
                  height: 30,
                  borderRadius: 10,
                  textAlign: 'center',
                  lineHeight: 30,
                }}
                onPress={() => verify(null, input)}>
                Verify
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={() => verify(null, input)}>
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

  const verifyUser = (username, password) => {
    /* Django get request */
    let request = true;
    if (request) {
      props.returnHome();
    } else {
      //raise error message
    }
  };

  const login = async () => {
    const data = {
      username: info.username,
      password: info.password,
    };
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
        }
      })
      .catch((err: any) => console.log(err));
    setInfo({
      username: '',
      password: '',
    });
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
                style={styles.input}
              />
              <TextInput
                placeholder="Enter Password"
                onChangeText={text => setInfo({...info, password: text})}
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
          verifyUser={verifyUser}
          setInfo={setInfo}
          info={info}
          returnHome={props.returnHome}
        />
      )}
      {loginState.forgotPassword && (
        <ForgotPassword setLoginState={setLoginState} />
      )}
      {loginState.verifyEmail && <Verify setLoginState={setLoginState} />}
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
});

export default Login;
