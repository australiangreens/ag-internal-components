// TODO: How to make these non-optional

/** Various components in the library require the theme to provide certain
 * non-standard values like topBar and navBar.*/
export interface AgCustomTheme {
  /** When using PageLayout, there is a TopBar component sticky on the top of
   * the viewport.*/
  topBar: {
    /** The height in pixels. This is used by both the NavBar itself, as well
     * as the PageContainer and NavBar components below it. The PageContainer
     * needs it to calculate its height for its vertical scrollbar, while the
     * NavBar needs it for the height of the underlying MUI Drawer
     * component.*/
    height: number;
  };

  /** When using PageLayout, there is always a NavBar component on the left of
   * the view port, which can be opened and closed (minimised) by a button in
   * the TopBar */
  navBar: {
    widthOpen: number;
    widthClosed: number;

    /** In our design the background of the navbar doesn't match anything on
     * the pallete, so we define it separately */
    backgroundColor: string;
  };
}
