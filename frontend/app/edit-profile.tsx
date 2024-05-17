import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { router } from 'expo-router';
import Profile from "@/app/(tabs)/profile";

type Profile = {
  full_name: string;
  email: string;
  phone_number: string;
};


function ProfileEdit() {

  const sample = {full_name:'', email:'', phone_number:''};

  const [profile, setProfile] = useState<Profile>(sample);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number);


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

  // setFullName(profile.full_name);
  // setEmail(profile.email);
  // setPhoneNumber(profile.phone_number);

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const cookie = parts.pop();
    console.log(cookie)
    if (cookie == undefined) {
      return ''
    }
    if (parts.length === 2) return cookie.split(';').shift();
    return cookie
  }

  const handleSave = () => {
    let config = {
      headers: {
        'X-CSRF-TOKEN': getCookie('csrf_access_token')
      },
      withCredentials: true,
    }
    console.log(config);
    axios.put('http://localhost:5000/profile', {
      full_name: fullName,
      email: email,
      phone_number: phoneNumber,
    }, config )
      .then(response => {
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Failed to update profile');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Save"
        onPress={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ProfileEdit;
