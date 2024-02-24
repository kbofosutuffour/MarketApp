/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// AppRegistry.registerComponent('main', () => App);

console.log(Platform.OS)
if (Platform.OS === 'web') {
    AppRegistry.registerComponent('main', () => App);
    const rootTag = document.getElementById('root') || document.getElementById('X');
    AppRegistry.runApplication('main', { rootTag });
} else if (Platform.OS === 'android') {
    AppRegistry.registerComponent('main', () => App);
} else if (Platform.OS === 'ios') {
    AppRegistry.registerComponent('main', () => App);
}