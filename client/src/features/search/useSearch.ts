import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSearchQuery, toggleSearchModal } from './searchSlice';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { query, isOpen, searchResults } = useAppSelector((state) => state.search);

  const handleQueryChange = (newQuery: string) => {
    dispatch(setSearchQuery(newQuery));
  };

  const openSearch = () => {
    dispatch(toggleSearchModal(true));
  };

  const closeSearch = () => {
    dispatch(toggleSearchModal(false));
  };

  return {
    query,
    isOpen,
    searchResults,
    handleQueryChange,
    openSearch,
    closeSearch,
  };
};