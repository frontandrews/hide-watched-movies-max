window.addEventListener('load', () => {
  console.log("Content script loaded");

  const addCloseButtonToMovies = (): void => {
    const movies = document.querySelectorAll<HTMLElement>('.StyledTileWrapper-Beam-Web-Ent__sc-ljn9vj-30');

    movies.forEach(movie => {
      movie.classList.add('movie-card');

      if (!movie.querySelector('.close-button')) {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.className = 'close-button';
        closeButton.addEventListener('click', () => {
          const movieLink = movie.querySelector<HTMLAnchorElement>('a[data-sonic-id]');
          if (!movieLink) {
            console.error("Movie link with data-sonic-id not found");
            return;
          }
          const movieId = movieLink.getAttribute('data-sonic-id');
          
          if (chrome.runtime?.id) {
            chrome.runtime.sendMessage({ action: 'saveMovieId', movieId: movieId }, (response) => {
              if (!chrome.runtime.lastError) {
                if (response && response.status === 'success') {
                  movie.style.display = 'none';
                } else if (response && response.status === 'exists') {
                  movie.style.display = 'none';
                }
              }
            });
          }
        });
        movie.appendChild(closeButton);
      }
    });
  };

  const hideWatchedMovies = (watchedMovies: string[]): void => {
    watchedMovies.forEach(movieId => {
      const movieLink = document.querySelector<HTMLAnchorElement>(`a[data-sonic-id="${movieId}"]`);
      if (movieLink) {
        const movieCard = movieLink.closest<HTMLElement>('.StyledTileWrapper-Beam-Web-Ent__sc-ljn9vj-30');
        if (movieCard) {
          movieCard.style.display = 'none';
          movieCard.style.background = "#f8f8f8";
        }
      }
    });
  };

  addCloseButtonToMovies();

  const observer = new MutationObserver(addCloseButtonToMovies);
  observer.observe(document.body, { childList: true, subtree: true });

  if (chrome.runtime?.id) {
    chrome.storage.local.get(['WATCHED_MOVIES'], (result) => {
      setTimeout(() => {
        const watchedMovies = result.WATCHED_MOVIES || [];
        hideWatchedMovies(watchedMovies);
      }, 200);
    });
  }
});
