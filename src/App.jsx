import { useState } from 'react'
import { Container, Typography, Grid, Paper, TextField, Button, Box, Alert } from '@mui/material'
import VideoPlayer from './components/VideoPlayer'
import './App.css'

function App() {
  const [customUrl, setCustomUrl] = useState('')
  const [currentVideo, setCurrentVideo] = useState({
    id: 'default',
    url: 'https://www.bilibili.com/video/BV1PoF3eeEtF',
    title: '默认视频'
  })
  const [urlError, setUrlError] = useState(null)

  const validateVideoUrl = (url) => {
    const videoUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|bilibili\.com\/video\/[A-Za-z0-9]+|player\.bilibili\.com)/i;
    return videoUrlPattern.test(url);
  }

  const handleUrlSubmit = () => {
    setUrlError(null);
    if (customUrl.trim()) {
      if (validateVideoUrl(customUrl)) {
        setCurrentVideo({
          id: 'custom',
          url: customUrl,
          title: '自定义视频'
        })
      } else {
        setUrlError('请输入有效的视频URL（支持YouTube和Bilibili）');
      }
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        你的爱播网站
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="输入视频URL"
            variant="outlined"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="请输入视频URL（支持YouTube、Bilibili等平台）"
            error={!!urlError}
          />
          <Button
            variant="contained"
            onClick={handleUrlSubmit}
            sx={{ minWidth: 120 }}
          >
            播放
          </Button>
        </Box>
        {urlError && <Alert severity="error">{urlError}</Alert>}
      </Box>
      {currentVideo && <VideoPlayer url={currentVideo.url} />}

    </Container>
  )
}

export default App
