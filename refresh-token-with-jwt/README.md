This is how we generate ssl certificate:
using this we can run our application in https mode instead of http in localhost.

`openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes`


More things we can apply in this:

- Rotate the refresh token every time you generate access token from it. One refresh token for one Access token.
  -  Client → /refresh (RT1)
  - Server:
    - verifies RT1
    - invalidates RT1
    - issues RT2 + new access token
  - Client stores RT2 (cookie)`
- Multidevice session management
