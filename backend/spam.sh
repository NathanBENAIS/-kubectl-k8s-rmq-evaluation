max=10000
for i in `seq 1 $max`
do
    curl localhost:4040/count/$1/add -X POST &
done
