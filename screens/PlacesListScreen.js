import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import tailwind from "tailwind-rn";
import { useSelector, useDispatch } from "react-redux";
import { PlacesListItem } from "../components";
import * as placesActions from "../store/actions/places";

const PlacesListScreen = ({ navigation }) => {
  const allPlaces = useSelector((state) => state.places.all);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(placesActions.loadPlaces());
  }, [dispatch]);

  if (allPlaces.length === 0) {
    return (
      <View style={tailwind("flex-1 items-center justify-center p-6")}>
        <Text style={tailwind("text-lg italic")}>No places yet...</Text>
        <TouchableOpacity
          style={tailwind("mt-24 py-4 px-20 rounded-full bg-blue-300")}
          onPress={() => navigation.navigate("ADD_PLACE")}
        >
          <Text style={tailwind("text-center text-lg font-bold text-blue-900")}>
            Click to add one
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <FlatList
        data={allPlaces}
        renderItem={({ item }) => <PlacesListItem {...item} />}
        style={tailwind("flex-1 p-4")}
        ItemSeparatorComponent={() => <View style={tailwind("mb-3")} />}
      />
    </SafeAreaView>
  );
};

export default PlacesListScreen;

const styles = StyleSheet.create({});
