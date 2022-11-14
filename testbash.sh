#! /bin/bash

# 10/17/22 - Changed from 10 sec to 14
#            added CCLA_Photos/Videos/Events example

srcDir=$1
dest=$2
srcExt="mp4"
destExt="jpg"

for filename in "$srcDir"/*.$srcExt; do

        basePath=${filename%.*}
        baseName=${basePath##*/}
        echo "filename=$filename"
        echo "basePath=$basePath"
        echo "baseName=$baseName"
        echo "dest=$dest"

        ffmpeg -y -ss 00:00:14 -i "$filename" -frames:v 1 "$dest"/"$baseName"."$destExt"

done



# Usage:

# ./testbash.sh "/Volumes/Seagate14b/Videos/Beth" "/Users/george/Sites/Gallery/Videos/Beth/thumb"

# ./testbash.sh "/Users/george/Desktop/Family" "/Users/george/Desktop/Family/thumb"

# single call usage 

# ffmpeg -y -ss 00:00:10 -i "$source" -frames:v 1 "$dest"

# ./testbash.sh "/Users/george/Sites/CCLA_Photos/Videos/Events" "/Users/george/Sites/CCLA_Photos/Videos/Events/thumb"

# ./testbash.sh "/Users/george/Sites/CCLA_Photos/Videos/Jamie" "/Users/george/Sites/CCLA_Photos/Videos/Events/thumb"