# NeStoReX

A demo project for a [React](https://react.dev/) with a [.NET API](https://dotnet.microsoft.com/en-us/apps/aspnet/apis).
Uses [Redux Toolkit](https://redux-toolkit.js.org/) for state management, [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for client-side data fetching & caching,
and [Material UI](https://mui.com/material-ui/getting-started/) for components. [Stripe](https://stripe.com/) is used for payments.

In the project, a user can see different products and add them to the cart. When the user is ready to check out,
they can proceed to the checkout page and fill in their details and pay through Stripe.

UI is bundled together with the API for convenience, but it should be served via a proper web server,
e.g., nginx, and behind a reverse proxy in "production."

| <img src="https://github.com/azdanov/NeStoReX/assets/6123841/d7b40c79-7e6e-4423-bea5-86a8f2695dfc"> | <img src="https://github.com/azdanov/NeStoReX/assets/6123841/7bab70b9-1cab-40fa-a563-e44ef88cc384"> | <img src="https://github.com/azdanov/NeStoReX/assets/6123841/60ce9306-aa5c-42a3-9436-1b83db10d71a"> |
|------------------------------------|------------------------------------|------------------------------------|
| <img src="https://github.com/azdanov/NeStoReX/assets/6123841/1052af6e-8f06-469e-898b-f27d35118cee"> | <img src="https://github.com/azdanov/NeStoReX/assets/6123841/b3d0d598-0194-4601-b286-a1637fa85aa8"> | <img src="https://github.com/azdanov/NeStoReX/assets/6123841/cf09dc43-cae4-40c3-8415-38184bfa9aa7"> |

<small>PS: corners were cut to save time, e.g., no tests, no proper error handling, etc.
When writing a real-world application, such things must be avoided.</small>

## Setup

- .NET 7 SDK: https://dotnet.microsoft.com/download/dotnet/7.0
- Node.js LTS version: https://nodejs.org/en/
- Docker: https://docs.docker.com/get-docker/
- Pnpm package manager: https://pnpm.io/installation
- .NET EF Core tools: `dotnet tool install --global dotnet-ef`

### Run

```bash
dotnet ef database update # Inside API to create the SQLite database
dotnet watch # To run the API and apply EF Core migrations
pnpm install # Install UI/web dependencies
pnpm dev # Run the UI/web
```

## Notes

### Production

To run the app in production, the following steps are required:

1. Build the UI/web: `pnpm build` and copy the `dist` directory to the `API/wwwroot` directory.
2. Build docker image from Dockerfile (frontend and backend will be together in the image)
3. Push the image to a registry (e.g., Docker Hub)
4. Deploy the image to a server (e.g., fly.io) (the database will be in the same container, in real-world it should be
   separated into a persistent volume)

#### Docker

Docker is used to have easy access to a database in development,
and to deploy the app to production on (fly.io)[https://fly.io].

```bash
docker build -t azdanov/store .

docker run --rm -it -p 8080:80 --name store azdanov/store

docker push azdanov/store:latest
```

#### Fly.io

Fly.io is used to deploy the app to production.

- Install the flyctl CLI: https://fly.io/docs/hands-on/install-flyctl/
- Sign up for an account: `fly auth signup`
- Login to the CLI: `fly auth login`
- Launch the app: `fly launch --image azdanov/store:latest`
- Modify the `fly.toml` file to have the following content:
  ```toml
  [env]
      ASPNETCORE_URLS = "http://+:8080"
  ```
- Set App secrets: `fly secrets set KEY=VALUE`
- Deploy the app: `fly deploy`
