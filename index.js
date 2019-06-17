/*
(c) Jordi Cenzano 2019
 */

 /* jshint esversion: 6 */
 /* jslint node: true */

 "use strict";

const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

// Port
const APP_LISTEN_PORT = 8081

// Replacement tag
const REPLACEMENT_TAG = "#MMSYS-REPLACEMENT-ADBREAK\n"

// Replacement data
const REPLACEMENT_FOR_TARGET_0 = `#EXT-X-DISCONTINUITY\n#EXTINF:5.0,\nad0.ts\n#EXT-X-DISCONTINUITY\n`;
const REPLACEMENT_FOR_TARGET_1 = `#EXT-X-DISCONTINUITY\n#EXTINF:5.0,\nad1.ts\n#EXT-X-DISCONTINUITY\n`;

// CORS data
const corsOptions = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
    maxAge: 3600,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS
app.use(cors(corsOptions));

// Get manifest and do the replacements
app.get('/chunklist-tar.m3u8', function (req, res, next) {
    const ua = req.headers["user-agent"];

    // Read chunklist
    const manifestData = fs.readFileSync(path.join(__dirname, "media/chunklist-tar.m3u8"))
    let manifestDataStr = manifestData.toString();

    if (!isUAChrome(ua)) {
        console.log(`Received manifest request identified SAFARI/Other (Group 0), UA: ${ua}`);
        manifestDataStr = targetedReplacement(manifestDataStr, 0);   
    }
    else {
        console.log(`Received manifest request identified Chrome (Group 1), UA: ${ua}`);
        manifestDataStr = targetedReplacement(manifestDataStr, 1)
    }

    sendStaticContent(Buffer.from(manifestDataStr, 'utf8'), res, 'application/x-mpegURL');
});

// Get any static file (chunks, and any other than /chunklist-tar.m3u8)
app.get('/:mediafile', function (req, res, next) {
    
    console.log(`Received media request to: ${req.params.mediafile}`);

    sendStaticFile(req.params.mediafile, res, 'video/MP2T');
});

// Start webserver
app.listen(APP_LISTEN_PORT, () => console.log(`App listening on port ${APP_LISTEN_PORT}!`));

// HELPER FUNCTIONS -------------------

// Check if UA is from Chrome
function isUAChrome(ua) {
    let ret = false;
    if (ua.toLowerCase().indexOf('chrome') >= 0) {
        ret = true;
    }
    return ret;
}

// Send file
function sendStaticFile(fileName, res, contentType) {
    fs.readFile(path.join(__dirname, "media", fileName), function (err, data) {
        if (err) {
            res.setHeader('Content-Type', 'text/plain');
            return res.status(404).send(data);
        }
        sendStaticContent(data, res, contentType)
    });
}

// Send buffer
function sendStaticContent(data, res, contentType) {
    res.setHeader('Content-Type', contentType);
    return res.status(200).send(data);
}

// Replace chunklist tag
function targetedReplacement(manifestDataStr, targetGroup) {
    let manifestDataReplaced = manifestDataStr.replace(REPLACEMENT_TAG, "");

    if (targetGroup == 0) {
        manifestDataReplaced = manifestDataStr.replace(REPLACEMENT_TAG, REPLACEMENT_FOR_TARGET_0);
    }
    else {
        manifestDataReplaced = manifestDataStr.replace(REPLACEMENT_TAG, REPLACEMENT_FOR_TARGET_1);
    }

    return manifestDataReplaced;
}
