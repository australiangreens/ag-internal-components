// See https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
// and https://github.com/mui/material-ui/issues/31097
// and https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface AgCustomTheme {
    /** When using PageLayout, there is a TopBar component sticky on the top of
     * the viewport.*/
    topBar?: {
      /** The height in pixels. This is used by both the NavBar itself, as well
       * as the PageContainer component below it. The PageContainer needs it to
       * calculate its height for its vertical scrollbar.*/
      height?: number;
    };
  }

  interface Theme extends AgCustomTheme {}
  interface ThemeOptions extends AgCustomTheme {}

  interface TypographyVariants {
    explainer: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    explainer?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    explainer: true;
  }
}
