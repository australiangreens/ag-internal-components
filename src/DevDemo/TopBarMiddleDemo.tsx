import { Add as FirstButtonIcon, AirlineStops as SecondButtonIcon } from '@mui/icons-material';
import { Box, Button, Switch, useTheme } from '@mui/material';
import { useSetAtom } from 'jotai';

import { topBarMiddleAtom } from 'ag-internal-components';
import { useEffect, useState } from 'react';
import { DEFAULT_NAV_BAR_WIDTH_OPEN } from '../layouts/AppLayout/defaults';

export function TopBarMiddleContent({ showBoth }: { showBoth: boolean }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `calc(${DEFAULT_NAV_BAR_WIDTH_OPEN}px + ${theme.spacing(2)})`,
        display: 'flex',
        gap: 2,
      }}
    >
      <Button color="secondary" variant="contained" startIcon={<FirstButtonIcon />}>
        Some button
      </Button>
      {showBoth && (
        <Button color="secondary" variant="contained" startIcon={<SecondButtonIcon />}>
          Another button
        </Button>
      )}
    </Box>
  );
}

export default function NavBarTopDemo() {
  // const topBarMiddle = useAtomValue(topBarMiddleAtom);
  const setTopBarMiddle = useSetAtom(topBarMiddleAtom);
  const [switchChecked, setSwitchChecked] = useState(true);

  useEffect(() => {
    setTopBarMiddle(<TopBarMiddleContent showBoth={switchChecked} />);
  }, [setTopBarMiddle, switchChecked]);

  return (
    <>
      <Switch onChange={(_e, checked) => setSwitchChecked(checked)}></Switch>
      <Box sx={{ padding: 2 }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut semper ligula at posuere
          posuere. Cras volutpat ipsum id suscipit hendrerit. Proin maximus neque convallis,
          lobortis nisl eu, vehicula nulla. Phasellus in metus quis orci dapibus tempus. Maecenas
          malesuada nisl elementum tortor porta rutrum. Maecenas ultricies eget libero ac
          consectetur. Sed eu luctus tortor. Aliquam nec est ut est vulputate porta. Praesent eu ex
          est. Duis ut gravida magna, sit amet pulvinar arcu. Aliquam erat volutpat. Nam quis turpis
          arcu.
        </p>
        <p>
          Vivamus at sem sit amet enim dignissim semper. Curabitur luctus cursus lacus, pretium
          elementum justo interdum vitae. Sed non sollicitudin urna. Sed eleifend ex tortor, id
          porttitor ante dignissim at. Ut tellus nibh, sodales eu vestibulum quis, varius efficitur
          leo. Nunc et finibus est. Donec pulvinar vehicula mauris, a mattis libero pharetra in.
          Donec vel tellus laoreet, blandit elit quis, aliquam lacus. Vivamus nunc erat, tincidunt
          sit amet semper et, tincidunt non justo. Donec gravida magna tristique sapien consequat,
          nec pharetra ante tincidunt.
        </p>
      </Box>
    </>
  );
}
