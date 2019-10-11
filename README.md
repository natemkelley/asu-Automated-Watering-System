# Automated Watering System - Raspberry Pi

<p align="center">
    <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/water-automation-1-806977.png" width="275px"><br/>
    Simple application to help in seeing current stats, setting automation triggers, and monitoring system performance.
    <br/>
    <br/>
    <br/>
</p>


## Description

This was created for **ASU HSE 424 - Human Automation Systems** and is written as a tutorial, rather than documentation. However, feel free to fork, contribute or commit suggestions!

> Documentation and tutorial written as of October 20, 2019

## Table of Contents

**[Dependancies](#dependancies)**<br>
**[Build Setup](#build-setup)**<br>

## Dependancies and Assumptions
The front-end uses [Vue](https://vuejs.org/), [Express](https://expressjs.com/), [Raspberry Pi's GPIO](https://www.raspberrypi.org/documentation/usage/gpio/) and Nuxt. Unfortunately, this tutorial assumes you have a Raspberry Pi and a working knowledge of all three frameworks. However, as Nuxt is the most obscure of the three frameworks you can check out a detailed explanation on it works at [Nuxt.js docs](https://nuxtjs.org).

Additionally, this tutorial assumes that the Raspberry Pi is setup with Raspbian and you have the ability to SSH into it. Here is documentation on how to setup your Raspberry Pi. 
- [Raspberry Pi Setup](https://www.raspberrypi.org/documentation/installation/installing-images/)
- [SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/)

## Intial Setup

To setup the intial project you will need to clone the repo, install the modules, and start the server. Assuming you have ssh-ed into your Raspberry Pi and navigated to the folder you want to install the program in, run the following commands:

```bash
# clone repo
$ git clone https://github.com/natemkelley/Automated-Watering-System---HSE-424.git

# navigate to cloned folder
$ cd automated-watering-system

# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

```

If you have setup the dev or run the actual build, you should see the website running on `port 3000`.