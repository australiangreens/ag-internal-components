import { Box, Button, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';

import { ExampleComponent, navBarTopAtom, navBarWidthOpenAtom } from 'ag-internal-components';

const parse1dSliderValue = (val: number | number[]) => (Array.isArray(val) ? val[0] : val);

export default function ExampleComponentDemo() {
  const [showLotsOfText, setShowLotsOfText] = useState(true);
  const setNavBarWidthOpen = useSetAtom(navBarWidthOpenAtom);
  const setNavBarTop = useSetAtom(navBarTopAtom);

  useEffect(() => {
    setNavBarTop(undefined);
  }, [setNavBarTop]);

  return (
    <>
      <ExampleComponent text="Hello world!" />

      <Box sx={{ display: 'flex' }}>
        <Slider
          sx={{ width: '200px', margin: '10px' }}
          aria-label="Change navbar open width"
          valueLabelDisplay="auto"
          defaultValue={256}
          min={0}
          max={400}
          onChangeCommitted={(_event, value) => setNavBarWidthOpen(parse1dSliderValue(value))}
        />
      </Box>

      <Button
        variant="outlined"
        onClick={() => {
          setShowLotsOfText((prev) => !prev);
        }}
      >
        Toggle text below
      </Button>
      {showLotsOfText && (
        <div>
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
          <p>
            Fusce tristique ante vel augue egestas rutrum. Pellentesque posuere, lacus eu aliquet
            molestie, ante neque aliquam diam, non pulvinar diam magna vel ligula. Vestibulum id
            tortor placerat, egestas diam id, dignissim diam. Fusce suscipit a est ac viverra.
            Curabitur sagittis velit ac lorem blandit iaculis. Nullam elementum libero vel gravida
            sollicitudin. Donec tristique ut quam non varius. Integer vulputate consequat ornare.
            Etiam sit amet posuere nisl. Proin condimentum in tortor vel tincidunt. Duis lobortis
            ullamcorper ex, id tincidunt enim consequat sit amet. Morbi pellentesque posuere leo eu
            laoreet. Mauris justo dui, dictum non iaculis id, finibus sit amet tortor. Quisque
            turpis urna, suscipit et nulla eu, gravida lobortis mauris. Suspendisse sit amet nisl
            tempus magna hendrerit posuere.
          </p>
          <p>
            Quisque venenatis sapien fringilla tristique convallis. Suspendisse porttitor eget mi eu
            congue. Nunc eu ipsum eget metus viverra gravida. Aenean fermentum tellus eget neque
            convallis, bibendum auctor metus facilisis. Ut aliquet mauris sit amet rhoncus mollis.
            Curabitur vitae elit pretium magna porta ultricies. Fusce tempus et magna sed tincidunt.
            Aenean nec nulla aliquam, luctus velit ac, suscipit dolor. Fusce sodales imperdiet
            lorem, non imperdiet felis bibendum vitae. Mauris finibus augue quis facilisis
            elementum. Cras pretium cursus vehicula. Aliquam ultrices, arcu nec fermentum aliquam,
            neque ligula convallis lorem, sed ultrices lectus massa lacinia ex. Pellentesque eget mi
            egestas risus interdum pellentesque. Donec non orci magna. Suspendisse potenti. Quisque
            tristique, tortor tempus iaculis fringilla, lacus erat feugiat felis, sed pretium orci
            lorem nec lacus.
          </p>
          <p>
            Etiam quis est odio. Suspendisse ut fringilla magna. Nulla consequat rhoncus velit, ac
            tristique risus hendrerit consequat. Integer quis velit ut eros pulvinar mollis eu quis
            nibh. Duis a nunc rhoncus tortor pellentesque posuere. Aenean sed nunc mattis, efficitur
            purus a, gravida massa. Vestibulum placerat nisl et est rhoncus fringilla in ac ipsum.
            Proin sit amet metus interdum ipsum ultrices rutrum. Aliquam finibus porta fringilla.
            Quisque eu sem id massa feugiat viverra.
          </p>
          <p>Final line</p>
        </div>
      )}
    </>
  );
}
