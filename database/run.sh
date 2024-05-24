#!/bin/sh
docker start counter-database 1> /dev/null 2> /dev/null
if [ $? -ne 0 ]; then
  docker run -p 5432:5432 --name counter-database -d -t --restart unless-stopped counter-database
echo "Start successful"
