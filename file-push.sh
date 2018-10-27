#!/bin/bash

git pull;

git add *;
git commit -a -m "$1 `date`";

git push;