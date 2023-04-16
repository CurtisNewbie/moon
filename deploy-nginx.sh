#!/bin/bash

# For my personal development environment only!!! Do not run this 

remote="alphaboi@curtisnewbie.com"
remote_path="/home/alphaboi/services/nginx/html/bolobao/"

ng build --prod;
scp -r ./dist/bolobao/* "${remote}:${remote_path}"




