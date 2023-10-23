# Mini-OTL

## Installation & Setup

```bash
$ npm install
```

```bash
$ docker compose up
```

Connect to the running mysql container and run the following command.
```bash
$ mysql -u root -p
password: {MYSQL_ROOT_PASSWORD configured in docker-compose.yml}
```

```sql
mysql> CREATE USER 'backend' IDENTIFIED BY 'password';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'backend';
mysql> FLUSH PRIVILEGES;
```

Exit and migrate DB
```bash
$ npx prisma migrate deploy
```


## Running the app

```bash
# run DB
$ docker compose up

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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

## DB
### Migration
```bash
$ npx prisma migrate dev --name {name}

```