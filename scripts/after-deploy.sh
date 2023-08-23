#!/bin/bash

cd /home/ubuntu/build

sudo npm install
sudo pm2 start "npm run start:gate_build"
sudo pm2 start "npm run start:dis_build"
sudo pm2 start "npm run start:users_build"
sudo pm2 start "npm run start:posts_build"
sudo pm2 start "npm run start:admin_build"
sudo pm2 start "npm run start:threads_build"