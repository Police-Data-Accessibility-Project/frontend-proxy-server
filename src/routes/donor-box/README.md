# Proxy route to hit the donor box API

## Request body parameters

The [DonorBox API](https://github.com/donorbox/donorbox-api) works entirely with query parameters.
Pass the path and params as request body arguments to `/donor-box` as a `POST` request.

| name     | required? | types                    | description                  | default |
| -------- | --------- | ------------------------ | ---------------------------- | ------- |
| `path`   | yes       | `boolean`                | DonorBox API path to hit     | n/a     |
| `params` | no        | `Record<string, string>` | Params to append to API path | n/a     |


## Examples
Here are a couple of examples using the JS library `axios`.

```js
const response = axios.post(
  `${env.PDAP_PROXY_ORIGIN}/donor-box`, 
  { path: '/api/v1/donations' }, 
  {
  headers: {
    "Content-Type": "application/json",
  },
})
```

```js
const response = axios.post(
  `${env.PDAP_PROXY_ORIGIN}/donor-box`, 
  { 
    path: '/api/v1/campaigns', 
    params: { id: 1234 } 
  }, 
  {
  headers: {
    "Content-Type": "application/json",
  },
})
```