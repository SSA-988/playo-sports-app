import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Venue = ({item, onSelectVenue}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        onSelectVenue(item?.name);
        navigation.goBack();
      }}
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
              uri: 'https://playo.gumlet.io/PANCHAJANYABADMINTONFITNESSACADEMY/panchajanyabadmintonfitnessacademy1597334767773.jpeg?mode=crop&crop=smart&h=200&width=450&q=40&format=webp',
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
  );
};

export default Venue;

const styles = StyleSheet.create({});
