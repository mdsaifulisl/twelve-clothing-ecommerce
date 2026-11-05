import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchSliders, removeSlider, saveSlider } from './sliderSlice';

export const useSlider = () => {
  const dispatch = useAppDispatch();
  const { slides, isLoading, isSaving, error } = useAppSelector((state) => state.sliders);

  const loadSliders = useCallback(() => dispatch(fetchSliders()), [dispatch]);
  const persistSlider = useCallback(async (id: string | undefined, formData: FormData) =>
    await dispatch(saveSlider({ id, formData })).unwrap(), [dispatch]);
  const deleteSlide = useCallback(async (id: string) => await dispatch(removeSlider(id)).unwrap(), [dispatch]);

  return { slides, isLoading, isSaving, error, loadSliders, persistSlider, deleteSlide };
};
