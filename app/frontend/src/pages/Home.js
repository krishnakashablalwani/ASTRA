import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Home({ setMode, mode }) {
  return (
    <div style={{ padding: 32 }}>
      <Typography variant="h3" gutterBottom>
        CampusHive
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Buzzing with campus activity
      </Typography>
      <Button
        variant="contained"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      >
        Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    </div>
  );
}

export default Home;
