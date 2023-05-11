import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMoviesHandler() {
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
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length === 0 && !(error) &&(
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
