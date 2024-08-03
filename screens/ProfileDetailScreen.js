import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileDetailScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();
  const {userId,token,setToken,setUserId} = useContext(AuthContext);
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);
  const fetchUser = async () => {
    try {
      console.log('mysysy', userId);
      const response = await axios.get(`http://localhost:8000/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const clearAuthToken = async () => {
    try{
      await AsyncStorage.removeItem("token");

      setToken("");

      setUserId("");

      navigation.replace("Start")
    } catch(error){
      console.log("Error",error)
    }
  }


  return (
    <View>
      <View
        style={{
          backgroundColor: 'white',
          padding: 12,
          margin: 12,
          borderRadius: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            //   alignItems: 'center',
            gap: 20,
          }}>
          <Pressable onPress={clearAuthToken} style={{}}>
            <Image
              style={{width: 70, height: 70, borderRadius: 35}}
              source={{uri: user?.user?.image}}
            />
            {/* <Text style={{textAlign:"center"}}>{user?.user?.firstName}</Text> */}
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 30,
              justifyContent: 'space-around',
              width:"80%"
            }}>
            <View>
              <Text style={{textAlign: 'center'}}>{user?.user?.noOfGames}</Text>
              <Text style={{color: 'gray', marginTop: 6, fontSize: 13}}>
                GAMES
              </Text>
            </View>

            <View>
              <Text style={{textAlign: 'center'}}>
                {user?.user?.playpals?.length}
              </Text>
              <Text style={{color: 'gray', marginTop: 6, fontSize: 13}}>
                PLAYPALS
              </Text>
            </View>

            <View>
              <Text style={{textAlign: 'center'}}>60</Text>
              <Text style={{color: 'gray', marginTop: 6, fontSize: 13}}>
                KARMA
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={{marginTop: 10,fontWeight:"500"}}>
            {user?.user?.firstName}
          </Text>
          <Text style={{color:"gray",marginTop:6}}>Last Played on 13th July</Text>
        </View>
      </View>


    </View>
  );
};

export default ProfileDetailScreen;

const styles = StyleSheet.create({});
