import { useAppSelector } from '../../app/hooks';

export const usePublicSettings = () => {
  const settings = useAppSelector((state) => state.settings.publicData);
  const isLoading = useAppSelector((state) => state.settings.isPublicLoading);
  return { settings, isLoading };
};
