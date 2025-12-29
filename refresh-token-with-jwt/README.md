This is how we generate ssl certificate:
using this we can run our application in https mode instead of http in localhost.

`openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes`

More things we can apply in this:

- Rotate the refresh token every time you generate access token from it. One refresh token for one Access token.
  - Client → /refresh (RT1)
  - Server:
    - verifies RT1
    - invalidates RT1
    - issues RT2 + new access token
  - Client stores RT2 (cookie)`
- Multidevice session management

### Should frontend also encrypt the password before sending it out in request?

Good:

- Protects against server logging: If we logs the some data on server and password is one of them then encrypted password helps here.
- Respects User Privacy: Even the administrators can't see the password, because humans uses same passwords on different websites most of the time.

But your backend should also do all the standard hashing with a strong salt.
because even if you encrypt the password in frontend, if the attacker got access to your hashed password, this is same as the password for your account.

When the client sends something, whether it is P or H(P) or H(H(P)) anyone who intercepts this can simply resend the exact same thing, thus making any function like this equivalent to using the password directly.

#### But may be encrypting in frontend can be Overkill as HTTPs already has this security.

The Role of TLS (HTTPS):
Transmitting the password \(P\) or the hash \(H(P)\) is only safe because HTTPS (TLS 1.3) creates an encrypted "tunnel" between the client and server. The Defense: TLS ensures that an eavesdropper on the network cannot see or intercept the data being sent.The Limitation: TLS only protects data in transit. It does not protect the data once it reaches the server's memory or if the client's device is compromised

## NONCE

again a good way to prevent the replay attacks.
It a simple thing just google it and you'll undertand.
Although if you use the OIDC or OAuth 2.0 it is already incorporated into them so don't need to make it from scratch.
