### Auth
- login
- logout

### Http
- get
- post
- put
- delete

### Docs
- auth
- http


For Gift there is 2  headers must be sent

API-KEY
AUTH-TOKEN

Thue auth token get from the request login and will be stored in localstorage will be reteriveed and checked from there 

So the login 

Will 
- Inital the request to auth/login with username and password with optional lang 
- The reqeust accespts x-www-form-urlencoded data
- The response will contain the auth token and api key
- The auth token will be stored in localstorage
- The api key will be stored in localstorage (For now it will stored in the .env and reterived form there )
