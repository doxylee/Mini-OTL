# Mini-OTL

## [Postman API documentation](https://www.postman.com/aviation-physicist-85866318/workspace/mini-otl/collection/31024888-7a861ae0-69ed-44e6-81ef-54f49e891b4b?action=share&creator=31024888)
Requires Postman account and desktop app to try on localhost environment.

## Prerequisites

- docker and docker-compose (You can install docker desktop for windows or mac)
- nodejs 18
- npm

## Installation & Setup

Install dependencies

```bash
$ npm install
```

Create and start a mysql container. Set a password for root user.

```bash
$ export MYSQL_ROOT_PASSWORD={DB root password} # for mac or linux
$ set MYSQL_ROOT_PASSWORD={DB root password} # for windows CMD
$ $env:MYSQL_ROOT_PASSWORD='{DB root password}' # for windows PowerShell
$ make db
```

Connect to the running mysql container and run the following command.

```bash
$ docker exec -it mini-otl-server-db mysql -u root -p miniotl
password: {DB root password}
```

```sql
mysql> CREATE USER 'backend' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON *.* TO 'backend'; FLUSH PRIVILEGES;
mysql> exit
```

Create a .env file to be used for developemnt in the root directory and set the environment variables according to .env.template file. Here's an example.

```
DATABASE_URL="mysql://backend:password@localhost:43306/miniotl"
JWT_ACCESS_TOKEN_SECRET="secret"
JWT_ACCESS_TOKEN_EXP_SEC="3600"
JWT_REFRESH_TOKEN_SECRET="secret2"
JWT_REFRESH_TOKEN_EXP_SEC="108000"
LOG_REQUESTS="true"
```

Migrate DB

```bash
$ npx prisma migrate deploy
```

Add seed rows to DB
```bash
$ npx prisma db seed
```

## Running the app

```bash
# run DB
$ make db

# development
$ make dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Production

You should have the .env.production file in the root directory.

```bash
# Build production image
make build

# Run the image in a container
make run

# Stop the container. Takes some time to stop the container.
make stop

# Kill the container immediately.
make kill
```

Production should be run in production environment and have its own DB,
but in case you are running in local computer and want to connect to a local running DB container(perhaps development DB), you can use the following form to connect.
`mysql://{id}:{password}@host.docker.internal:{port 43306}/miniotl`

## DB related commands

### Update Prisma client to schema changes

```bash
$ npx prisma generate
```

### Create a new migration

```bash
$ npx prisma migrate dev
```

### Create seed rows in DB

```bash
$ npx prisma db seed
```

### Reset DB

```bash
$ npx prisma migrate reset
```

### Access DB directly

```bash
$ docker exec -it mini-otl-server-db mysql -u root -p miniotl
password: {DB root password}
```

## ERD
![ERD](./src/prisma/ERD.svg)