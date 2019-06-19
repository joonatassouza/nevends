import { createStore } from "redux";

const INITIAL_STATE = {
  feed: [],
  loading: true
};

function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "LOAD_FEED":
      return { ...state, feed: action.feed };
    case "UPDATE_POST":
      let index = state.feed.findIndex(f => f._id === action.post._id);

      if (index >= 0)
        state.feed[index] = {
          ...action.post,
          showComments:
            action.post.showComments !== undefined
              ? action.post.showComments
              : state.feed[index].showComments
        };

      return { ...state, feed: state.feed };
    case "REMOVE_POST":
      let removeIndex = state.feed.findIndex(f => f._id === action.id);

      if (removeIndex >= 0) state.feed.splice(removeIndex, 1);

      return { ...state, feed: state.feed };
    case "ADD_POST":
      return { ...state, feed: [action.post, ...state.feed] };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
