import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MoviesTable from './moviesTable';
import GenreListGroup from './common/genreListGroup';
import SearchBar from './common/searchBar';
import Pagination from '../components/common/pagination';
import { getMovies, deleteMovie } from '../services/movieService';
import { getGenres } from '../services/genreService';
import { paginate } from '../utils/paginate';
import _ from 'lodash';

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: '',
    selectedGenre: null,
    sortColumn: { path: 'title', order: 'asc' }
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ name: 'All Genres', _id: '' }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
      toast.success('Deleted movie successfully.');
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log('error');
      toast.error('This movie has already been deleted.');

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies
    } = this.state;

    // filter movies
    let filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter(m => m.genre._id === selectedGenre._id)
        : allMovies;

    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    // sort the filtered movies
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    // paginate the sorted movies
    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      sortColumn,
      genres,
      searchQuery
    } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no movies in the database</p>;

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <GenreListGroup
            items={genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              className="btn btn-primary"
              to="/movies/new"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCount} movies in database</p>
          <SearchBar value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
