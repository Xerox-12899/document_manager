import { View, Text, Platform, PermissionsAndroid, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions, Image } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { CameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse } from 'react-native-image-picker';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { email } = route.params || {};
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Check permissions when component mounts
    checkPermissionsAndGetPhotos();
  }); // Empty dependency array ensures this runs only once

  const checkPermissionsAndGetPhotos = async () => {
    const galleryPermissionGranted = await hasPhotoPermission();
    const cameraPermissionGranted = await hasCameraAccess();
    setHasGalleryPermission(galleryPermissionGranted);
    setHasCameraPermission(cameraPermissionGranted);
    if (galleryPermissionGranted) {
      getPhotos();
    }
  };

  const hasPhotoPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      // Android permission handling for gallery
      const permissions = Platform.Version >= 33
        ? [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
        : [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];

      for (const permission of permissions) {
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
          return true;
        }

        const status = await PermissionsAndroid.request(permission, {
          title: 'Photo Gallery Permission',
          message: 'This app needs access to your photo gallery to display your photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (status !== 'granted') {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  const hasCameraAccess = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

      const hasPermission = await PermissionsAndroid.check(permission);

      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(permission, {
        title: 'Camera Permission',
        message: 'This app needs access to your camera to take photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      return status === 'granted';
    }
    return false;
  };

  const getPhotos = () => {
    CameraRoll.getPhotos({
      first: 50, // Increased the number to show more photos
      assetType: 'Photos',
      include: ['filename', 'imageSize', 'playableDuration'],
    })
    .then(r => {
      console.log('Photos loaded successfully:', r.edges.length);
      setPhotos(r.edges);
    })
    .catch(err => {
      console.error('Error loading photos:', err);
      Alert.alert('Error', `Could not load photos: ${err.message}`);
    });
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const takePicture = () => {
    if (!hasCameraPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to take photos',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: async () => {
            const granted = await hasCameraAccess();
            setHasCameraPermission(granted);
          }},
        ]
      );
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log('Photo taken successfully');
        // Refresh photo gallery to include the new photo
        getPhotos();
        // Scroll to top to show the newly taken photo
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }
    });
  };

  const openGallery = () => {
    if (!hasGalleryPermission) {
      Alert.alert(
        'Gallery Permission Required',
        'Please grant gallery permission to access photos',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: async () => {
            const granted = await hasPhotoPermission();
            setHasGalleryPermission(granted);
            if (granted) {
              getPhotos();
            }
          }},
        ]
      );
      return;
    }

    launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image selection');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // You can handle the selected image here if needed
        console.log('Selected image: ', response.assets[0].uri);
      }
    });
  };

  const renderItem = ({ item }: { item: PhotoIdentifier }) => (
    <TouchableOpacity
      style={styles.items1}
      onPress={() => {
        Alert.alert(
          'Image Details',
          `Filename: ${item.node.image.filename || 'Unknown'}\nSize: ${
            item.node.image.width || 0} x ${item.node.image.height || 0
          }`
        );
      }}
    >
      <Image
        source={{ uri: item.node.image.uri }}
        style={styles.imageStyle}
        resizeMode="cover"
        onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* User welcome header */}
      {email && (
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome, {email}</Text>
        </View>
      )}

      {/* Permission status indicator */}
      {!hasGalleryPermission && (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Photo gallery permission is required to display photos.
          </Text>
          <TouchableOpacity
            onPress={async () => {
              const granted = await hasPhotoPermission();
              setHasGalleryPermission(granted);
              if (granted) {
                getPhotos();
              }
            }}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Gallery view */}
      <View style={styles.Align}>
        {photos.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={photos}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(_item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.emptyText}>
            {hasGalleryPermission ? 'No photos to display' : 'Grant permission to view photos'}
          </Text>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={getPhotos}
          disabled={!hasGalleryPermission}
        >
          <LinearGradient
            colors={['#000', '#333', '#000']}
            style={[styles.gradient, !hasGalleryPermission && styles.disabledButton]}
          >
            <Text style={styles.buttonText}>Refresh Photos</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={takePicture}
        >
        <TouchableOpacity
          style={styles.button}
          onPress={openGallery}
        />
          <LinearGradient
            colors={['#3498db', '#2980b9', '#3498db']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={['#e74c3c', '#c0392b', '#e74c3c']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  Align: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  items1: {
    width: Dimensions.get('window').width / 2 - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eee',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 100, // Space for buttons
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  button: {
    width: '30%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  permissionContainer: {
    padding: 20,
    backgroundColor: '#fff8e1',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  permissionText: {
    color: '#FF8F00',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#FF8F00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
