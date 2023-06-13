// See https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
// and https://github.com/mui/material-ui/issues/31097

import '@mui/material/styles';
import '@mui/material/Typography';

declare module '@mui/material/styles' {
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
