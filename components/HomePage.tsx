import { View, Text, Platform, PermissionsAndroid, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import Icon from '@react-native-vector-icons/ionicons';

const HomeScreen = () => {
    const [photos, setPhotos ] = useState<PhotoIdentifier[]>([]);

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES || PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title:'Access to gallery',
                    message:'App needs access to your gallery ',
                    buttonNegative:'Cancel',
                    buttonPositive:'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const loadPhotos = async () => {
        const hasPermission = await requestPermission();
        if(!hasPermission){
            return;
        }
        const res = await CameraRoll.getPhotos({ first: 10, assetType: 'Photos'});
        setPhotos(res.edges);
    };

    useEffect(() =>{
        loadPhotos();
    });

    const renderImage = ({ item }: { item: PhotoIdentifier }) => (
        <View style={styles.imageCard}>
            <Image source= {{ uri : item.node.image.uri }} style={styles.image} />
        </View>
    );
    return (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="person-circle-outline" size={24} />
            <View style={styles.headerIcons}>
              <Icon name="notifications-outline" size={24} style={styles.iconSpacing} />
              <Icon name="settings-outline" size={24} />
            </View>
          </View>
          {/* Title */}
          <Text style={styles.title}>Title</Text>
          {/* FlatList for gallery */}
          <FlatList
            data={photos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImage}
            style={styles.galleryList}
          />
          {/* Bottom Tabs */}
          <View style={styles.bottomTabs}>
            <TouchableOpacity style={styles.tabItemActive}>
              <Icon name="star" size={16} color="black" />
              <Text>Label</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <Icon name="star-outline" size={16} />
              <Text>Label</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <Icon name="star-outline" size={16} />
              <Text>Label</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingTop: 40,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      headerIcons: {
        flexDirection: 'row',
      },
      iconSpacing: {
        marginRight: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
      },
      galleryList: {
        flex: 1,
        marginBottom: 12,
      },
      imageCard: {
        backgroundColor: '#d1d3d4',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
      },
      image: {
        width: '100%',
        height: 160,
        borderRadius: 8,
      },
      bottomTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f2f0f8',
        paddingVertical: 12,
        borderRadius: 10,
      },
      tabItem: {
        alignItems: 'center',
      },
      tabItemActive: {
        alignItems: 'center',
        backgroundColor: '#dcd3f4',
        padding: 8,
        borderRadius: 12,
      },
    });
export default HomeScreen;
