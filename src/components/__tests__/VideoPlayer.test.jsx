import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VideoPlayer from '../VideoPlayer';

describe('VideoPlayer Component', () => {
  beforeEach(() => {
    // 清除所有模拟函数的调用记录
    jest.clearAllMocks();
  });

  it('应该正确渲染播放器标题', async () => {
    await act(async () => {
      render(<VideoPlayer url="https://www.bilibili.com/video/BV1234567" />);
    });
    expect(screen.getByText('爱播播放器')).toBeInTheDocument();
  });

  it('应该正确处理bilibili视频URL', async () => {
    let container;
    await act(async () => {
      const result = render(<VideoPlayer url="https://www.bilibili.com/video/BV1234567" />);
      container = result.container;
    });
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain('player.bilibili.com/player.html');
    expect(iframe.src).toContain('bvid=BV1234567');
  });

  it('应该正确处理YouTube视频URL', async () => {
    let container;
    await act(async () => {
      const result = render(<VideoPlayer url="https://www.youtube.com/watch?v=12345" />);
      container = result.container;
    });
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });

  it('应该支持缩放功能', async () => {
    await act(async () => {
      render(<VideoPlayer url="https://www.bilibili.com/video/BV1234567" />);
    });
    
    const zoomInButton = screen.getByTestId('zoom-in-button');
    const zoomOutButton = screen.getByTestId('zoom-out-button');
    const videoContainer = screen.getByTestId('video-container');

    // 测试放大
    await act(async () => {
      fireEvent.click(zoomInButton);
    });
    expect(videoContainer.style.transform).toBe('scale(1.1)');

    // 测试缩小
    await act(async () => {
      fireEvent.click(zoomOutButton);
    });
    expect(videoContainer.style.transform).toBe('scale(1)');
  });

  it('应该支持全屏功能', async () => {
    await act(async () => {
      render(<VideoPlayer url="https://www.bilibili.com/video/BV1234567" />);
    });
    
    const fullscreenButton = screen.getByTestId('fullscreen-button');
    const playerContainer = screen.getByTestId('player-container');

    // 模拟requestFullscreen方法
    playerContainer.requestFullscreen = jest.fn();
    document.exitFullscreen = jest.fn();

    // 测试进入全屏
    await act(async () => {
      fireEvent.click(fullscreenButton);
    });
    expect(playerContainer.requestFullscreen).toHaveBeenCalled();
  });

  it('应该正确处理错误状态', async () => {
    let container;
    await act(async () => {
      const result = render(<VideoPlayer url="invalid-url" />);
      container = result.container;
    });
    
    const errorCallback = container.querySelector('iframe')?.onerror;
    if (errorCallback) {
      await act(async () => {
        errorCallback(new Error('Video load failed'));
      });
      expect(screen.getByText('视频加载失败，请检查URL是否正确或视频是否可用')).toBeInTheDocument();
    }
  });

});