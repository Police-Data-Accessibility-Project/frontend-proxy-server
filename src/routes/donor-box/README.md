# Proxy route to hit the donor box API

## Request body parameters

The [DonorBox API](https://github.com/donorbox/donorbox-api) works entirely with `GET` requests and query parameters.

So we will use `GET` to `/donor-box/<db-api-path>`


## Examples
Here are a couple of examples using the JS library `axios`.

```js
const response = axios.get(
  `${env.PDAP_PROXY_ORIGIN}/donor-box/api/v1/donations`, 
  {
  headers: {
    "Content-Type": "application/json",
  },
})

// Results in `GET` to `https://donorbox.org/api/v1/donations`, with response passed through to the client.
```

```js
const response = axios.get(
  `${env.PDAP_PROXY_ORIGIN}/donor-box/api/v1/campaigns`, 
  { 
    params: { id: 1234 } 
  }, 
  {
  headers: {
    "Content-Type": "application/json",
  },
})

// Results in `GET` to `https://donorbox.org/api/v1/campaigns?id=1234`, with response passed through to the client.
```