import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
        return;
      }
    })();
  }, []);

  const getLocation = async () => {
    setLoading(true);
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Obtener la dirección a partir de las coordenadas
      let address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setAddress(address[0]); // Guardar la primera dirección encontrada
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa con ubicación GPS</Text>

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Obtener Ubicación</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loading} />
      ) : (
        location && (
          <>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Mi Ubicación"
                description={address ? `${address.street}, ${address.city}` : "Buscando dirección..."}
              />
            </MapView>

            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                Latitud: {location.coords.latitude}
              </Text>
              <Text style={styles.locationText}>
                Longitud: {location.coords.longitude}
              </Text>
              {address && (
                <Text style={styles.locationText}>
                  Dirección: {address.street}, {address.city}, {address.region}
                </Text>
              )}
            </View>
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C34',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#61dafb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#282C34',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.4,
    marginTop: 20,
  },
  locationContainer: {
    marginTop: 20,
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
