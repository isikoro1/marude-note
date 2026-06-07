import { useCallback, useState } from "react";

export const useReaderControls = () => {
  const [isControlBarVisible, setIsControlBarVisible] = useState(false);

  const showControlBar = useCallback(() => setIsControlBarVisible(true), []);
  const hideControlBar = useCallback(() => setIsControlBarVisible(false), []);
  const toggleControlBar = useCallback(() => {
    setIsControlBarVisible((current) => !current);
  }, []);

  return {
    isControlBarVisible,
    showControlBar,
    hideControlBar,
    toggleControlBar
  };
};
