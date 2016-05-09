/// <reference path="node.d.ts" />
"use strict";
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var assert = require('assert');
//var Schema = mongoose.Schema;
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
conn.on('error', console.error.bind(console, 'connection error:'));
function initGridFSConnection() {
    conn.once('open', function () {
        console.log('Connection open');
    });
}
function saveFileToDb(filepath, filename, category, collection_id) {
    return new Promise(function (resolve, reject) {
        //	conn.once('open', function () {
        var gfs = Grid(conn.db);
        var writestream = gfs.createWriteStream({ _id: new ObjectID(), filename: filename, metadata: { collection_id: collection_id, category: category } });
        fs.createReadStream(filepath).pipe(writestream);
        writestream.on('close', function (file) {
            resolve(null);
        });
    });
}
function retrieveFileFromDb(file) {
    assert(_.isObject(file), 'file not an object');
    return new Promise(function (resolve, reject) {
        // Create a file with a name of the form 'file._id.<ext>', where <ext> is the extension of the original file
        var filepath = __dirname + '/../client-build/' + file._id + '.' + file.filename.substr(file.filename.lastIndexOf('.') + 1);
        // Check whether the file already exists
        fs.open(filepath, 'r', function (err, fd) {
            if (!err) {
                // File already exits
                fs.closeSync(fd);
                resolve(null);
            }
            else {
                // File does not exist...create it
                var fs_write_stream = fs.createWriteStream(filepath);
                var gfs = Grid(conn.db);
                //read from mongodb
                var readstream = gfs.createReadStream({ _id: file._id });
                readstream.pipe(fs_write_stream);
                fs_write_stream.on('close', function () {
                    console.log('file created: ' + filepath);
                    resolve(null);
                });
                fs_write_stream.on('error', function () {
                    err = 'file creation error: ' + filepath;
                    reject(err);
                });
            }
        });
    });
}
function retrieveFileFromDbWithCallback(file, callback) {
    retrieveFileFromDb(file).then(callback).catch(callback);
}
function removeFileFromDb(file) {
    assert(_.isObject(file), 'file not an object');
    return new Promise(function (resolve, reject) {
        var gfs = Grid(conn.db);
        gfs.remove({ _id: file._id }, function (err) {
            err ? reject(err) : resolve(null);
        });
    });
}
function removeFileFromDbWithCallback(file, callback) {
    removeFileFromDb(file).then(callback).catch(callback);
}
function listDocumentFiles() {
    return new Promise(function (resolve, reject) {
        var gfs = Grid(conn.db);
        gfs.files.find({}).toArray(function (err, files) {
            if (err)
                reject(err);
            else {
                // Select only the 'document' category
                var Documents = [];
                for (var i = 0; i < files.length; ++i) {
                    if (files[i].metadata.category == 'document')
                        Documents.push(files[i]);
                }
                resolve(Documents);
            }
        });
    });
}
function retrieveAllDocuments() {
    return new Promise(function (resolve, reject) {
        listDocumentFiles()
            .then(function (Documents) {
            // Ensure that the files have been recreated from the GridFS data
            async.each(Documents, retrieveFileFromDbWithCallback, function (err) {
                err ? reject(err) : resolve(Documents);
            });
        })
            .catch(reject);
    });
}
function listNewsItemFiles(newsitemid) {
    assert(_.isString(newsitemid), 'newsitemid is not a String');
    return new Promise(function (resolve, reject) {
        var gfs = Grid(conn.db);
        gfs.files.find({}).toArray(function (err, files) {
            if (err)
                reject(err);
            else {
                var NewsItemFiles = [];
                for (var i = 0; i < files.length; ++i) {
                    if (files[i].metadata.category == 'newsitem' && files[i].metadata.collection_id == newsitemid) {
                        NewsItemFiles.push(files[i]);
                    }
                }
                resolve(NewsItemFiles);
            }
        });
    });
}
function retrieveNewsItemFiles(newsitemid) {
    assert(_.isString(newsitemid), 'newsitemid is not a String');
    return new Promise(function (resolve, reject) {
        listNewsItemFiles(newsitemid)
            .then(function (NewsItemFiles) {
            async.each(NewsItemFiles, retrieveFileFromDbWithCallback, function (err) {
                err ? reject(err) : resolve(NewsItemFiles);
            });
        })
            .catch(reject);
    });
}
function removeNewsItemFiles(newsitemid) {
    assert(_.isString(newsitemid), 'newsitemid is not a String');
    return new Promise(function (resolve, reject) {
        listNewsItemFiles(newsitemid)
            .then(function (NewsItemFiles) {
            async.each(NewsItemFiles, removeFileFromDbWithCallback, function (err) {
                err ? reject(err) : resolve(null);
            });
        })
            .catch(reject);
    });
}
module.exports = {
    initGridFSConnection: initGridFSConnection,
    saveFileToDb: saveFileToDb,
    removeFileFromDb: removeFileFromDb,
    listDocumentFiles: listDocumentFiles,
    retrieveAllDocuments: retrieveAllDocuments,
    retrieveNewsItemFiles: retrieveNewsItemFiles,
    removeNewsItemFiles: removeNewsItemFiles
};
//# sourceMappingURL=ttcGridFS.js.map