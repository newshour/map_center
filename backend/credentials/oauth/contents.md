# OAuth Credentials

The files here are intentionally excluded from this repository for security
purposes. They should be JSON-formatted, and their contents should have the
following structure:

```
{
	"serviceName": <string>,
	"key": <string>,
	"secret": <string>,
	"idPath": <string>,
	"ids": [			// A whitelist of authorized IDs
		<string>
	]
}
```
