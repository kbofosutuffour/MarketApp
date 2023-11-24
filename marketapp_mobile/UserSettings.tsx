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

function Profile(): JSX.Element {
  const options = ['Change Password', 'Edit Profile', 'Blocked Users', 'Help'];
  return (
    <View style={styles.userSettings}>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback>
            <View style={styles.settingsOptionContainer}>
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
  return (
    <View style={styles.userSettings}>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback>
            <View style={styles.settingsOptionContainer}>
              <Text style={styles.settingsOption}>{value}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

function Privacy(): JSX.Element {
  const options = ['Privacy Policy', 'Terms and Conditions'];
  return (
    <View style={styles.userSettings}>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback>
            <View style={styles.settingsOptionContainer}>
              <Text style={styles.settingsOption}>{value}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

function Support(): JSX.Element {
  const options = ['Violations', 'Help'];
  return (
    <View style={styles.userSettings}>
      {options.map(value => {
        return (
          <TouchableWithoutFeedback>
            <View style={styles.settingsOptionContainer}>
              <Text style={styles.settingsOption}>{value}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
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
  });

  const options = {
    Settings: {
      settings: true,
      profile: false,
      notifications: false,
      privacy: false,
      support: false,
      logout: false,
    },
    Profile: {
      settings: false,
      profile: true,
      notifications: false,
      privacy: false,
      support: false,
      logout: false,
    },
    Notifications: {
      settings: false,
      profile: false,
      notifications: true,
      privacy: false,
      support: false,
      logout: false,
    },
    Privacy: {
      settings: false,
      profile: false,
      notifications: false,
      privacy: true,
      support: false,
      logout: false,
    },
    Support: {
      settings: false,
      profile: false,
      notifications: false,
      privacy: false,
      support: true,
      logout: false,
    },
    'Log Out': {
      settings: false,
      profile: false,
      notifications: false,
      privacy: false,
      support: false,
      logout: true,
    },
  };

  return (
    <>
      {view.settings && (
        <View style={styles.userSettings}>
          {Object.keys(options).map(value => {
            return (
              value !== 'Settings' && (
                <>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setView(options[value]);
                      props.setSettingsTitle({
                        settings: true,
                        text: value,
                      });
                    }}>
                    <View style={styles.settingsOptionContainer}>
                      <Text style={styles.settingsOption}>{value}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </>
              )
            );
          })}
        </View>
      )}
      {view.profile && <Profile />}
      {view.notifications && <Notifications />}
      {view.privacy && <Privacy />}
      {view.support && <Support />}
    </>
  );
}

const styles = StyleSheet.create({
  userSettings: {
    backgroundColor: Colors.white,
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  settingsOptionContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 70,
    width: '85%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  settingsOption: {
    fontSize: 20,
  },
});

export default UserSettings;
