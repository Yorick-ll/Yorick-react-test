import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Box, Typography, Container, Paper, Alert, IconButton, Stack } from '@mui/material';
import { Fullscreen, FullscreenExit, ZoomIn, ZoomOut } from '@mui/icons-material';

// 视频平台适配器配置
const platformAdapters = [{
    name: 'bilibili',
    pattern: /(bilibili\.com\/video\/([A-Za-z0-9]+)|player\.bilibili\.com)/,
    component: ({ url, style, onError }) => {
      // 转换bilibili原始链接为嵌入式播放器链接
      let embedUrl = url;
      if (url.includes('bilibili.com/video/')) {
        const bvid = url.match(/\/video\/([A-Za-z0-9]+)/)?.[1];
        if (bvid) {
          embedUrl = `//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=0&as_wide=1&allowfullscreen=true&quality=112`;
        }
      } else if (url.includes('player.bilibili.com')) {
        embedUrl = url.replace('https:', '').replace('http:', '');
        if (!embedUrl.includes('autoplay=')) {
          embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=0';
        }
      }
      return (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; microphone; camera; display-capture; picture-in-picture; web-share; encrypted-media"
          sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-forms"
          style={style}
          onError={onError}
        />
      );
    }
  },
  {
    name: 'youtube',
    pattern: /(youtube\.com|youtu\.be)/,
    component: ({ url, style, onError }) => (
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        style={style}
        onError={onError}
      />
    )
  },
  {
    name: 'default',
    pattern: /.*/,
    component: ({ url, style, onError }) => (
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        style={style}
        onError={onError}
      />
    )
  }
];

const VideoPlayer = ({ url }) => {
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 根据URL匹配合适的视频平台适配器
  const adapter = platformAdapters.find(({ pattern }) => pattern.test(url));

  const handleError = (e) => {
    console.error('视频加载失败:', e);
    setError('视频加载失败，请检查URL是否正确或视频是否可用');
  };

  const handleFullscreen = () => {
    const playerContainer = document.querySelector('.video-player-container');
    if (!playerContainer) return;

    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch(err => {
        console.error('全屏模式错误:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoomIn = () => {
    if (scale < 2) {
      setScale(prev => Math.min(prev + 0.1, 2));
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper 
        className="video-player-container"
        data-testid="player-container"
        elevation={3} 
        sx={{ 
          p: 2, 
          my: 2,
          position: 'relative',
          transition: 'all 0.3s ease',
          ...(isFullscreen && {
            m: 0,
            p: 0,
            height: '100vh',
            width: '100vw',
            borderRadius: 0,
          })
        }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : null}
        <Box 
          data-testid="video-container"
          sx={{ 
            position: 'relative', 
            paddingTop: '56.25%',
            overflow: 'hidden',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease'
          }}
        >
          {adapter.component({ 
            url, 
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }, 
            onError: handleError 
          })}
        </Box>
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          sx={{ 
            mt: 2,
            position: isFullscreen ? 'absolute' : 'relative',
            bottom: isFullscreen ? 16 : 'auto',
            left: isFullscreen ? 16 : 'auto',
            right: isFullscreen ? 16 : 'auto',
            bgcolor: isFullscreen ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
            borderRadius: 1,
            p: isFullscreen ? 1 : 0
          }}
        >
          <Typography variant="h6" sx={{ color: isFullscreen ? 'white' : 'inherit' }}>
            爱播播放器
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton 
            onClick={handleZoomOut} 
            data-testid="zoom-out-button"
            disabled={scale <= 0.5}
            sx={{ 
              color: isFullscreen ? 'white' : 'inherit',
              backgroundColor: isFullscreen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: isFullscreen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-disabled': {
                color: isFullscreen ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.3s ease',
              margin: '0 4px'
            }}
          >
            <ZoomOut sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton 
            onClick={handleZoomIn} 
            data-testid="zoom-in-button"
            disabled={scale >= 2}
            sx={{ 
              color: isFullscreen ? 'white' : 'inherit',
              backgroundColor: isFullscreen ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: isFullscreen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              },
              '&.Mui-disabled': {
                color: isFullscreen ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.3s ease',
              margin: '0 4px'
            }}
          >
            <ZoomIn sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton 
            onClick={handleFullscreen}
            data-testid="fullscreen-button"
            sx={{ color: isFullscreen ? 'white' : 'inherit' }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default VideoPlayer;