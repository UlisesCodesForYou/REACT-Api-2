import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //##### FETCH MOVIES HANDLER #######

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-api-practice-2-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        // This tells the computer to loop every key in the data object
        loadedMovies.push({
          // This will the info below in to the empty loaded movies array above.
          id: key,
          title: data[key].title, // data[key]: This is how I dynamically access properties in JS
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  //####### END OF FETCH MOVIES HANDLER ###########

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  //#### START OF ADD MOVIE HANDLER ############
  const addMovieHandler = useCallback(async (movie) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "https://react-api-practice-2-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application.json" },
      }
    );
    const data = await response.json();
    console.log(data);
  }, []);

  //##### END OF ADD MOVIE HANDLER #########

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
