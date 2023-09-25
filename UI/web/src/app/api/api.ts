import wretch, { ConfiguredMiddleware } from "wretch";
import { delay } from "wretch/middlewares";

const API_URL = import.meta.env.VITE_API_URL;

const middlewares: ConfiguredMiddleware[] = [];

if (import.meta.env.DEV) {
  middlewares.push(delay(getRandomServerResponseTime()));
}

function getRandomServerResponseTime() {
  const MIN_TIME = 100;
  const MAX_TIME = 600;

  return Math.floor(Math.random() * (MAX_TIME - MIN_TIME) + MIN_TIME);
}

const client = wretch(API_URL)
  .middlewares(middlewares)
  .errorType("json")
  .resolve((resolver) => {
    return resolver.res((response) => {
      if (response.headers.get("content-type")?.includes("application/json")) {
        return response.json();
      }
      return response.text();
    });
  });

export const api = {
  product: {
    list: () => client.get("/products"),
    get: (id: number) => client.get(`/products/${id}`),
  },
  errors: {
    get400Error: () => client.get("/error/bad-request"),
    get401Error: () => client.get("/error/unauthorised"),
    get404Error: () => client.get("/error/not-found"),
    get500Error: () => client.get("/error/server-error"),
    getValidationError: () => client.get("/error/validation-error"),
  },
  basket: {
    get: () => client.get("/basket"),
    addItem: (productId: number, quantity = 1) =>
      client.post(
        undefined,
        `/basket/product/${productId}?quantity=${quantity}`,
      ),
    removeItem: (productId: number, quantity = 1) =>
      client.delete(`/basket/product/${productId}?quantity=${quantity}`),
  },
};
