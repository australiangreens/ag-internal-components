import { Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';

export interface ExampleComponentProps {
  /** Test */
  text: string;
}

export default function ExampleComponent({ text }: ExampleComponentProps) {
  const [num, setNum] = useState(0);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Hello world
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <span>We are just checking that MUI keeps working when upgraded to version 9.</span>
      </Typography>
      <Button
        variant="outlined"
        onClick={() => setNum((oldNum) => oldNum + 1)}
        aria-label="Increment"
      >
        Hello I am a button
      </Button>
      <p>
        This is some text: <span>{text}</span>
      </p>
      <Paper sx={{ p: 2 }}>This number will increment when button pressed: {num}</Paper>
    </>
  );
}
