import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadTermsPage, updateTermsPage } from './termsSlice';
import type { TermsPageContent } from './termsType';

export const useTermsPage = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.terms);
  const fetchContent = useCallback(() => dispatch(loadTermsPage()), [dispatch]);
  const saveContent = useCallback(async (content: TermsPageContent) =>
    await dispatch(updateTermsPage(content)).unwrap(), [dispatch]);

  return { ...state, fetchContent, saveContent };
};
 