import '@testing-library/jest-dom';

// 模拟 ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模拟 requestFullscreen 和 exitFullscreen
Object.defineProperty(Element.prototype, 'requestFullscreen', {
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(document, 'exitFullscreen', {
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

// 模拟 fullscreenElement
Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null,
});

// 模拟 ReactPlayer
jest.mock('react-player', () => {
  return jest.fn().mockImplementation(({ url, onError }) => {
    return {
      render: () => {
        return {
          type: 'iframe',
          props: {
            src: url,
            onError: onError,
          },
        };
      },
    };
  });
});