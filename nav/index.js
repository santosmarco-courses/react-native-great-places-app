import React from "react";
import { StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { HeaderButton } from "../components";
import * as screens from "../screens";
import * as COLORS from "../const/colors";
import { getColor } from "tailwind-rn";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: Platform.OS === "android" && styles.headerAndroid,
          headerTintColor:
            Platform.OS === "android" ? COLORS.LIGHT : COLORS.PRIMARY,
        }}
      >
        <Stack.Screen
          name="PLACES_LIST"
          component={screens.PlacesListScreen}
          options={({ navigation }) => ({
            title: "All Great Places",
            headerRight: () => (
              <HeaderButton
                title="Add"
                iconName="plus-circle"
                iconColor={
                  Platform.OS === "android" ? COLORS.LIGHT : COLORS.PRIMARY
                }
                onPress={() => navigation.navigate("ADD_PLACE")}
              />
            ),
          })}
        />
        <Stack.Screen
          name="PLACE_DETAILS"
          component={screens.PlaceDetailsScreen}
          options={({ route }) => ({
            title: route.params.headerTitle,
          })}
        />
        <Stack.Screen
          name="ADD_PLACE"
          component={screens.AddPlaceScreen}
          options={({ route }) => ({
            title: "New Great Place",
          })}
        />
        <Stack.Screen
          name="MAP"
          component={screens.MapScreen}
          options={({ route }) => ({
            title: route.params?.headerTitle || "Map",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  headerAndroid: {
    backgroundColor: COLORS.PRIMARY,
  },
});
