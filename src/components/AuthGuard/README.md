# Authorization errors

If auth0 authorisation fails, it will use the redirect url and put error
information in the query string as per
<https://www.oauth.com/oauth2-servers/server-side-apps/possible-errors/>

There are a large number of possible standard errors auth0 uses:
<https://auth0.com/docs/api/authentication?javascript#standard-error-responses>

In addition to this, we have a 2 custom rule in our login flow that check
permissions. The both deny access in the following way:

```js
...
return api.access.deny(
  "You do not have the required authorization to access " + event.client.name
);
```

This will result in a redirect with the query string set to
`?error=access_denied&error_description=`

```string
?error=access_denied&error_description=You%20do%20not%20have%20the%20required%20authorization%20to%20access%The%20App&state=somebase64encodedthing
```

When we use the `useAuth0()` hook to get the error object, it will therefore
look like this:

```js
error = {
  error: 'access_denied',
  error_description: 'You do not have the required authorization to access The App',

  // Also things we don't care so much about / can't rely on:
  state: 'somebase64encodedthing',
  appState: {
    returnTo: '/'
  },
}
```

Since auth0 uses access_denied for some other things, we can't assume that just
the error string is sufficient to identify it. So we also look at the
error_description to make sure we inform the user properly.
