import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { RouteProp } from '@react-navigation/native';
import { SERVER_URL } from './ImageUploader'; // Import SERVER_URL from ImageUploader

type SavedImagesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SavedImageScreen'>;
  route: RouteProp<RootStackParamList, 'SavedImageScreen'>;
};

const SavedImagesScreen = ({ navigation }: SavedImagesScreenProps) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
    // Set up a focus listener to refresh images when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchImages();
    });

    // Clean up the listener on unmount
    return unsubscribe;
  }, [navigation]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/images`);
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      Alert.alert('Error', 'Could not load images');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (filename: string) => {
    const url = `${SERVER_URL}/uploads/${filename}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open image URL:', error);
      Alert.alert('Download Failed', 'Unable to open image URL.');
    }
  };

  const deleteImage = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${SERVER_URL}/images/${id}`);
            fetchImages(); // Refresh list
          } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Error', 'Failed to delete image');
          }
        },
      },
    ]);
  };

  const viewImageDetails = (item: any) => {
    // You could navigate to a detail screen here
    Alert.alert('Image Details',
      `ID: ${item._id}\n` +
      `Filename: ${item.filename}\n` +
      `Type: ${item.is_document ? 'Document' : 'Image'}\n` +
      `Upload Date: ${new Date(item.upload_date).toLocaleString()}`
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={styles.imageItem}
      onPress={() => viewImageDetails(item)}
    >
      <Text style={styles.imageName}>{index + 1}. {item.filename}</Text>
      <Text style={styles.subtext}>
        {item.is_document ? 'Document' : 'Image'} | {new Date(item.upload_date).toLocaleString()}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => downloadImage(item.filename)} style={styles.button}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteImage(item._id)} style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Stored Images</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchImages}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          {images.length > 0 ? (
            <FlatList
              data={images}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
            />
          ) : (
            <Text style={styles.noImagesText}>No images found</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#B22222',
  },
  buttonText: {
    color: 'white',
  },
  refreshButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noImagesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default SavedImagesScreen;
