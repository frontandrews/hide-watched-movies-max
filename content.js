window.addEventListener('load', () => {
    console.log("Content script loaded");
  
    const addCloseButtonToMovies = () => {
      const movies = document.querySelectorAll('.StyledTileWrapper-Beam-Web-Ent__sc-ljn9vj-30'); // Adjust the selector as needed
      console.log("Found movies:", movies.length);
  
      movies.forEach(movie => {
        if (!movie.querySelector('.close-button')) {
          const closeButton = document.createElement('button');
          closeButton.textContent = 'X';
          closeButton.className = 'close-button';
          closeButton.addEventListener('click', () => {
            const movieLink = movie.querySelector('a[data-sonic-id]');
            if (!movieLink) {
              console.error("Movie link with data-sonic-id not found");
              return;
            }
            const movieId = movieLink.getAttribute('id');
  
            if (chrome.runtime?.id) {
              chrome.runtime.sendMessage({ action: 'saveMovieId', movieId: movieId }, response => {
                if (chrome.runtime.lastError) {
                  console.error("Error sending message:", chrome.runtime.lastError);
                } else {
                  console.log("Response from background:", response);
                  if (response && response.status === 'success') {
                    console.log("Hiding movie:", movieId);
                    movie.style.display = 'none';
                  } else if (response && response.status === 'exists') {
                    console.log("Movie ID already exists in chrome.storage.local:", movieId);
                    movie.style.display = 'none';
                  } else {
                    console.log("Failed to get a valid response from the background script");
                  }
                }
              });
            } else {
              console.error("Extension context invalidated.");
            }
          });
          movie.appendChild(closeButton);
        }
      });
    };
  
    const hideWatchedMovies = (watchedMovies) => {
      watchedMovies.forEach(movieId => {
        const movieLink = document.querySelector(`a[data-sonic-id="${movieId}"]`);
        if (movieLink) {
          const movieCard = movieLink.closest('.StyledTileWrapper-Beam-Web-Ent__sc-ljn9vj-30'); // Adjust according to the movie ID attribute
          if (movieCard) {
            console.log("Hiding already watched movie card:", movieId);
            movieCard.style.display = 'none';
            movieCard.style.background = "#f8f8f8";
          } else {
            console.log("Movie card not found for ID:", movieId);
          }
        } else {
          console.log("Movie element not found for ID:", movieId);
        }
      });
    };
  
    addCloseButtonToMovies();
  
    const observer = new MutationObserver(addCloseButtonToMovies);
    observer.observe(document.body, { childList: true, subtree: true });
  
    if (chrome.runtime?.id) {
      chrome.storage.local.get(['WATCHED_MOVIES'], result => {
        setTimeout(() => {
            let watchedMovies = result.WATCHED_MOVIES || [];
            console.log("Watched movies from chrome.storage.local:", watchedMovies);
            hideWatchedMovies(watchedMovies);
        }, [2000])
        
      });
    } else {
      console.error("Extension context invalidated.");
    }
  });
  