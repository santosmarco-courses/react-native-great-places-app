import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import tailwind from "tailwind-rn";
import MapView, { Marker } from "react-native-maps";

const PlaceDetailsScreen = ({ navigation, route }) => {
  if (!(route.params && route.params.itemId)) {
    navigation.navigate("PLACES_LIST");
  }

  const { id, address, imageURI, lat, lng, title } = useSelector(
    (state) => state.places.all
  ).filter((place) => place.id === route.params.itemId)[0];

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <ImageBackground
        source={{ uri: imageURI }}
        style={{ width: "100%", height: 200 }}
      >
        <View
          style={tailwind(
            "flex-1 justify-end bg-blue-700 bg-opacity-50 pb-3 pl-4"
          )}
        >
          <Text style={tailwind("text-3xl font-black text-white")}>
            {title}
          </Text>
        </View>
      </ImageBackground>
      <View style={tailwind("flex-1 px-4")}>
        <View
          style={tailwind(
            "flex-row items-center rounded-lg bg-blue-800 p-3 justify-between my-6"
          )}
        >
          <Text style={tailwind("text-base text-white mr-6")}>Address:</Text>
          <View style={tailwind("flex-1")}>
            <Text style={tailwind("text-base text-white font-bold text-right")}>
              {address}
            </Text>
          </View>
        </View>
        <View
          style={tailwind(
            "flex-row items-baseline rounded-lg bg-white p-3 justify-between mb-3"
          )}
        >
          <Text style={tailwind("text-base")}>Place ID:</Text>
          <Text style={tailwind("text-base font-bold")}>{id}</Text>
        </View>
        <View
          style={tailwind(
            "flex-row items-baseline rounded-lg bg-white p-3 justify-between mb-3"
          )}
        >
          <Text style={tailwind("text-base")}>Latitude:</Text>
          <Text style={tailwind("text-base font-bold")}>
            {lat.toFixed(10)}º
          </Text>
        </View>
        <View
          style={tailwind(
            "flex-row items-baseline rounded-lg bg-white p-3 justify-between mb-3"
          )}
        >
          <Text style={tailwind("text-base")}>Longitude:</Text>
          <Text style={tailwind("text-base font-bold")}>
            {lng.toFixed(10)}º
          </Text>
        </View>
        <View style={tailwind("flex-1 mb-10 rounded-2xl overflow-hidden")}>
          <MapView
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.04,
            }}
            style={tailwind("h-full w-full")}
            onPress={() =>
              navigation.navigate("MAP", {
                pinLocation: { lat, lng },
                viewMode: true,
              })
            }
          >
            <Marker
              title={title}
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
            />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlaceDetailsScreen;

const styles = StyleSheet.create({});
