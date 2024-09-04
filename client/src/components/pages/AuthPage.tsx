import React, { useState } from 'react';
import { Button, TextField, Container } from '@mui/material';
import  useAuth  from '../hooks/useAuth';


export default function AuthPage (): JSX.Element {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (): void => {
    try {
      await login(username, password);
      
    } catch (error) {
     console.error('Login failed', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Login</h1>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={() => handleLogin()} variant="contained" color="primary" fullWidth>
        Login
      </Button>
    </Container>
  );
};


