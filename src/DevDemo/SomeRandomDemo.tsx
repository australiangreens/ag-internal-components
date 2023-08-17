import {
  AccessAlarm as Step1Icon,
  AddHome as Step2Icon,
  Pets as Step3Icon,
} from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useSetAtom } from 'jotai';
import { navBarTopAtom } from '..';

const hackyTitle = {
  color: 'success.contrastText',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  padding: 1,
};

export default function SomeRandomDemo() {
  const location = useLocation();
  const lastHash = useRef('');
  const setNavBarTop = useSetAtom(navBarTopAtom);

  // listen to location change using useEffect with location as dependency
  // https://jasonwatmore.com/react-router-v6-listen-to-location-route-change-without-history-listen
  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document
          .getElementById(lastHash.current)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastHash.current = '';
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    setNavBarTop(undefined);
  }, [setNavBarTop]);

  return (
    <>
      <Box sx={{ margin: 2, marginTop: 0, padding: 0 }} id="top">
        <Typography variant="h4">
          <strong>Do some stuff: Blah blah</strong>
        </Typography>
        <p>
          Kale caesar salad bento box scotch bonnet pepper macadamia nut cookies basmati tahini
          drizzle vitamin glow vegan summertime hummus green tea lime cookies samosa fruit smash.
        </p>
      </Box>

      <Paper
        id="step1"
        elevation={5}
        sx={{
          margin: 2,
          marginBottom: 4,
        }}
      >
        <Paper
          sx={{
            ...hackyTitle,
            backgroundColor: 'primary.light',
          }}
        >
          <Typography variant="h4">
            &nbsp;
            <Step1Icon />
            &nbsp; Step 1. Something
          </Typography>
        </Paper>
        <Box sx={{ padding: 2 }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut semper ligula at posuere
            posuere. Cras volutpat ipsum id suscipit hendrerit. Proin maximus neque convallis,
            lobortis nisl eu, vehicula nulla. Phasellus in metus quis orci dapibus tempus. Maecenas
            malesuada nisl elementum tortor porta rutrum. Maecenas ultricies eget libero ac
            consectetur. Sed eu luctus tortor. Aliquam nec est ut est vulputate porta. Praesent eu
            ex est. Duis ut gravida magna, sit amet pulvinar arcu. Aliquam erat volutpat. Nam quis
            turpis arcu.
          </p>
          <p>
            Vivamus at sem sit amet enim dignissim semper. Curabitur luctus cursus lacus, pretium
            elementum justo interdum vitae. Sed non sollicitudin urna. Sed eleifend ex tortor, id
            porttitor ante dignissim at. Ut tellus nibh, sodales eu vestibulum quis, varius
            efficitur leo. Nunc et finibus est. Donec pulvinar vehicula mauris, a mattis libero
            pharetra in. Donec vel tellus laoreet, blandit elit quis, aliquam lacus. Vivamus nunc
            erat, tincidunt sit amet semper et, tincidunt non justo. Donec gravida magna tristique
            sapien consequat, nec pharetra ante tincidunt.
          </p>
        </Box>
      </Paper>

      <Paper elevation={5} sx={{ margin: 2, marginBottom: 4 }} id="step2">
        <Paper
          sx={{
            ...hackyTitle,
            backgroundColor: 'secondary.main',
          }}
        >
          <Typography variant="h4">
            &nbsp;
            <Step2Icon />
            &nbsp;Step 2. Something else
          </Typography>
        </Paper>
        <Box sx={{ padding: 2 }}>
          <p>
            Donec finibus nisi et felis maximus scelerisque. Fusce faucibus ac turpis sit amet
            commodo. Donec molestie luctus molestie. Nam volutpat felis efficitur elit ullamcorper
            finibus at a sapien. Sed imperdiet risus vitae hendrerit eleifend. Sed sed lacinia leo.
            Suspendisse ultrices lacus elit. Pellentesque ultricies ligula vel nisi consequat
            volutpat. Integer eleifend maximus diam, vel dapibus leo accumsan eget. Nulla dictum
            augue vitae magna euismod aliquam. Donec a faucibus lectus. Ut a felis vel urna tempus
            finibus. Ut fermentum id velit ac pellentesque.
          </p>
          <p>
            Aenean in urna sit amet dui tristique tristique. Vestibulum at magna vehicula, dapibus
            enim eget, condimentum purus. Nam ac ante quam. Ut dictum, diam id molestie interdum,
            purus turpis tincidunt nibh, ac fermentum elit augue a neque. Nulla pretium tincidunt
            arcu quis commodo. Proin pretium enim eu quam eleifend convallis. Praesent pellentesque
            lectus vel augue aliquam, eu semper leo pellentesque. Morbi ornare turpis quis lorem
            hendrerit posuere. Sed mollis congue turpis a dapibus. Aliquam sapien lorem, hendrerit
            vel est id, blandit imperdiet eros. Duis tortor mi, tincidunt ac augue quis, maximus
            imperdiet arcu. Proin sit amet mauris vulputate, faucibus metus id, cursus nisi.
            Maecenas efficitur leo sapien, nec interdum massa pretium in. Nullam ut quam dapibus,
            iaculis lacus a, malesuada dui.
          </p>
        </Box>
      </Paper>

      <Paper elevation={5} sx={{ margin: 2, marginBottom: 4 }} id="step3">
        <Paper
          sx={{
            ...hackyTitle,
            backgroundColor: 'warning.main',
          }}
        >
          <Typography variant="h4">
            &nbsp;
            <Step3Icon />
            &nbsp;Step 3. Puppies!
          </Typography>
        </Paper>
        <Box sx={{ padding: 2 }}>
          <p>
            Maecenas quis dui elit. Vivamus nec viverra dui. Maecenas eget vehicula dui. Vestibulum
            vel sapien magna. Nunc fringilla nulla dui, id lacinia enim lacinia eu. Sed non rhoncus
            dolor. Aliquam at justo sit amet lorem pellentesque fringilla. Donec nec elit et ante
            tempus congue mollis id leo. Donec volutpat dignissim lectus dignissim viverra. Nam
            luctus sollicitudin magna, in molestie nisi lacinia a. Praesent a mauris ac libero
            laoreet tincidunt ut eu metus.
          </p>
          <p>
            Praesent gravida a tortor id pellentesque. Phasellus porttitor vel enim a ullamcorper.
            Morbi sed vehicula lorem, eu ornare nunc. Pellentesque consectetur eu sem eu interdum.
            Vivamus vitae pellentesque nibh. Vestibulum eleifend, metus et porta maximus, nisl ex
            euismod orci, ac commodo nunc augue ac lacus. Suspendisse magna leo, imperdiet et congue
            vitae, vehicula sed elit. Sed at sem neque. Sed eget venenatis justo.
          </p>
          <p>
            Nam neque ex, semper eget lacus sit amet, posuere aliquet erat. Nam a magna ut metus
            pellentesque pulvinar vitae a dolor. Donec vitae nisi vel felis elementum ornare.
            Maecenas a sodales leo, eget dapibus dolor. Ut vitae interdum sapien. Praesent placerat
            vel orci sed pulvinar. In malesuada scelerisque varius. In porttitor dolor neque, nec
            rhoncus urna vulputate vel. Vestibulum mollis tellus egestas, egestas neque ac,
            imperdiet odio. Proin placerat massa ac metus vehicula, id finibus justo faucibus.
          </p>
        </Box>
      </Paper>
    </>
  );
}
