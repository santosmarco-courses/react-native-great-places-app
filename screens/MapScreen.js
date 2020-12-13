import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Platform } from "react-native";
import tailwind, { getColor } from "tailwind-rn";
import MapView, { Marker } from "react-native-maps";
import { RotationGestureHandler } from "react-native-gesture-handler";
import { HeaderButton } from "../components";

const DEFAULT_LAT_DELTA = 0.01;
const DEFAULT_LNG_DELTA = 0.04;
const DEFAULT_MAP_REGION = {
  latitude: -22.989271537407696,
  longitude: -43.354341665551416,
  latitudeDelta: DEFAULT_LAT_DELTA,
  longitudeDelta: DEFAULT_LNG_DELTA,
};

const MapScreen = ({ navigation, route }) => {
  const [selectedCoords, setSelectedCoords] = useState(
    route.params?.pinLocation
  );

  const pinLocationHandler = (e) => {
    setSelectedCoords({
      lat: e.nativeEvent.coordinate.latitude,
      lng: e.nativeEvent.coordinate.longitude,
    });
  };

  const applyLocationHandler = useCallback(() => {
    if (!selectedCoords) return;

    navigation.navigate("ADD_PLACE", { coords: selectedCoords });
  }, [selectedCoords, navigation]);

  useEffect(() => {
    if (route.params && route.params.viewMode) return;

    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="Apply"
            iconColor={
              Platform.OS === "android" ? "white" : getColor("green-500")
            }
            onPress={applyLocationHandler}
            disabled={!selectedCoords}
          />
        );
      },
    });
  }, [selectedCoords, applyLocationHandler, navigation]);

  return (
    <View style={tailwind("flex-1")}>
      <MapView
        initialRegion={
          selectedCoords
            ? {
                ...DEFAULT_MAP_REGION,
                latitude: selectedCoords.lat,
                longitude: selectedCoords.lng,
              }
            : DEFAULT_MAP_REGION
        }
        style={tailwind("h-full w-full")}
        onPress={
          route.params && route.params.viewMode ? () => {} : pinLocationHandler
        }
      >
        {selectedCoords && (
          <Marker
            title="Selected location"
            coordinate={{
              latitude: selectedCoords.lat,
              longitude: selectedCoords.lng,
            }}
          />
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
