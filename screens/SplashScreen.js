import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#52cc4b',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Image
          style={{width: 110, height: 60, resizeMode: 'contain'}}
          source={{
            uri: 'https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
