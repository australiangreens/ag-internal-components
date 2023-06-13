import { AgThemeProvider } from '.';
import { ExampleComponent } from '.';

export default function DevApp() {
  return (
    <AgThemeProvider name="fed21">
      <ExampleComponent text="Some text" />
    </AgThemeProvider>
  );
}
