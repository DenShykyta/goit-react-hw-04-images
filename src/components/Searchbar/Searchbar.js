import { useState } from 'react';
import { toast } from 'react-toastify';
import { SlMagnifier } from 'react-icons/sl';
import PropTypes from 'prop-types';

import 'react-toastify/dist/ReactToastify.min.css';

import css from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = event => {
    setSearchText(event.target.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (searchText.trim() === '') {
      return toast.warning('Input searchText!', { theme: 'colored' });
    }
    onSubmit(searchText);
    setSearchText('');
  };

  return (
    <header className={css.Searchbar}>
      <form className={css.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={css.SearchForm__button}>
          <SlMagnifier size={20} />
        </button>

        <input
          className={css.SearchForm__input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchText}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
