import { useEffect, useState } from 'react';

const VAR_VIEWPORT_HEIGHT = '--viewport_height';
const VAR_VIEWPORT_WIDTH = '--viewport_width';

// use for mobile device
// vh unit can not be correctly calculated
const useCalculateViewportMobile = () => {
  const [viewportHeightData, setViewportHeightData] = useState(0);
  const [viewportWidthData, setViewportWidthData] = useState(0);

  // const { isDesktopScreen, isTabletScreen, isMobileScreen } = useNeoDeviceDetect();

  const setViewportHeight = () => {
    const tempViewportHeight = window.innerHeight * 0.01;

    setViewportHeightData(() => {
      return tempViewportHeight * 100;
    });

    document.documentElement.style.setProperty(
      VAR_VIEWPORT_HEIGHT,
      `${tempViewportHeight}px`
    );
  };

  useEffect(() => {
    // Cập nhật chiều cao khi kích thước cửa sổ thay đổi
    window.addEventListener('resize', setViewportHeight);

    // Xóa sự kiện khi component unmount
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  useEffect(() => {
    // Thiết lập chiều cao lần đầu tiên
    setViewportHeight();
    // }, [isDesktopScreen, isTabletScreen, isMobileScreen]);
  }, []);

  // =============================================================================
  // =============================================================================

  const setViewportWidth = () => {
    const tempViewportWidth = window.innerWidth * 0.01;

    setViewportWidthData(() => {
      return tempViewportWidth * 100;
    });

    document.documentElement.style.setProperty(
      VAR_VIEWPORT_WIDTH,
      `${tempViewportWidth}px`
    );
  };

  useEffect(() => {
    // Cập nhật chiều rộng khi kích thước cửa sổ thay đổi
    window.addEventListener('resize', setViewportWidth);

    // Xóa sự kiện khi component unmount
    return () => window.removeEventListener('resize', setViewportWidth);
  }, []);

  useEffect(() => {
    // Thiết lập chiều rộng lần đầu tiên
    setViewportWidth();
    // }, [isDesktopScreen, isTabletScreen, isMobileScreen]);
  }, []);

  return {
    viewportHeightData,
    VAR_VIEWPORT_HEIGHT,
    viewportWidthData,
    VAR_VIEWPORT_WIDTH,
  };
};

export default useCalculateViewportMobile;

// .my-element {
//   width: calc(var(--viewport_width) * 100);
// }
