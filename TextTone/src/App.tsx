// App.tsx
import { useState } from 'react'
import './App.css'
import { Box, Button, Paper, TextareaAutosize, Typography } from '@mui/material'

type SentimentResponse = {
  sentiment?: string[]
  error?: string
}

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeText = async () => {
    if (!text.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      
      const data: SentimentResponse = await response.json()
      
      if (data.error) {
        setResult(`Error: ${data.error}`)
      } else {
        setResult(data.sentiment && data.sentiment [0] || 'Unknown result')
      }
    } catch (error) {
      setResult('Failed to connect to the server ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper className="container">
      <Typography variant="h1">Sentiment Analyzer</Typography>
      <div className="input-group">
        <TextareaAutosize
          className='textarea'
          maxRows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          disabled={loading}
        />
        <Button 
          variant="contained"
          onClick={analyzeText} 
          disabled={loading || !text.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
      
      {result && (
        <Paper variant="elevation" className="result">
          <Typography variant='h3'>Predicted Sentiment:</Typography>
          <Box className={`sentiment ${result?.toLowerCase()}`}>
            {result}
          </Box>
        </Paper>
      )}
    </Paper>
  )
}

export default App