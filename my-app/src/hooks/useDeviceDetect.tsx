// import { useMemo } from 'react';
// import useWindowSize from './useWindowResize';
// import useCalculateViewportMobile from './useCalculateViewportMobile';

// enum DEVICE_DETECT_ENUM {
//   'DESKTOP' = 'DESKTOP',
//   'TABLET' = 'TABLET',
//   'MOBILE' = 'MOBILE',
// }

// const returnTypeDevice = (widthDevice: number) => {
//   return {
//     [DEVICE_DETECT_ENUM.DESKTOP]: widthDevice >= 1280,
//     [DEVICE_DETECT_ENUM.TABLET]: widthDevice >= 768 && widthDevice < 1280,
//     [DEVICE_DETECT_ENUM.MOBILE]: widthDevice < 768,
//   };
// };

// export default function useNeoDeviceDetect() {
//   const { width: widthDevice } = useWindowSize();

//   const {
//     viewportHeightData,
//     VAR_VIEWPORT_HEIGHT,
//     viewportWidthData,
//     VAR_VIEWPORT_WIDTH,
//   } = useCalculateViewportMobile();

//   const getReturnTypeDevice = useMemo(() => {
//     return returnTypeDevice(widthDevice);
//   }, [widthDevice]);

//   const returnDeviceType: DEVICE_DETECT_ENUM = useMemo(() => {
//     let temp;

//     Object.keys(getReturnTypeDevice).some((key: DEVICE_DETECT_ENUM) => {
//       temp = key;
//       return getReturnTypeDevice[key];
//     });

//     return temp;
//   }, [getReturnTypeDevice]);

//   const isDesktopScreen = useMemo(() => {
//     return returnDeviceType === DEVICE_DETECT_ENUM.DESKTOP;
//   }, [returnDeviceType]);

//   const isTabletScreen = useMemo(() => {
//     return returnDeviceType === DEVICE_DETECT_ENUM.TABLET;
//   }, [returnDeviceType]);

//   const isMobileScreen = useMemo(() => {
//     return returnDeviceType === DEVICE_DETECT_ENUM.MOBILE;
//   }, [returnDeviceType]);

//   return {
//     returnDeviceType,
//     isDesktopScreen,
//     isTabletScreen,
//     isMobileScreen,

//     // const VAR_VIEWPORT_HEIGHT = '--viewport_height';
//     // const VAR_VIEWPORT_WIDTH = '--viewport_width';
//     viewportHeightData,
//     VAR_VIEWPORT_HEIGHT,
//     viewportWidthData,
//     VAR_VIEWPORT_WIDTH,
//   };
// }
