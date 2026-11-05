import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadAboutSection, updateAboutContent } from './aboutSectionSlice';
import type { UpdateAboutSectionRequest } from './aboutSectionType';

export const useAboutSection = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.aboutSection);

  const fetchContent = useCallback(() => dispatch(loadAboutSection()), [dispatch]);
  const saveContent = useCallback(async (payload: UpdateAboutSectionRequest) =>
    await dispatch(updateAboutContent(payload)).unwrap(), [dispatch]);

  return { ...state, fetchContent, saveContent };
};
