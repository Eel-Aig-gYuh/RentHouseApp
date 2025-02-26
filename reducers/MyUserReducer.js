

const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return {...currentState, user: action.payload};
        case "logout":
            return null;
        case "SET_USER":
            return {...currentState, user: action.payload};
        case "UPDATE_SAVED_POSTS":
            return {...currentState, saved_posts: action.payload};
        case "UPDATE_FOLLOW_USERS":
            return {...currentState, following: action.payload};
    }
    return currentState;
}

export default MyUserReducer;