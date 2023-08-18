import { useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';

export interface ExampleComponentProps {
  /** Test */
  text: string;
}

export default function ExampleComponent({ text }: ExampleComponentProps) {
  const [num, setNum] = useState(0);

  return (
    <>
      <Typography variant="h6" color="inherit" component="div" sx={{ fontSize: '22px' }}>
        Hello world
      </Typography>

      <Typography variant="caption" display="block">
        <span>Just ensuring MUI is working as planned as a peer dependency. v0.0.11</span>
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
      <Paper>This number will incremember when button pressed: {num}</Paper>
    </>
  );
}
