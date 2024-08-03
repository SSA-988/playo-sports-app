import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveRegistrationProgress = async (screenName, data) => {
  try {
    const key = `registration_progress_${screenName}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`Progress saved for screen : ${screenName}`);
  } catch (error) {
    console.log('Error saving the progress', error);
  }
};

export const getRegistrationProgress = async (screenName) => {
  try {
    const key = `registration_progress_${screenName}`;
    const data = await AsyncStorage.getItem(key);
    return data !== null ? JSON.parse(data) : null;
  } catch (error) {
    console.log('Error retrieving the progress', error);
  }
};
