This is how we generate ssl certificate:
using this we can run our application in https mode instead of http in localhost.

`openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes`
