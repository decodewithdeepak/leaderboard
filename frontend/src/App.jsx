import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [lastClaimedPoints, setLastClaimedPoints] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`)
      setUsers(response.data)
      setError('')
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users. Make sure the backend server is running.')
    }
  }

  const handleAddUser = async () => {
    if (!newUserName.trim()) return
    
    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/users`, { name: newUserName.trim() })
      setNewUserName('')
      setOpenDialog(false)
      fetchUsers()
      setError('')
    } catch (error) {
      console.error('Error adding user:', error)
      setError('Failed to add user. User name might already exist.')
    }
    setLoading(false)
  }

  const handleClaimPoints = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${selectedUser}/claim`)
      setLastClaimedPoints(response.data.points)
      fetchUsers()
      setError('')
      
      // Clear the points notification after 3 seconds
      setTimeout(() => setLastClaimedPoints(null), 3000)
    } catch (error) {
      console.error('Error claiming points:', error)
      setError('Failed to claim points. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        🏆 Leaderboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          sx={{ minWidth: 200 }}
          displayEmpty
          disabled={loading}
        >
          <MenuItem value="" disabled>Select a user</MenuItem>
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          onClick={handleClaimPoints}
          disabled={!selectedUser || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Claiming...' : 'Claim Points'}
        </Button>

        <Button
          variant="outlined"
          onClick={() => setOpenDialog(true)}
          disabled={loading}
        >
          Add New User
        </Button>
      </Box>

      {lastClaimedPoints && (
        <Alert severity="success" sx={{ mb: 3, textAlign: 'center' }}>
          🎉 You claimed {lastClaimedPoints} points!
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  No users found. Add some users to get started!
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow 
                  key={user._id}
                  sx={{ 
                    backgroundColor: index < 3 ? '#fff3e0' : 'inherit',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <TableCell>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${user.rank}`}
                  </TableCell>
                  <TableCell sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                    {user.name}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                    {user.totalPoints}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Name"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
            error={!!error && error.includes('User name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" disabled={!newUserName.trim() || loading}>
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default App
