# PDAP Proxy API

This repository holds a simple node server that proxies external APIs for use in PDAP applications.


## Available routes
| path                             | description                                    | methods | body | params           | auth |
| -------------------------------- | ---------------------------------------------- | ------- | ---- | ---------------- | ---- |
| `/donor-box<donor-box-api-path>` | Proxy for the DonorBox API within the PDAP org | `GET`   | n/a  | donor box params | n/a  |
| `/health`                        | Health check for the API                       | `GET`   | n/a  | n/a              | n/a  |


## Getting started
1. Clone the repository and `cd frontend-proxy-server`
2. Ensure you have obtained and set the following variables either in your shell environment or in a `.env` file
```shell
# required
DONOR_BOX_AUTH_ALIAS=foo
DONOR_BOX_API_KEY=bar

# optional
PORT=3333 # defaults to 3000
NODE_ENV=production # defaults to development.
```
3. Install dependencies
```shell
npm i
```
4. Run the server
```shell
npm run dev
```
