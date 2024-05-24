#!/bin/sh
docker stop `docker ps | grep counter-database | cut -c 1-12` 1> /dev/null 2> /dev/null
if [ $? -eq 0 ]; then
  echo Stop successful
else
  echo Container counter-database not found
fi
