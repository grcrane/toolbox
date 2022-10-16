#! /usr/bin/bash

# Reconcile the images 
/usr/local/bin/php /home2/grcranet/public_html/Gallery/reconcilecsv.php
echo "Reconcile Done"

filename='makethumb.txt'
n=1
while read line; do
   # reading each line
   echo "Line No. $n : $line"
   n=$((n+1))
   DIR="$(dirname "$line")"
   FILE="$(basename "$line")"
   echo "dir=$DIR file=$FILE"
   mkdir -p "$DIR/thumb"
   convert "$DIR/$FILE" -resize 300 "$DIR/thumb/$FILE"
done < $filename

# Reconcile the images again 
/usr/local/bin/php /home2/grcranet/public_html/Gallery/reconcilecsv.php
echo "Reconcile Done again"
