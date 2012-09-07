# SSL Certificates

The files here are intentionally excluded from this repository for security
purposes. You can generate self-signed `privatekey.pem` and `certificate.pem`
files using the following commands:

```
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```
