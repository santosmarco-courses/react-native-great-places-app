import { ADD_PLACE, SET_PLACES } from "../actions/places";

const initialState = {
  all: [],
};

const setPlaces = (state, { allPlaces }) => ({ ...state, all: allPlaces });

const addPlace = (state, { placeData }) => ({
  ...state,
  all: [...state.all, placeData],
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return setPlaces(state, action);
    case ADD_PLACE:
      return addPlace(state, action);
    default:
      return state;
  }
};

export default reducer;
