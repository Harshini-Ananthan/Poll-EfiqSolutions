import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    // The image itself has internal padding, so we use negative margins to align it properly with other header items
    marginLeft: -15,
    marginTop: -15,
    marginBottom: -15,
  },
  logo: {
    width: 200,
    height: 120,
  },
});
