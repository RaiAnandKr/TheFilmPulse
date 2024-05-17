import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { router } from 'expo-router';

type Profile = {
  full_name: string;
  email: string;
  phone_number: string;
};

function ProfileView() {

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/profile', { withCredentials: true })
      .then(response => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load profile');
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <Text style={styles.text}>Full Name: {profile.full_name}</Text>
          <Text style={styles.text}>Email: {profile.email}</Text>
          <Text style={styles.text}>Phone Number: {profile.phone_number}</Text>
          <Button
            title="Edit Profile"
            onPress={() => router.push({pathname: '/edit-profile'})}
          />
        </>
      ) : (
        <Text style={styles.text}>Failed to load profile</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProfileView;
