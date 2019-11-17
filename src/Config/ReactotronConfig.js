import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';

const tron = Reactotron.configure({ name: 'App', port: 10000 })
  .useReactNative({
    errors: true,
    editor: true,
    devTools: true,
    storybook: true,
    networking: true,
    asyncStorage: true,
  })
  .setAsyncStorageHandler(AsyncStorage)
  .connect();

console.tron = tron;

if (__DEV__) {
  console.tron.clear();
}
