# CRUD database

This repo is the base for build a Postgres docker image.
It create a user collectio for the database collectio.

First, creates the container of the database.

```sh
# This build the container image collectio-database for Docker
./build.sh
```

Second, run the container.

```sh
# This will run the container. If the container collectio-database has already be
#  created, it will be reused. Otherwise it will creates a new one.
./run.sh
```

If you need to stop your database, you can use the script.

```sh
# This will find the container collectio-database and stop it.
./stop.sh
```
