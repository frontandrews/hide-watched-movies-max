chrome.runtime.onInstalled.addListener(() => {
    console.log("Hide Watched Movies Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    if (message.action === 'saveMovieId') {
        chrome.storage.local.get(['WATCHED_MOVIES'], result => {
            let watchedMovies = result.WATCHED_MOVIES || [];
            if (!watchedMovies.includes(message.movieId)) {
                watchedMovies.push(message.movieId);
                chrome.storage.local.set({ WATCHED_MOVIES: watchedMovies }, () => {
                    console.log("Saved movie ID to chrome.storage.local:", watchedMovies);
                    sendResponse({ status: 'success' });
                });
            } else {
                sendResponse({ status: 'exists' });
            }
        });
        return true;
    } else if (message.action === 'clearWatchedMovies') {
        chrome.storage.local.remove('WATCHED_MOVIES', () => {
            console.log("Cleared watched movies from chrome.storage.local");
            sendResponse({ status: 'success' });
        });
        return true;
    }
});
