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
       * as the PageContainer and NavBar components below it. The PageContainer
       * needs it to calculate its height for its vertical scrollbar, while the
       * NavBar needs it for the height of the underlying MUI Drawer
       * component.*/
      height?: number;
    };

    /** When using PageLayout, there is always a NavBar component on the left of
     * the view port, which can be opened and closed (minimised) by a button in
     * the TopBar */
    navBar?: {
      widthOpen?: number;
      widthClosed?: number;

      /** In our design the background of the navbar doesn't match anything on
       * the pallete, so we define it separately */
      backgroundColor?: string;
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
