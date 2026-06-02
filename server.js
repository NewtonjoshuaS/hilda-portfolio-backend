const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const DATA_FILE = path.join(__dirname, 'data', 'messages.json')
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')

// POST /api/messages
app.post('/api/messages', (req, res) => {
  const { name, email, message, subject } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })
  const msgs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const entry = { id: Date.now(), name, email, subject: subject||'', message, createdAt: new Date().toISOString() }
  msgs.push(entry)
  fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2))
  res.json({ success: true, message: 'Message saved!' })
})

// GET /api/messages (admin view)
app.get('/api/messages', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')))
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Hilda Portfolio backend is running' })
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
