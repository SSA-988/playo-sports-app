import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Calendar from '../components/Calendar';
import moment from 'moment';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SlotScreen = () => {
  const today = moment().format('YYYY-MM-DD');
  const route = useRoute();
  const {place = {}, sports = []} = route.params || {};

  // console.log(today)
  const [selectedDate, setSelectedDate] = useState(today);
  const [bookingStatus, setBookingStatus] = useState(false);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState([]);

  //   const {paymentStatus, setPaymentStatus} = useContext(CartItems);
  //   console.log(paymentStatus);

  console.log(route.params);
  const [selectedSport, setselectedSport] = useState(
    route.params.sports[0].name,
  );
  const [duration, setDuration] = useState(60);
  const [price] = route.params.sports
    .filter(item => item.name === selectedSport)
    .map(item => item.price);
  // console.log(price);
  // console.log(route.params);
  const [timeOver, setTimeOver] = useState([]);

  const [checkedTimes, setCheckedTimes] = useState([]);

  const navigation = useNavigation();
  const timings = [
    {
      id: '0',
      time: '6:00am',
    },
    {
      id: '1',
      time: '7:00am',
    },
    {
      id: '2',
      time: '8:00am',
    },
    {
      id: '3',
      time: '9:00am',
    },
    {
      id: '4',
      time: '10:00am',
    },
    {
      id: '5',
      time: '11:00am',
    },

    {
      id: '6',
      time: '12:00pm',
    },
    {
      id: '7',
      time: '1:00pm',
    },
    {
      id: '8',
      time: '2:00pm',
    },
    {
      id: '9',
      time: '3:00pm',
    },
    {
      id: '10',
      time: '4:00pm',
    },
    {
      id: '11',
      time: '5:00pm',
    },
    {
      id: '12',
      time: '6:00pm',
    },
    {
      id: '123',
      time: '7:00pm',
    },
    {
      id: '14',
      time: '8:00pm',
    },
    {
      id: '15',
      time: '9:00pm',
    },
    {
      id: '15',
      time: '10:00pm',
    },
  ];
  const courts = route.params.sports.filter(
    item => item.name === selectedSport,
  );
  console.log(selectedSport);
  // console.log(courts);
  const d = moment().format('LT');
  const date = moment(d, 'DD/MM/YYYY');
  const now = moment().format('LT');
  var beginningTime = moment('8:45am', 'h:mma');
  var endTime = moment('9:00am', 'h:mma');
  // console.log(beginningTime.isAfter(endTime));
  // console.log(beginningTime.toDate());
  // console.log(endTime.toDate())

  // console.log("current time: " + currentTime)

  const currentTime = moment().format('h:mma');
  var beginningTime = moment(`${currentTime}`, 'h:mma');
  var endTime = moment(`12:00pm`, 'h:mma');
  // console.log(endTime);
  // console.log(beginningTime.isBefore(endTime));

  const checkTime = (current, time) => {
    console.log('current time funtion: ' + current);
    console.log('time: ' + time);
    var beginningTime = moment(`${current}`, 'h:mma');
    var endTime = moment(`${time}`, 'h:mma');

    setTimeOver(beginningTime.isAfter(endTime));
  };
  const [timess, setTimes] = useState([]);
  const [isOver, setIsOver] = useState(false);

  const generateTimes = () => {
    const start = moment(selectedDate).startOf('day').add(6, 'hours'); // start at 6:00 am
    const end = moment(selectedDate).endOf('day');
    const interval = 60; // interval in minutes

    const result = [];
    let current = moment(start);
    while (current <= end) {
      result.push(current.format('h:mma'));
      current.add(interval, 'minutes');
    }
    setTimes(result);
  };

  useEffect(() => {
    generateTimes();
  }, [selectedDate]);

  useEffect(() => {
    console.log('times thererer', timess);
    timess.map((item, index) => {
      const lastTime = moment(item, 'h:mm A');
      const currentTime = moment();

      const status = currentTime.isAfter(lastTime);

      timeOver.push(status);
    });
  }, [selectedDate]);

  var times = [];
  useEffect(() => {
    const checkTime = () => {
      const currentDateTime = moment(); // Current date and time
      const selectedDateStart = moment(selectedDate).startOf('day'); // Start of the selected date

      const times = timess.map(item => {
        // Combine the selected date with the current time slot to create a full date-time
        const dateTime = moment(selectedDateStart).set({
          hour: moment(item, 'h:mma').get('hour'),
          minute: moment(item, 'h:mma').get('minute'),
        });

        // Determine if the time slot is in the past or future
        const status = currentDateTime.isBefore(dateTime);
        return {time: item, status: status};
      });

      setCheckedTimes(times);
    };

    checkTime();
  }, [selectedDate, timess]);

  const todayy = new Date();

  useEffect(() => {
    if (route.params?.date) {
      const gameDate = route.params.date;
      console.log('gameDate:', gameDate);

      // Match the day and month from '29th July'
      const parts = gameDate.match(/(\d+)(st|nd|rd|th)?\s(\w+)/);
      if (parts) {
        const day = parseInt(parts[1], 10);
        const monthString = parts[3];
        console.log('day:', day, 'monthString:', monthString);

        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        const month = monthNames.indexOf(monthString);
        const year = todayy.getFullYear();

        if (!isNaN(day) && month !== -1) {
          // Create a new Date object
          const formattedDate = new Date(year, month, day);

          console.log('formattedDate:', formattedDate);
          if (formattedDate.toString() !== 'Invalid Date') {
            setSelectedDate(formattedDate);
          } else {
            console.error('Formatted date is invalid');
          }
        } else {
          console.error('Invalid day or month:', day, month);
        }
      } else {
        console.error('Date parsing failed:', gameDate);
      }
    }
  }, [route.params?.date]);

  // Format the selected date to "YYYY-MM-DD"
  console.log('dfdfdf', route?.params?.slot);

  const time = route?.params?.slot;

  const calculateEndTime = (startTime, duration) => {
    // Check if startTime is defined and is a string
    if (typeof startTime !== 'string') {
      console.error('Invalid startTime:', startTime);
      return;
    }
  
    console.log('Start time', startTime);

    const match = startTime.match(/(\d+:\d+)([APMapm]+)/);
    if (!match) {
      console.error('Invalid startTime format:', startTime);
      return;
    }
  
    const time = match[1]; // The time part (e.g., '6:00')
    const modifier = match[2].toUpperCase(); // The AM/PM part (e.g., 'PM')
  
    console.log('Start time', time);
    console.log('Modifier', modifier);
  
    // Parse the startTime
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
  
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  
    // Add duration to the time
    const totalMinutes = hours * 60 + minutes + duration;
    let endHours = Math.floor(totalMinutes / 60);
    let endMinutes = totalMinutes % 60;
  
    // Format the end time
    let endModifier = endHours >= 12 ? 'PM' : 'AM';
    if (endHours >= 24) {
      endHours -= 24;
      endModifier = 'AM';
    }
    if (endHours >= 12) {
      endModifier = 'PM';
      if (endHours > 12) endHours -= 12;
    }
    if (endHours === 0) {
      endHours = 12;
      endModifier = 'AM';
    }
  
    const formattedEndHours = endHours.toString().padStart(2, '0');
    const formattedEndMinutes = endMinutes.toString().padStart(2, '0');
  
    return `${formattedEndHours}:${formattedEndMinutes} ${endModifier}`;
  };
  


  const isSlotBooked = (time) => {
    return route?.params?.bookings.some((booking) => {
      // Check if the booking is on the selected date
      if (booking.date !== selectedDate) return false;
  
      // Extract the start and end times from the booking time range
      const [startTime, endTime] = booking.time.split(' - ');
  
      // Get the hour portion of the times to compare
      let chosenHour = parseInt(time.split(':')[0], 10);
      let startHour = parseInt(startTime.split(':')[0], 10);
      let endHour = parseInt(endTime.split(':')[0], 10);
  
      // Convert times to lowercase for consistent AM/PM checks
      const lowerStartTime = startTime.toLowerCase();
      const lowerEndTime = endTime.toLowerCase();
      const lowerChosenTime = time.toLowerCase();

      console.log("lower",lowerChosenTime)
      console.log("hihger",lowerEndTime)
  
      // Handle AM/PM for the start time
      if (lowerStartTime.includes('pm') && startHour < 12) startHour += 12;
      if (lowerStartTime.includes('am') && startHour === 12) startHour = 0;
  
      // Handle AM/PM for the end time
      if (lowerEndTime.includes('pm') && endHour < 12) endHour += 12;
      if (lowerEndTime.includes('am') && endHour === 12) endHour = 0;
  
      // Handle AM/PM for the chosen time
      if (lowerChosenTime.includes('pm') && chosenHour < 12) chosenHour += 12;
      if (lowerChosenTime.includes('am') && chosenHour === 12) chosenHour = 0;
  
      return chosenHour >= startHour && chosenHour < endHour;
    });
  };
  
  
  

  const convertTo24Hour = (time) => {
    const [hourMin, period] = time.toLowerCase().split(/(?<=\d)(?=[ap]m)/);
    let [hours, minutes] = hourMin.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10) || 0;

    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };

  const handleTimePress = (time) => {
    if (isSlotBooked(time)) {
      Alert.alert('Slot Already Booked', 'This time slot is already booked.');
    } else {
      setSelectedTime(time);
    }
  };
  


  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 35 : 0,
        }}>
        <ScrollView>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back-outline"
              size={25}
              color="black"
            />
            <Text style={{fontSize: 15, fontWeight: '500'}}>
              {route.params.place}
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{marginLeft: 'auto'}}
            showsHorizontalScrollIndicator={false}
            horizontal>
            {route.params.sports.map((item, index) => {
              // if (item.name === selectedSport) {
              //  showCalender
              // }
              return (
                <View>
                  {selectedSport.includes(item.name) ? (
                    <Pressable
                      style={{
                        borderColor: 'green',
                        margin: 10,
                        padding: 20,
                        width: 80,
                        height: 90,
                        borderWidth: 3,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons
                        style={{textAlign: 'center'}}
                        name={item.icon}
                        size={24}
                        color="gray"
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          width: 80,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        {item.name}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        setselectedSport(item.name);
                        setSelectedCourt([]);
                      }}
                      style={{
                        borderColor: '#686868',
                        margin: 10,
                        padding: 20,
                        width: 80,
                        height: 90,
                        borderWidth: 1,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <MaterialCommunityIcons
                        style={{textAlign: 'center'}}
                        name={item.icon}
                        size={24}
                        color="gray"
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          width: 80,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        {item.name}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {selectedSport && (
            <ScrollView>
              <Calendar
                selectedSport={selectedSport}
                onSelectDate={setSelectedDate}
                setSelectedTime={setSelectedTime}
                selected={selectedDate}
              />
            </ScrollView>
          )}

          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              width: '100%',
              margin: 10,
            }}>
            <Pressable
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 1,
                paddingVertical: 15,
                paddingHorizontal: 60,

                flex: 1,
              }}>
              <Text
                style={{fontSize: 13, fontWeight: '400', textAlign: 'center'}}>
                TIME
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                {/* 06:30 AM */}
                {route?.params?.startTime
                  ? route?.params?.startTime
                  : selectedTime.length > 0
                  ? selectedTime
                  : 'Choose Time'}
              </Text>
            </Pressable>
            <Pressable
              style={{
                borderColor: '#E0E0E0',
                borderWidth: 1,
                paddingVertical: 15,
                paddingHorizontal: 60,

                flex: 1,
                marginRight: 20,
              }}>
              <Text
                style={{fontSize: 13, fontWeight: '400', textAlign: 'center'}}>
                TIME
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                {/* 06:30 AM */}
                {route?.params?.endTime
                  ? route.params.endTime
                  :  selectedTime.length > 0
                  ? calculateEndTime(selectedTime, duration)
                  : 'Choose Time'}
              </Text>
            </Pressable>
          </Pressable>

          <Text
            style={{
              textAlign: 'center',

              fontSize: 16,
              fontWeight: '500',
            }}>
            Duration
          </Text>

          <Pressable
            style={{
              gap: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Pressable
              onPress={() => setDuration(Math.max(60, duration - 60))}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: 'gray',
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{textAlign: 'center', fontSize: 15, fontWeight: '600'}}>
                -
              </Text>
            </Pressable>
            <Text
              style={{textAlign: 'center', fontSize: 16, fontWeight: '500'}}>
              {duration} min
            </Text>
            <Pressable
              onPress={() => setDuration(duration + 60)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                borderColor: 'gray',
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{textAlign: 'center', fontSize: 15, fontWeight: '600'}}>
                +
              </Text>
            </Pressable>
          </Pressable>

          <Text
            style={{
              textAlign: 'center',
              marginVertical: 10,
              fontSize: 16,
              fontWeight: '500',
            }}>
            Select Slot
          </Text>

          {selectedSport && (
            <ScrollView
              horizontal
              contentContainerStyle={{marginHorizontal: 10}}
              showsHorizontalScrollIndicator={false}>
              {checkedTimes?.map((item, index) => {
                  const disabled = isSlotBooked(item.time);

                  console.log("disables",disabled)
                return (
                  <View>
                    {selectedTime.includes(item.time) ? (
                      <Pressable
                        disabled={item.status === false || disabled}
                        onPress={() => {
                          console.log("holaa",item?.time)
                          setSelectedTime(item.time);
                        }}
                        style={{
                          margin: 10,
                          borderColor: '#1CAC78',
                          backgroundColor: '#29AB87',
                          borderRadius: 5,
                          borderWidth: 1,
                          padding: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'white',
                          }}>
                          {item.time}
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable

                        disabled={item.status === false}
                        onPress={() => handleTimePress(item.time)}
                        // onPress={() => setSelectedTime(item.time)}
                        style={{
                          margin: 10,
                          borderColor:
                            item.status === false || disabled ? 'gray' : '#1CAC78',
                          borderRadius: 5,
                          borderWidth: 1,
                          padding: 10,
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          {item.time}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}

          <View style={{marginHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                // justifyContent:"center",
                flexWrap: 'wrap',
              }}>
              {courts.map(item =>
                item.courts.map(court =>
                  selectedCourt.includes(court.name) ? (
                    <Pressable
                      onPress={() => setSelectedCourt(court.name)}
                      style={{
                        backgroundColor: '#00A86B',
                        borderRadius: 6,
                        padding: 15,

                        width: 180,
                        margin: 10,
                      }}>
                      <Text style={{textAlign: 'center', color: 'white'}}>
                        {court.name}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => setSelectedCourt(court.name)}
                      style={{
                        borderColor: '#00A86B',
                        borderRadius: 6,
                        padding: 15,
                        borderWidth: 1,
                        width: 180,
                        margin: 10,
                      }}>
                      <Text style={{textAlign: 'center', color: '#00A86B'}}>
                        {court.name}
                      </Text>
                    </Pressable>
                  ),
                ),
              )}
            </View>
          </View>
          {selectedCourt.length > 0 && (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20,
                fontSize: 15,
                fontWeight: '500',
              }}>
              Court Price : Rs {price}
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
      <Pressable
        onPress={() =>
          navigation.navigate('Payment', {
            selectedCourt: selectedCourt,
            selectedSport: selectedSport,
            price: price,
            selectedTime: time,
            selectedDate: selectedDate,
            place: route.params.place,
            gameId: route?.params?.gameId,
          })
        }
        style={{
          backgroundColor: '#32CD32',
          padding: 15,
          marginBottom: 30,
          borderRadius: 3,
          marginHorizontal: 15,
        }}>
        <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
          Next
        </Text>
      </Pressable>
    </>
  );
};

export default SlotScreen;

const styles = StyleSheet.create({});
