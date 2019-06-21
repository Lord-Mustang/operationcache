//operationcache.js

/* Used for caching sessions/breaks/any other operation
 * A session element needs to contain the following properties:
 * 
 * url: the url to the route of the endpoint
 * operationtype: the type of operation. Can be 'post' or 'put'. These are the only operations that need caching
 * data: the data to send with the request
 * 
 */

const axios = require("axios");
//require("nativescript-localstorage"); //Gives localStorage option for iOs/Android. Easy file operations, stored in a .db file in app data. Alternatively, an sqLite package for Nativescript can be used.

var operations = [];
const STORAGE_KEY = "cache";
module.exports = {

    hasConnection: function () {
        if () { //Check whether connection can be established. Preferably by pinging, otherwise resort to native methods provided by iOs/Android/browser
            return true;
        } else return false;
    },

    //Only call this method if the lifecycle of the application changes to destroyed, sleep or any comparable inactive state for the specific platform. The sessions are best stored in memory, writing to file should be limited.
    //localStorage can be easily accessed in a browser, there is no easy secure way of saving cached data in localStorage. The same goes for iOs/Android. Jailbroken/rooted devices can easily access app data.
    storeInFile: function () {
        //Write to file or localStorage for web
        localStorage.setItem(JSON.stringify(operations));
    },

    //Only call this method if the lifecycle of the application changes to restarted, active or any comparable re-activated state for the specific platform. The sessions are best retrieved from memory, writing to file should be limited.
    retrieveFromFile: function () {
        //Read from file or localStorage for web
        sessions = JSON.parse(localStorage.getItem(STORAGE_KEY));
    },

    //Empties cache file
    clearFile: function () {
        localStorage.removeItem(STORAGE_KEY)
    },

    //Adds an operation to memory
    addOperation: function (operation, operationType) {
        Object.assign(operation, {
            operationtype: operationType
        });
        operations.push(operation);
    },

    //Removes all operations from memory
    clearOperations: function () {
        operations = [];
    },

    //Removes all operations of a specific operationType from memory
    clearOperationsByType: function (operation, operationType) {
        operations = operations.filter((el) => {
            return el.operationtype != operationType
        });
    },

    //Call this when the application's state changes to inactive
    onStateInactive: function () {
        if (this.hasConnection()) {
            this.storeInFile;
            this.clearOperations;
        }
    },

    //Call this when the application's state changes to active
    onStateActive: function () {
        if (this.hasConnection()) {
            this.storeInFile;
            this.clearOperations;
        }
    },

    //Sends all operations from memory, then wipes both memory and cache file
    sendOperations: function (baseUrl, token) {
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 1000,
            headers: {
                'x-access-token': token
            }
        });

        try {
            sessions.forEach(function (el) {
                instance({
                        method: el.operationtype,
                        url: el.url,
                        data: el.data
                    })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                        throw ("error")
                    });
            });
        } catch (error) {
            console.log(error)
        }
        this.clearOperations();
        this.clearFile();
    }
}