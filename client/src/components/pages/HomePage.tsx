import React from 'react';
import { Button, Container } from '@mui/material';
import DataTable from '../ui/DataTable';

import  useAuth  from '../hooks/useAuth';

export default function HomePage (): JSX.Element {
  const {logout} = useAuth();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <Container maxWidth="md">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <h1>Data Table</h1>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      <DataTable />
    </Container>
  );
};

;
