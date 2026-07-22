import { useEffect, useState } from 'react';
import styles from './index.module.css';

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
      return;
    }
    document.documentElement.requestFullscreen();
  };

  const labelClassName = styles['button'];
  if (labelClassName === undefined) {
    throw new Error('Missing CSS module class: button');
  }

  return (
    <button type='button' className={labelClassName} onClick={toggleFullscreen}>
      {isFullscreen ? '退出全屏' : '全屏'}
    </button>
  );
};

export default FullscreenButton;
