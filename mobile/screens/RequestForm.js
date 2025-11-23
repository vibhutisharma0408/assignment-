import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// Use environment variable or default to localhost
// For physical device testing, set EXPO_PUBLIC_API_URL in .env file
// Example: EXPO_PUBLIC_API_URL=http://192.168.1.8:5000
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// Log API URL for debugging
console.log('🔗 API URL:', API_URL);
console.log('📱 Using backend at:', API_URL);

export default function RequestForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setMessage({ text: 'Please enter your name', type: 'error' });
      return;
    }
    if (!phone.trim()) {
      setMessage({ text: 'Please enter your phone number', type: 'error' });
      return;
    }
    if (!title.trim()) {
      setMessage({ text: 'Please enter a request title', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const timestamp = new Date().toISOString();
      const imageUrl = imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : '';
      
      console.log('🔗 Submitting to:', `${API_URL}/request`);
      console.log('📱 API URL being used:', API_URL);
      
      const response = await axios.post(`${API_URL}/request`, {
        name: name.trim(),
        phone: phone.trim(),
        title: title.trim(),
        image: imageUrl,
        timestamp
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Success
      setMessage({ text: 'Request submitted successfully!', type: 'success' });
      
      // Reset form
      setName('');
      setPhone('');
      setTitle('');
      setImage(null);
      setImageBase64(null);

      Alert.alert('Success', 'Your request has been submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      let errorMsg = 'Submission failed. Please try again.';
      
      if (err.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout. Please check your connection and try again.';
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMsg = `Cannot connect to server at ${API_URL}. Make sure:\n1. Backend is running\n2. Phone and computer are on same WiFi\n3. Firewall allows connections`;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
        if (err.response.data.message) {
          errorMsg += ': ' + err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setMessage({ text: errorMsg, type: 'error' });
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request Anything, We Deliver in 2 Hours</Text>
        <Text style={styles.subtitle}>EDUZAP L LP</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.label}>Request Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Book, Pen"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Image (Optional)</Text>
        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.imageButtonText}>
            {image ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity 
              onPress={() => {
                setImage(null);
                setImageBase64(null);
              }}
              style={styles.removeImageButton}
            >
              <Text style={styles.removeImageText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {message.text ? (
          <View style={[styles.message, message.type === 'error' ? styles.errorMessage : styles.successMessage]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 15,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 6,
    paddingHorizontal: 15,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
});
