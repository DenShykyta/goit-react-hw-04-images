import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Modal from './Modal';
import Button from './Button';
import fetchImages from '../services';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [collection, setCollection] = useState([]);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imgModal, setImgModal] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const openModal = (imgLarge, tags) => {
    setShowModal(true);
    setImgModal(imgLarge);
    setTags(tags);
  };

  const closeModal = () => {
    setShowModal(false);
    setImgModal('');
    setTags('');
  };

  const handleSearchSubmit = searchText => {
    setSearchText(searchText);
    setCollection([]);
    setPage(1);
  };

  const handleLoadMoreClick = () => {
    setLoader(true);
    setPage(prevPage => prevPage + 1);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current || searchText === '') {
      isFirstRender.current = false;
      return;
    }
    setLoader(true);
    fetchImages(searchText, page)
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          return toast.info('No images! Type a new search input!', {
            theme: 'colored',
          });
        }
        setCollection(prevCollection => [...prevCollection, ...hits]);
        setLoader(false);
        setTotal(totalHits);
      })
      .catch(error => {
        setError(error);
      });
  }, [page, searchText]);

  const pagesNumber = total / collection.length;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      <Searchbar onSubmit={handleSearchSubmit} />
      <ToastContainer autoClose={2000} />
      <ImageGallery collection={collection} onImgClick={openModal} />
      {loader && <Loader />}
      {showModal && <Modal image={imgModal} tags={tags} onClose={closeModal} />}
      {pagesNumber > 1 && !loader && collection !== 0 && (
        <Button onClick={handleLoadMoreClick} />
      )}
    </div>
  );
}
