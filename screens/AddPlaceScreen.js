import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import tailwind, { getColor } from "tailwind-rn";
import { showMessage } from "react-native-flash-message";
import { HeaderButton } from "../components";
import { useDispatch } from "react-redux";
import * as placesActions from "../store/actions/places";

const AddPlaceScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState();
  const [coords, setCoords] = useState(route.params?.coords);
  const [isValid, setIsValid] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const scrollViewRef = useRef();

  const dispatch = useDispatch();

  const validatePlace = useCallback(() => {
    let newIsValid = true;
    if (title.length === 0) {
      newIsValid = false;
    }
    if (!image) {
      newIsValid = false;
    }
    if (!(coords && coords.lat && coords.lng)) {
      newIsValid = false;
    }
    setIsValid(newIsValid);
  }, [title, image, coords]);

  const accessMediaLibraryHandler = useCallback(async () => {
    let permissions = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!permissions.granted) {
      permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissions.granted) {
        showMessage({
          message: "Error",
          description:
            "You have not granted permissions for accessing the Media Library.",
          type: "danger",
        });
        return;
      }
    }

    const imgData = await ImagePicker.launchImageLibraryAsync();
    if (imgData.cancelled) return;

    const { uri, height, width } = imgData;
    setImage({ uri, height, width });
  });

  const accessCameraHandler = useCallback(async () => {
    let permissions = await ImagePicker.getCameraPermissionsAsync();
    if (!permissions.granted) {
      permissions = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissions.granted) {
        showMessage({
          message: "Error",
          description:
            "You have not granted permissions for accessing the Camera.",
          type: "danger",
        });
        return;
      }
    }

    const imgData = await ImagePicker.launchCameraAsync();
    if (imgData.cancelled) return;

    const { uri, height, width } = imgData;
    setImage({ uri, height, width });
  });

  const locateUserHandler = useCallback(async () => {
    let permissions = await Location.getPermissionsAsync();
    if (!permissions.granted) {
      permissions = await Location.requestPermissionsAsync();
      if (!permissions.granted) {
        showMessage({
          message: "Error",
          description:
            "You have not granted permissions for accessing the Camera.",
          type: "danger",
        });
        return;
      }
    }

    setLoadingLocation(true);
    setCoords(null);

    try {
      const locationData = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      setCoords({
        lat: locationData.coords.latitude,
        lng: locationData.coords.longitude,
      });
    } catch (err) {
      showMessage({
        message: "Unable to retrieve location",
        description:
          "Check if your location settings are on and if you are connected to the Internet.",
        type: "danger",
      });
    }

    setLoadingLocation(false);
  });

  const pinMapHandler = useCallback(async () => {
    navigation.navigate("MAP", { pinLocation: coords });
  }, [navigation, coords]);

  const savePlaceHandler = useCallback(() => {
    if (!isValid) return;

    dispatch(
      placesActions.addPlace({
        title,
        imageURI: image.uri,
        lat: coords.lat,
        lng: coords.lng,
      })
    );
    navigation.navigate("PLACES_LIST");
  }, [isValid, title, image, coords, navigation]);

  useEffect(validatePlace, [validatePlace]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="Save"
            iconName="save"
            iconColor={
              Platform.OS === "android" ? COLORS.LIGHT : getColor("green-500")
            }
            onPress={savePlaceHandler}
            disabled={!isValid}
          />
        );
      },
    });
  }, [isValid, savePlaceHandler, navigation]);

  useEffect(() => {
    if (route.params?.coords) {
      setCoords(route.params.coords);
      navigation.setParams({ coords: null });
    }
  }, [navigation, route]);

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={90}
        style={tailwind("flex-1")}
      >
        <ScrollView ref={scrollViewRef} style={tailwind("flex-1 px-6 mt-6")}>
          <View style={tailwind("mb-6")}>
            <View style={tailwind("border-b border-blue-600 mb-3")}>
              <Text style={tailwind("text-xl font-bold text-blue-600")}>
                Title
              </Text>
            </View>
            <TextInput
              style={tailwind(
                "bg-white border border-blue-400 rounded text-base py-3 px-4"
              )}
              placeholder="The Eiffel Tower"
              value={title}
              onChangeText={setTitle}
              onFocus={() =>
                scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
              }
            />
          </View>
          <View style={tailwind("mb-6")}>
            <View style={tailwind("border-b border-blue-600 mb-3")}>
              <Text style={tailwind("text-xl font-bold text-blue-600")}>
                Image
              </Text>
            </View>
            {image ? (
              <ImageBackground
                source={{ uri: image.uri }}
                style={[
                  { width: "100%", height: image.height / (image.width / 364) },
                  tailwind("border border-blue-400 rounded"),
                ]}
                imageStyle={tailwind("rounded")}
              />
            ) : (
              <View
                style={tailwind(
                  "bg-gray-300 border border-blue-400 rounded h-32 items-center justify-center"
                )}
              >
                <Text style={tailwind("text-base italic text-blue-700")}>
                  Pick an image...
                </Text>
              </View>
            )}
            <View style={tailwind("flex-row mt-2")}>
              <TouchableOpacity
                style={tailwind("flex-1 p-4 rounded-lg bg-purple-400 mr-2")}
                onPress={accessMediaLibraryHandler}
              >
                <Text
                  style={tailwind("text-center text-xl font-bold text-white")}
                >
                  Library
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tailwind("flex-1 p-4 rounded-lg bg-indigo-400")}
                onPress={accessCameraHandler}
              >
                <Text
                  style={tailwind("text-center text-xl font-bold text-white")}
                >
                  Camera
                </Text>
              </TouchableOpacity>
              {image && (
                <TouchableOpacity
                  style={tailwind("p-4 rounded-lg bg-red-400 ml-2")}
                  onPress={() => setImage(null)}
                >
                  <Text
                    style={tailwind("text-center text-xl font-bold text-white")}
                  >
                    <FontAwesome5 name="times-circle" size={24} color="white" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={tailwind("mb-6")}>
            <View style={tailwind("border-b border-blue-600 mb-3")}>
              <Text style={tailwind("text-xl font-bold text-blue-600")}>
                Location
              </Text>
            </View>
            <View
              style={tailwind(
                "bg-gray-300 border border-blue-400 rounded h-32 items-center justify-center"
              )}
            >
              {coords ? (
                <ImageBackground
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:blue%7C${coords.lat},${coords.lng}&key=AIzaSyAxVK91QeHkb9p9Yj1Kuo9TDc17B3LY1dw`,
                  }}
                  style={tailwind(
                    "w-full h-full border border-blue-400 rounded"
                  )}
                  imageStyle={tailwind("rounded")}
                />
              ) : (
                <ImageBackground
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=4&size=600x300&maptype=roadmap&key=AIzaSyAxVK91QeHkb9p9Yj1Kuo9TDc17B3LY1dw`,
                  }}
                  style={tailwind(
                    "w-full h-full border border-blue-400 rounded"
                  )}
                  imageStyle={tailwind("rounded")}
                >
                  <View
                    style={tailwind(
                      "flex-1 items-center justify-center bg-gray-300 bg-opacity-75"
                    )}
                  >
                    {loadingLocation ? (
                      <View
                        style={tailwind("flex-row items-center justify-center")}
                      >
                        <ActivityIndicator color={getColor("blue-700")} />
                        <Text
                          style={tailwind(
                            "ml-2 text-base italic text-blue-700"
                          )}
                        >
                          Getting location...
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={tailwind("ml-2 text-base italic text-blue-700")}
                      >
                        Select a locating method...
                      </Text>
                    )}
                  </View>
                </ImageBackground>
              )}
            </View>
            <View style={tailwind("flex-row mt-2")}>
              <TouchableOpacity
                style={tailwind("flex-1 p-4 rounded-lg bg-orange-400 mr-2")}
                onPress={locateUserHandler}
              >
                <Text
                  style={tailwind("text-center text-xl font-bold text-white")}
                >
                  Locate Me
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tailwind("flex-1 p-4 rounded-lg bg-pink-400")}
                onPress={pinMapHandler}
              >
                <Text
                  style={tailwind("text-center text-xl font-bold text-white")}
                >
                  Pin map
                </Text>
              </TouchableOpacity>
              {coords && (
                <TouchableOpacity
                  style={tailwind("p-4 rounded-lg bg-red-400 ml-2")}
                  onPress={() => setCoords(null)}
                >
                  <Text
                    style={tailwind("text-center text-xl font-bold text-white")}
                  >
                    <FontAwesome5 name="times-circle" size={24} color="white" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={[
          tailwind("mx-6 mt-6 mb-2 p-4 rounded-xl"),
          isValid ? tailwind("bg-green-300") : tailwind("bg-gray-300"),
        ]}
        onPress={savePlaceHandler}
        disabled={!isValid}
      >
        <Text
          style={[
            tailwind("text-center text-xl font-bold"),
            isValid ? tailwind("text-green-900") : tailwind("text-gray-500"),
          ]}
        >
          {isValid ? `Add "${title}"` : "Add Great Place"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddPlaceScreen;
