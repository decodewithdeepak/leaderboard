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
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fade,
  IconButton,
  Tooltip,
  Stack,
  Grid,
  LinearProgress
} from '@mui/material'
import {
  EmojiEvents as TrophyIcon,
  PersonAdd as PersonAddIcon,
  Stars as StarsIcon,
  Refresh as RefreshIcon,
  Leaderboard as LeaderboardIcon
} from '@mui/icons-material'

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
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Card sx={{ 
          mb: 4, 
          backgroundColor: '#3b82f6',
          color: 'white',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
        }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <TrophyIcon sx={{ fontSize: 48, color: '#fbbf24' }} />
              <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: 'Inter' }}>
                Leaderboard
              </Typography>
              <LeaderboardIcon sx={{ fontSize: 48, color: '#fbbf24' }} />
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Compete, Claim Points, and Rise to the Top!
            </Typography>
          </CardContent>
        </Card>

        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Controls Section */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: '#334155' }}>
              <StarsIcon sx={{ color: '#3b82f6' }} />
              Game Controls
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  fullWidth
                  displayEmpty
                  disabled={loading}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.300' }}>?</Avatar>
                      Select a player
                    </Box>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        {user.name}
                        <Chip 
                          label={`${user.totalPoints} pts`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    onClick={handleClaimPoints}
                    disabled={!selectedUser || loading}
                    startIcon={loading ? <LinearProgress /> : <StarsIcon />}
                    sx={{ 
                      minWidth: 160,
                      borderRadius: 2,
                      backgroundColor: '#3b82f6',
                      '&:hover': {
                        backgroundColor: '#2563eb',
                      }
                    }}
                  >
                    {loading ? 'Claiming...' : 'Claim Points'}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setOpenDialog(true)}
                    disabled={loading}
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '&:hover': { 
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(59, 130, 246, 0.04)'
                      }
                    }}
                  >
                    Add Player
                  </Button>

                  <Tooltip title="Refresh Rankings">
                    <IconButton 
                      onClick={fetchUsers}
                      disabled={loading}
                      sx={{ 
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        '&:hover': { backgroundColor: '#e2e8f0' }
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {lastClaimedPoints && (
          <Fade in={!!lastClaimedPoints}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }}
              icon={<StarsIcon sx={{ color: '#fbbf24' }} />}
            >
              🎉 Awesome! You claimed {lastClaimedPoints} points! 🎉
            </Alert>
          </Fade>
        )}

        {/* Leaderboard Section */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
          <Box sx={{ 
            backgroundColor: '#3b82f6',
            color: 'white',
            p: 3
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              🏆 Current Rankings
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: '#f8f9fa',
                  '& .MuiTableCell-head': {
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: '#2c3e50'
                  }
                }}>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell align="center">Total Points</TableCell>
                  <TableCell align="center">Badge</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <TrophyIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                        <Typography variant="h6" color="text.secondary">
                          No players yet! Add some players to get started.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow 
                      key={user._id}
                      sx={{ 
                        backgroundColor: index < 3 ? '#fef3c7' : 'inherit',
                        '&:hover': { 
                          backgroundColor: index < 3 ? '#fde68a' : '#f8fafc',
                          transition: 'all 0.2s ease-in-out'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {index === 0 && <Typography variant="h4">🥇</Typography>}
                          {index === 1 && <Typography variant="h4">🥈</Typography>}
                          {index === 2 && <Typography variant="h4">🥉</Typography>}
                          {index > 2 && (
                            <Chip 
                              label={`#${user.rank}`} 
                              variant="outlined" 
                              color="primary"
                              sx={{ fontWeight: 'bold' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: index < 3 ? '#f59e0b' : '#3b82f6',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: index < 3 ? 'bold' : 'normal',
                              color: index < 3 ? '#92400e' : '#334155'
                            }}
                          >
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={user.totalPoints}
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            minWidth: 60,
                            backgroundColor: index < 3 ? '#f59e0b' : '#3b82f6',
                            color: 'white',
                            ...(index >= 3 && {
                              backgroundColor: 'transparent',
                              color: '#3b82f6',
                              border: '1px solid #3b82f6'
                            })
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {index === 0 && <Chip label="Champion" sx={{ backgroundColor: '#f59e0b', color: 'white' }} />}
                        {index === 1 && <Chip label="Runner-up" sx={{ backgroundColor: '#64748b', color: 'white' }} />}
                        {index === 2 && <Chip label="Third Place" sx={{ backgroundColor: '#10b981', color: 'white' }} />}
                        {index > 2 && <Chip label="Competitor" sx={{ color: '#64748b', border: '1px solid #64748b' }} variant="outlined" />}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add User Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }
          }}
        >
          <DialogTitle sx={{ 
            backgroundColor: '#3b82f6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <PersonAddIcon />
            Add New Player
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Player Name"
              fullWidth
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
              error={!!error && error.includes('User name')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              helperText="Enter a unique player name"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser} 
              variant="contained" 
              disabled={!newUserName.trim() || loading}
              sx={{ 
                borderRadius: 2,
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb'
                }
              }}
            >
              {loading ? 'Adding...' : 'Add Player'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default App
