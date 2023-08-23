#!/bin/bash

cd /home/ubuntu/build

sudo npm install
sudo pm2 start "npm run start:build"