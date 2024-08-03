import {Pressable, StyleSheet, Text, View, Button} from 'react-native';
import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SelectTimeScreen = () => {
  const [time, setTime] = useState('');
  const times = [
    {
      id: '0',
      type: 'morning',
      timings: '12 am - 9 am',
      icon: <Ionicons name="md-partly-sunny-outline" size={24} color="black" />,
    },
    {
      id: '1',
      type: 'Day',
      timings: '9 am - 4 pm',
      icon: <Feather name="sun" size={24} color="black" />,
    },
    {
      id: '2',
      type: 'evening',
      timings: '4pm - 9 pm',
      icon: <Feather name="sunset" size={24} color="black" />,
    },
    {
      id: '3',
      type: 'night',
      timings: '9pm am - 11 pm',
      icon: <Ionicons name="cloudy-night-outline" size={24} color="black" />,
    },
  ];
  const selectTime = item => {
    setTime(item);
    navigation.goBack();
  };
  useEffect(() => {
    console.log(startTime);
    console.log(endTime);
    if (startTime && endTime) {
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);
      const timeInterval = `${formattedStartTime} - ${formattedEndTime}`;
      navigation.goBack({timeInterval});
    }
  }, [startTime, endTime, navigation]);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Select Suitable Time',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    });
  }, []);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);

    
  };

  const handleConfirmStartTime = time => {
    setStartTime(time);
    hideStartTimePicker();
  };

  const handleConfirmEndTime = time => {
    setEndTime(time);
    hideEndTimePicker();

    if (startTime) {
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(time);
        const timeInterval = `${formattedStartTime} - ${formattedEndTime}`;
        navigation.navigate('Create', { timeInterval });
      }
  };

  const formatTime = time => {
    if (!time) return 'Select Time';
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  
  return (
    <View>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        {times.map((item, index) => (
          <Pressable
            onPress={() => selectTime(item.type)}
            style={{
              backgroundColor: 'white',
              margin: 20,
              width: 160,
              height: 120,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 15,
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}>
            {item.icon}

            <Text>{item.type}</Text>

            <Text>{item.timings}</Text>
          </Pressable>
        ))}
      </Pressable>

      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={styles.label}>Start Time:</Text>
          <Button title={formatTime(startTime)} onPress={showStartTimePicker} />
          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmStartTime}
            onCancel={hideStartTimePicker}
            is24Hour={false}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.label}>End Time:</Text>
          <Button title={formatTime(endTime)} onPress={showEndTimePicker} />
          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmEndTime}
            onCancel={hideEndTimePicker}
            is24Hour={false}
          />
        </View>
        {startTime && endTime && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Selected Interval: {formatTime(startTime)} - {formatTime(endTime)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SelectTimeScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  timeContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  summaryContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
