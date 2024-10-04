import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location'; // Importar módulo de ubicación de Expo
import MapView, { Marker } from 'react-native-maps'; // Importar componentes de mapa

export default function App() {
  // Estado para almacenar la ubicación, el estado de carga y la dirección
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // Solicitar permisos para acceder a la ubicación
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Mostrar alerta si los permisos no son otorgados
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
        return;
      }
    })();
  }, []);

  // Función para obtener la ubicación actual
  const getLocation = async () => {
    setLoading(true); // Iniciar el estado de carga
    try {
      // Obtener la posición actual del dispositivo
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc); // Guardar la ubicación obtenida en el estado

      // Obtener la dirección a partir de las coordenadas
      let address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setAddress(address[0]); // Guardar la primera dirección encontrada
    } catch (error) {
      // Manejar errores y mostrar alerta si falla
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa con ubicación GPS</Text>

      {/* Botón para obtener la ubicación */}
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Obtener Ubicación</Text>
      </TouchableOpacity>

      {loading ? (
        // Mostrar indicador de carga mientras se obtienen datos
        <ActivityIndicator size="large" color="#fff" style={styles.loading} />
      ) : (
        location && ( // Si se ha obtenido la ubicación, mostrar el mapa
          <>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude, // Latitud inicial del mapa
                longitude: location.coords.longitude, // Longitud inicial del mapa
                latitudeDelta: 0.01, // Controla el zoom del mapa
                longitudeDelta: 0.01, // Controla el zoom del mapa
              }}
            >
              {/* Marcador que muestra la ubicación actual */}
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Mi Ubicación"
                description={address ? `${address.street}, ${address.city}` : "Buscando dirección..."}
              />
            </MapView>

            {/* Contenedor para mostrar las coordenadas y la dirección */}
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

// Estilos para la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C34', // Color de fondo
    alignItems: 'center', // Centrar elementos
    justifyContent: 'center', // Centrar elementos
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#61dafb', // Color del título
    marginBottom: 20, // Espacio debajo del título
  },
  button: {
    backgroundColor: '#61dafb', // Color del botón
    padding: 15,
    borderRadius: 10, // Bordes redondeados
    alignItems: 'center', // Centrar texto en el botón
    justifyContent: 'center', // Centrar texto en el botón
    marginBottom: 20, // Espacio debajo del botón
  },
  buttonText: {
    color: '#282C34', // Color del texto del botón
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20, // Espacio encima del indicador de carga
  },
  map: {
    width: Dimensions.get('window').width * 0.9, // Ancho del mapa
    height: Dimensions.get('window').height * 0.4, // Altura del mapa
    marginTop: 20, // Espacio encima del mapa
  },
  locationContainer: {
    marginTop: 20, // Espacio encima del contenedor de ubicación
    backgroundColor: '#1f1f1f', // Color de fondo del contenedor
    padding: 20, // Espaciado interno
    borderRadius: 10, // Bordes redondeados
    alignItems: 'center', // Centrar contenido
  },
  locationText: {
    color: '#fff', // Color del texto de ubicación
    fontSize: 16,
    textAlign: 'center', // Centrar texto
  },
});
