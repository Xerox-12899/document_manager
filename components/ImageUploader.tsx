// ImageUploader.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamList } from '../App';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Define proper prop types
type ImageUploaderProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'imageUploader'>;
  route: RouteProp<RootStackParamList, 'imageUploader'>;
};

// Define the server URL in a constants file and import it in both components
export const SERVER_URL = 'http://192.168.82.155:5000';

const ImageUploader = ({ navigation }: ImageUploaderProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (result) => {
      if (result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri!;
        setImageUri(uri);
        setResponse(null);
      }
    });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      return;
    }

    setLoading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const res = await axios.post(`${SERVER_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Upload Failed', 'Could not upload the image.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSavedImages = () => {
    navigation.navigate('SavedImageScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Image Upload & Classification</Text>

      <View style={styles.uploadSection}>
        <Button title="Choose Image" onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {imageUri && <Button title="Upload Image" onPress={uploadImage} />}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>

      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Server Response:</Text>
          <Text>Filename: {response.filename}</Text>
          <Text>Is Document: {response.is_document ? 'Yes' : 'No'}</Text>
          <Text>MongoDB ID: {response.mongodb_id}</Text>

          {response.document_name && <Text>Document Name: {response.document_name}</Text>}
          {response.extracted_text && (
            <>
              <Text style={styles.subHeader}>Extracted Text:</Text>
              <Text>{response.extracted_text}</Text>
            </>
          )}
          {response.classification && (
            <>
              <Text style={styles.subHeader}>Classification:</Text>
              <Text>Label: {response.classification.label}</Text>
              <Text>Probability: {response.classification.confidence.toFixed(2)}</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="View All Saved Images"
          onPress={navigateToSavedImages}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 280,
    height: 280,
    marginVertical: 15,
    borderRadius: 10,
  },
  responseContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
  responseTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  subHeader: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ImageUploader;
