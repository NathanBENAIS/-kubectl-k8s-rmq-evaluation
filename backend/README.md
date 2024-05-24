# Server counter

## Default env

```
PORT=4040
PGHOST=localhost
PGUSER=count
PGDATABASE=count
PGPORT=5432
PGPASSWORD=count
RABBITMQ_URL=amqp://localhost:5672
QUEUE=count
```

## Install dependencies

```bash
yarn
```

## Run database migration

```bash
yarn migrate
```

## Run server

```bash
yarn start
```

## Compile and minify Typescript

```bash
yarn compile
```
