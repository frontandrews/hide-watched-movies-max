document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.getElementById('clearWatchedMovies');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (chrome.runtime?.id) {
                chrome.runtime.sendMessage({ action: 'clearWatchedMovies' }, response => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                    } else {
                        if (response && response.status === 'success') {
                            alert('Cleared watched movies.');
                        } else {
                            alert('Failed to clear watched movies.');
                        }
                    }
                });
            } else {
                console.error("Extension context invalidated.");
            }
        });
    } else {
        console.error("Clear button not found.");
    }
});
