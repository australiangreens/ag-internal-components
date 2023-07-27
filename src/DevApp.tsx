import { AgThemeProvider, SaladBarProvider } from '.';
import DevDemo from './DevDemo';

export default function DevApp() {
  return (
    <AgThemeProvider name="internal">
      <SaladBarProvider>
        <DevDemo />
      </SaladBarProvider>
    </AgThemeProvider>
  );
}
