import * as FileSystem from "expo-file-system";
import { insertPlace, fetchPlaces } from "../../utils/db";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";

export const addPlace = ({ title, imageURI, lat, lng }) => async (dispatch) => {
  const addressRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAxVK91QeHkb9p9Yj1Kuo9TDc17B3LY1dw`
  );
  const addressData = await addressRes.json();

  const address = addressData.results[0].formatted_address;

  const fileName = imageURI.split("/").pop();
  const newPath = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.moveAsync({
      from: imageURI,
      to: newPath,
    });
    const dbResult = await insertPlace({
      title,
      address,
      imageURI: newPath,
      lat,
      lng,
    });
    dispatch({
      type: ADD_PLACE,
      placeData: {
        id: dbResult.insertId.toString(),
        title,
        address,
        imageURI: newPath,
        lat,
        lng,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadPlaces = () => async (dispatch) => {
  let allPlaces = [];
  try {
    const dbResult = await fetchPlaces();
    allPlaces = dbResult.rows._array;
  } catch (err) {
    console.error(err);
    throw err;
  }
  dispatch({ type: SET_PLACES, allPlaces });
};
