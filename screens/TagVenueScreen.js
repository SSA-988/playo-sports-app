import {StyleSheet, Text, View, SafeAreaView, FlatList, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Venue from '../components/Venue';
import {useNavigation} from '@react-navigation/native';

const TagVenueScreen = () => {
  const [venues, setVenues] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://localhost:8000/venues');
        setVenues(response.data);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      }
    };

    fetchVenues();
  }, []);

  console.log('venues', venues);

  const [taggedVenue, setTaggedVenue] = useState(null);

  useEffect(() => {
    if (taggedVenue) {
      console.log("taggedVenue")
      navigation.goBack({taggedVenue});
    }
  }, [taggedVenue, navigation]);

  const handleSelectVenue = (venue) => {
    navigation.navigate('Create', { taggedVenue: venue });
  };
  

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 10,
          backgroundColor: '#294461',
          paddingBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Ionicons name="arrow-back" size={24} color="white" />

          <Text style={{fontSize: 15, fontWeight: '500', color: 'white'}}>
            Tag Venue
          </Text>
        </View>
      </View>

      <FlatList
        data={venues}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <Pressable
          onPress={() => handleSelectVenue(item?.name)}
          style={{
            padding: 10,
            marginVertical: 10,
            borderColor: '#e0e0e0',
            borderWidth: 1,
            marginHorizontal: 10,
          }}>
          <View>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Image
                style={{
                  width: 90,
                  height: 90,
                  resizeMode: 'cover',
                  borderRadius: 7,
                }}
                source={{
                  uri: item?.image,
                }}
              />
    
              <View style={{flex: 1}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{fontSize: 15, fontWeight: '500', width: '100%'}}>
                  {item?.name}
                </Text>
    
                <Text style={{marginTop: 5, color: 'gray'}}>Near Manyata park</Text>
    
                <Text style={{marginTop: 8, fontWeight: '500'}}>
                  4.4 (122 ratings)
                </Text>
              </View>
    
              <Ionicons name="shield-checkmark-sharp" size={24} color="green" />
            </View>
    
            <View>
              <Text style={{textAlign: 'center', color: 'gray'}}>BOOKABLE</Text>
            </View>
          </View>
        </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default TagVenueScreen;

const styles = StyleSheet.create({});
