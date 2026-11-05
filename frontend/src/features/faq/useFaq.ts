import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadFaqItems, updateFaqItems } from './faqSlice';
import type { FaqItem } from './faqType';

export const useFaq = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.faq);
  const fetchFaq = useCallback(() => dispatch(loadFaqItems()), [dispatch]);
  const saveFaq = useCallback(async (items: FaqItem[]) =>
    await dispatch(updateFaqItems(items)).unwrap(), [dispatch]);

  return { ...state, fetchFaq, saveFaq };
};
