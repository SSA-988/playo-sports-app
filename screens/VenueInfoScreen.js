import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import Amenities from '../components/Amenities';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const VenueInfoScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  console.log(route?.params);
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 35 : 0,
        }}>
        <ScrollView>
          <>
            <View>
              <Image
                style={{width: '100%', height: 200, resizeMode: 'cover'}}
                source={{uri: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800"}}
              />
            </View>
            <View style={{padding: 10}}>
              <Text style={{fontSize: 20, fontWeight: '600'}}>
                {route.params.name}
              </Text>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <Ionicons name="time-outline" size={24} color="black" />
                <Text style={{fontSize: 15, fontWeight: '500'}}>
                  {route.params.timings}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',

                  gap: 5,
                }}>
                <Ionicons name="ios-location-outline" size={24} color="black" />
                <Text style={{fontSize: 14, width: '80%', fontWeight: '500'}}>
                  {route.params.location}
                </Text>
              </View>
            </View>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  {[0, 0, 0, 0, 0].map((en, i) => (
                    <FontAwesome
                      // key={`${food.id}-${i}`}
                      style={{paddingHorizontal: 3}}
                      name={
                        i < Math.floor(route.params.rating) ? 'star' : 'star-o'
                      }
                      size={15}
                      color="#FFD700"
                    />
                  ))}
                  <Text>{route.params.rating} (9 ratings)</Text>
                </View>
                <Pressable
                  style={{
                    marginTop: 6,
                    width: 160,
                    borderColor: '#686868',
                    borderWidth: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text>Rate Venue</Text>
                </Pressable>
              </View>
              <View style={{}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{textAlign: 'center'}}>
                    100 total Activities{' '}
                  </Text>
                </View>
                <Pressable
                  style={{
                    marginTop: 6,
                    width: 160,
                    borderColor: '#686868',

                    borderWidth: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text>1 Upcoming</Text>
                </Pressable>
              </View>
            </View>
            <Text
              style={{fontSize: 15, marginHorizontal: 10, fontWeight: '500'}}>
              Sports Available
            </Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {route.params.sportsAvailable.map((item, index) => (
                <View
                  style={{
                    borderColor: '#686868',
                    margin: 10,
                    padding: 20,
                    width: 130,
                    height: 90,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}>
                  <MaterialCommunityIcons
                    style={{textAlign: 'center'}}
                    name={item.icon}
                    size={24}
                    color="gray"
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Amenities />

            <View style={{marginHorizontal: 10}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Activities</Text>
              <Pressable
                onPress={() =>
                    navigation.navigate("Create", {
                      area: route.params.name,
                    })
                  }
                style={{
                  borderColor: '#787878',
                  marginTop: 10,
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <AntDesign name="plus" size={24} color="black" />
                <Text>Create Activity</Text>
              </Pressable>
            </View>
          </>
        </ScrollView>
      </SafeAreaView>
      <Pressable
        onPress={() =>
          navigation.navigate('Slot', {
            place: route.params.name,
            sports: route.params.sportsAvailable,
            bookings:route?.params?.bookings
          })
        }
        style={{
          backgroundColor: 'green',
          padding: 8,
          marginBottom: 30,
          borderRadius: 3,
          marginHorizontal: 15,
        }}>
        <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
          Book Now
        </Text>
      </Pressable>
    </>
  );
};

export default VenueInfoScreen;

const styles = StyleSheet.create({});
