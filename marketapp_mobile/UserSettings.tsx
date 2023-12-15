import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function Profile(props): JSX.Element {
  const options = [
    'Change Password',
    'Edit Profile',
    'History',
    'Blocked Users',
  ];
  return (
    <View style={styles.userSettings}>
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
            Member Since January 1st, 1990
          </Text>
        </View>
      </View>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback>
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

function Notifications(): JSX.Element {
  const options = ['New Messages', 'Liked Post Updates'];
  const [newMessages, setNewMessages] = useState(true);
  const [likedPostUpdates, setLikedPostUpdates] = useState(true);

  return (
    <View style={styles.userSettings}>
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
            <TouchableWithoutFeedback onPress={() => setNewMessages(true)}>
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
            <TouchableWithoutFeedback onPress={() => setNewMessages(false)}>
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
            <TouchableWithoutFeedback onPress={() => setLikedPostUpdates(true)}>
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
            <TouchableWithoutFeedback
              onPress={() => setLikedPostUpdates(false)}>
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

function Privacy(): JSX.Element {
  return (
    <View style={styles.userSettings}>
      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>Liked Post Updates</Text>
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

function Support(props): JSX.Element {
  var options = ['Violations', 'Help'];
  return (
    <View style={styles.userSettings}>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback
            onPress={() =>
              props.setView({
                settings: false,
                profile: false,
                notifications: false,
                privacy: false,
                support: false,
                logout: false,
                violations: true,
              })
            }>
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

function Violations(props): JSX.Element {
  const [settings, setSettings] = useState({
    scamming: false,
    harassment: false,
    illegal_goods: false,
  });
  return (
    <View style={styles.userSettings}>
      <View style={styles.notificationSettingsContainer}>
        <View style={styles.notificationHeader}>
          <Text style={styles.settingsOption}>Violations</Text>
        </View>
        <View style={styles.toggleContainer}>
          <View style={styles.violationsToggle}>
            <View>
              <Text style={{width: 100}}>Scamming</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() =>
                setSettings({...settings, scamming: !settings.scamming})
              }>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: settings.scamming
                    ? 'rgb(17, 87, 64)'
                    : '#D7D7D7',
                  color: settings.scamming ? Colors.white : Colors.black,
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
          <View style={styles.violationsToggle}>
            <View>
              <Text style={{width: 100}}>Harassment</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() =>
                setSettings({...settings, harassment: !settings.harassment})
              }>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: settings.harassment
                    ? 'rgb(17, 87, 64)'
                    : '#D7D7D7',
                  color: settings.harassment ? Colors.white : Colors.black,
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
          <View style={styles.violationsToggle}>
            <View>
              <Text style={{width: 100}}>Illegal Goods</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() =>
                setSettings({
                  ...settings,
                  illegal_goods: !settings.illegal_goods,
                })
              }>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: settings.illegal_goods
                    ? 'rgb(17, 87, 64)'
                    : '#D7D7D7',
                  color: settings.illegal_goods ? Colors.white : Colors.black,
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
        </View>
      </View>
    </View>
  );
}

function UserSettings(props): JSX.Element {
  useEffect(() => {
    props.setSettingsTitle({
      settings: true,
      text: 'Settings',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState({
    settings: true,
    profile: false,
    notifications: false,
    privacy: false,
    support: false,
    logout: false,
    violations: false,
  });

  const options = {
    Settings: {
      settings: true,
      profile: false,
      notifications: false,
      privacy: false,
      support: false,
      violations: false,
      logout: false,
    },
    Profile: {
      settings: false,
      profile: true,
      notifications: false,
      privacy: false,
      support: false,
      violations: false,
      logout: false,
    },
    Notifications: {
      settings: false,
      profile: false,
      notifications: true,
      privacy: false,
      support: false,
      violations: false,
      logout: false,
    },
    Privacy: {
      settings: false,
      profile: false,
      notifications: false,
      privacy: true,
      support: false,
      violations: false,
      logout: false,
    },
    Support: {
      settings: false,
      profile: false,
      notifications: false,
      privacy: false,
      support: true,
      violations: false,
      logout: false,
    },
    Violations: {
      settings: false,
      profile: false,
      notifications: false,
      privacy: false,
      support: true,
      logout: false,
      violations: true,
    },
    'Log Out': {
      settings: false,
      profile: false,
      notifications: false,
      privacy: false,
      support: false,
      violations: false,
      logout: true,
    },
  };

  return (
    <>
      {view.settings && (
        <View style={styles.userSettings}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={{
                uri: 'http://10.0.2.2:8000' + props.profile.profile_picture,
              }}
              style={styles.profilePictureBorder}
            />
          </View>
          {Object.keys(options).map(value => {
            return (
              value !== 'Settings' &&
              value !== 'Violations' &&
              value !== 'Log Out' && (
                <>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setView(options[value]);
                      props.setSettingsTitle({
                        settings: true,
                        text: value,
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
          <TouchableWithoutFeedback>
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
      {view.profile && <Profile profile={props.profile} />}
      {view.notifications && <Notifications />}
      {view.privacy && <Privacy />}
      {view.support && <Support setView={setView} />}
      {view.violations && <Violations />}
    </>
  );
}

const styles = StyleSheet.create({
  profilePictureContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    width: 125,
    height: 125,
    borderRadius: 75,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  profileDescription: {
    display: 'flex',
    width: '80%',
    height: 125,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    columnGap: 10,
  },
  profilePictureBorder: {
    width: 125,
    height: 125,
    borderRadius: 75,
    borderColor: Colors.black,
  },
  userSettings: {
    backgroundColor: '#f6f7f5',
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  settingsOptionContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 50,
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
    height: 50,
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
    height: 50,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  settingsOptionSendFeedback: {
    borderRadius: 20,
    height: 50,
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
    height: 50,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingLeft: 10,
    marginTop: 80,
  },
  notificationSettingsContainer: {
    backgroundColor: Colors.white,
    borderColor: 'gray',
    borderRadius: 20,
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 30,
    paddingBottom: 10,
  },
  notificationHeader: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 50,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 10,
  },
  settingsOption: {
    fontSize: 20,
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
});

export default UserSettings;
