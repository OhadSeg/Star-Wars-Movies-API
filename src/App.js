import React, { useState, useEffect, useCallback } from "react";
import { RotatingLines } from "react-loader-spinner";
import MoviesList from "./components/MoviesList/MoviesList";
import AddMovie from "./components/AddMovie/AddMovie"
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error();
      }

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch('https://star-wars-react-http-e373f-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      Headers:{'Content-Type': 'application/json'}
    });
    const data = await response.json();
    console.log(data);
  }

  const fetchPostedMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://star-wars-react-http-e373f-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies((prevMovies) => [...prevMovies, ...loadedMovies]);
      
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
        <button onClick={fetchPostedMovieHandler}>Fetch Posted Movie</button>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length === 0 && !error && (
          <p>No movies were fetched yet.</p>
        )}
        {!isLoading && <MoviesList movies={movies} />}
        {!isLoading && error && <p> {error} </p>}
        {isLoading && movies.length > 0 && <RotatingLines strokeColor="gold" />}
      </section>
    </React.Fragment>
  );
}

export default App;
