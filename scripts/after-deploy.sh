#!/bin/bash

cd /home/ubuntu/build

sudo npm install
sudo pm2 kill
sudo pm2 start "npm run start"
sudo pm2 startup
sudo pm2 save