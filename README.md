# ssai-simple-demo
This code provides allows you to demo the basics of Server Side Ad Insertion Technology (SSAI).

It is as simple static webserver that delivers different content based on the browser we are using demonstrating we can target content based on user data (User agent in this case)

This repo includes the media used in the demo, so it is quite "heavy"

# Install
1- Clone this repo
```
git clone git@github.com:jordicenzano/ssai-simple-demo.git
```
2- Install dependencies
```
npm install
```
3- Run de webserver
```
node index.js
```
4- Test the dynamic content replacement in your local browser using this URL:
```
http://localhost:8081/chunklist-tar.m3u8
```
At this point when you reach seconds 8.6 you should see different content depending if you use Safari or Chrome

Note: Only tested in MAC OS
