import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import tailwind from "tailwind-rn";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PlacesListItem = ({ id, imageURI, title, address, lat, lng }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={tailwind(
        "flex-row items-center p-3 border border-gray-400 rounded-xl bg-white"
      )}
      onPress={() =>
        navigation.navigate("PLACE_DETAILS", { headerTitle: title, itemId: id })
      }
    >
      <View style={tailwind("flex-row")}>
        <View
          style={[
            styles.imageContainer,
            tailwind("bg-gray-500 rounded-full mr-3"),
          ]}
        >
          <Image
            source={{ uri: imageURI }}
            style={tailwind("h-full w-full rounded-full")}
          />
        </View>
        <View style={tailwind("flex-1")}>
          <View>
            <Text style={tailwind("text-xl font-bold text-blue-600")}>
              {title}
            </Text>
          </View>
          <Text numberOfLines={2}>{address}</Text>
        </View>
        <View style={tailwind("flex-1 flex-row items-center ml-4")}>
          <View style={tailwind("flex-1 flex-row items-center pr-1")}>
            <MaterialCommunityIcons name="latitude" size={19} color="black" />
            <Text style={tailwind("ml-1")}>{lat.toFixed(1)}º</Text>
          </View>
          <View style={tailwind("flex-1 flex-row items-center")}>
            <MaterialCommunityIcons name="longitude" size={19} color="black" />
            <Text style={tailwind("ml-1")}>{lng.toFixed(1)}º</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlacesListItem;

const styles = StyleSheet.create({
  imageContainer: {
    height: 70,
    width: 70,
  },
});
