import { View, Button, TextInput, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {useState} from "react";
import axios from 'axios';

export default function Modal() {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();

  const expoRouter = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/request-otp', { phone_number: phoneNumber }, { withCredentials: true });
      if (response.data.message) {
        console.log(response.data.message);
        setOtpSent(true);
        setError('');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again later.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { phone_number: phoneNumber, otp: verificationCode }, { withCredentials: true });
      expoRouter.replace('/')
      if (response.data.message) {
        setError('');
        expoRouter.replace('/')
      } else {
        setError('Invalid OTP. Please check the code.');
      }
    } catch (err) {
      setError('Verification failed. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {!otpSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Send OTP" onPress={sendOtp} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <Button title="Verify OTP" onPress={verifyOtp} />
        </>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
  },
});
