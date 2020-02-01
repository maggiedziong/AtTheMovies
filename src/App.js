import React, { Component } from 'react';
import './App.scss';
import Film from './Film';
import FilterGenre from './Filters/FilterGenre';
import FilterRating from './Filters/FilterRating';
import axios from 'axios';
import { css } from '@emotion/core';
import GridLoader from 'react-spinners/GridLoader';
import TMDBLogo from './tmdb-logo.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      genres: [],
      images: [],
      genreFilter: [],
      ratingFilter: 1,
      error: null,
      loading: true,
      filterActive: false
    }
  }

  getCurrentMovies(dbUrl, apiKey, settings) {
    return axios.get(dbUrl + 'movie/now_playing?api_key=' + apiKey + settings);
  }
  
  getMovieGenres(dbUrl, apiKey, settings) {
    return axios.get(dbUrl + 'genre/movie/list?api_key=' + apiKey + settings);
  }
  getConfig(dbUrl, apiKey) {
    return axios.get(dbUrl + 'configuration?api_key=' + apiKey);
  }

  async componentDidMount() {
    const apiKey = '97ddb8ca2d59ad40b178f1c6b2b8747b';
    const dbUrl = 'https://api.themoviedb.org/3/';
    const settings = '&language=en-US&page=1';

    await Promise.all([
      this.getCurrentMovies(dbUrl, apiKey, settings), 
      this.getConfig(dbUrl, apiKey),
      this.getMovieGenres(dbUrl, apiKey, settings)])
        .then(axios.spread((...responses) =>  {
          this.setState({ 
            movies: responses[0].data.results,
            images: responses[1].data.images, 
            genres: responses[2].data.genres, 
            loading: false });
        }));

    this.movies();

  };

  movies = () => {
    const imgUrl = this.state.images.base_url
    const imgSize = this.state.images.poster_sizes[4] 

    const cleanMovies = this.state.movies.map((movie, i) => {
      const genres = this.state.genres

      const genre = movie.genre_ids.map(genre => genres
        .filter(g =>  genre === g.id)
        .map(g => g.name)
      )

      const movieData = { 
        key: i, 
        title: movie.title, 
        popularity: movie.popularity,
        rating: movie.vote_average, 
        genre: genre[0],
        image : imgUrl + imgSize + movie.poster_path
      }

      return movieData
    })

    return cleanMovies
  }

  clearFilter = () => {
    this.setState({ genreFilter: [], ratingFilter: 1 });
  }

  genreSelect = (genre) => {
    this.setState({ genreFilter: [...this.state.genreFilter, genre] })
  }

  ratingSelect = (rating) => {
    this.setState({ ratingFilter:  rating })
  }

  toggleFilter = () => {
    this.setState({
      filterActive: !this.state.filterActive
    });
  }

  genreFilter = (movie) => {
    const filterKeys = this.state.genreFilter;
    let flag = true;

    if (this.state.genreFilter === null || this.state.genreFilter.length < 1 ) {
      return movie
    } else {

      for ( let i = 0; i < filterKeys.length; i++ ) {
        if ( !movie.genre.includes( filterKeys[i] ) ) {
          flag = false;
        }
      }

      if (flag) {
        return movie
      }
    }
  }

  render() {
    const genreFilter  = this.state.genreFilter
    const ratingFilter  = this.state.ratingFilter
    const stateFilterActive  = this.state.filterActive
    const hasFilter = (genreFilter.length > 0 || ratingFilter !== 1 ) && !stateFilterActive
    const ratings = [5,6,7,8,9]

    console.log(genreFilter)

    const primaryLoader = css`
      display: block;
      margin: 100px auto;
    `;

    return (
      <div className="App">
        <GridLoader
            css={primaryLoader}
            sizeUnit={"px"}
            size={50}
            color={'#3bb8de'}
            loading={this.state.loading}
          />

           {!this.state.loading && 
           
            <div>
              <h1>NOW PLAYING</h1>
             
              <div className="filters">
                <button onClick={this.toggleFilter}>Filter
                  <span className={hasFilter ? "show" : ""}>  (filters applied)</span>
                </button>

                <div  
                  className={`filters__inner ${stateFilterActive ? "show" : "hide"}`} >

                  <FilterGenre
                    name={'by genre'} 
                    stateFilter={genreFilter} 
                    toggle={this.openFilter} 
                    filter={this.state.genres} 
                    filterAction={this.genreSelect}
                  />
              
                  <FilterRating 
                    name={'by rating'} 
                    stateFilter={ratingFilter} 
                    toggle={this.openFilter} 
                    filter={ratings} 
                    filterAction={this.ratingSelect}
                  />

                  <div className="button-group">
                    <button 
                      className="filter filter__clear" 
                      onClick={this.clearFilter}>Clear filters</button>

                    <button 
                      className="filter filter__clear" 
                      onClick={this.toggleFilter}>Close filters</button>

                  </div>
                </div>
              </div>

              <div className="movie-list">
                {this.movies()
                .filter((movie) => movie.rating >= this.state.ratingFilter)
                .filter((movie) => this.genreFilter(movie))
                .map((movie, i) => (
                  <Film {...movie} key={movie.key} />
                ))}
              </div>
            </div>
          }

          <img src={TMDBLogo} className="tmbd-logo" alt="Powered by The Movie DB"/>
      </div>
    );
  }
}

export default App;
