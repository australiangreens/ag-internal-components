import { AgThemeProvider, SaladBarProvider } from '.';
import DevDemo from './DevDemo';

export default function DevApp() {
  return (
    <AgThemeProvider name="fed21">
      <SaladBarProvider>
        <DevDemo />
      </SaladBarProvider>
    </AgThemeProvider>
  );
}
