import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import 'core-js/stable/atob';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const [upcomingGames, setUpcomingGames] = useState([]);

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const userToken = await AsyncStorage.getItem('token');
      setToken(userToken);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  useEffect(() => {
    isLoggedIn();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{token, isLoading, setToken, userId, setUserId,upcomingGames,setUpcomingGames}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
