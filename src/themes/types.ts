/** Various components in the library require the theme to provide certain
 * non-standard values like navBar.*/
export interface AgCustomTheme {
  /** When using PageLayout, there is always a NavBar component on the left of
   * the view port, which can be opened and closed (minimised) by a button in
   * the TopBar */
  navBar: {
    /** In our design the background of the navbar doesn't match anything on
     * the pallete, so we define it separately */
    backgroundColor: string;
  };
}
