document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.getElementById('clearWatchedMovies') as HTMLButtonElement;
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        if (chrome.runtime?.id) {
          chrome.runtime.sendMessage({ action: 'clearWatchedMovies' }, (response) => {
            if (!chrome.runtime.lastError) {
              if (response && response.status === 'success') {
                alert('Cleared watched movies.');
              } else {
                alert('Failed to clear watched movies.');
              }
            } else {
              console.error("Error sending message:", chrome.runtime.lastError);
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
  