export function loadFeed(feed) {
    return {
        type: 'LOAD_FEED',
        feed
    }
}

export function showLoading(loading) {
    return {
        type: 'SET_LOADING',
        loading
    }
}

export function addPost(post) {
    return {
        type: 'ADD_POST',
        post
    }
}

export function removePost(id) {
    return {
        type: 'REMOVE_POST',
        id
    }
}

export function updatePost(post) {
    return {
        type: 'UPDATE_POST',
        post
    }
}