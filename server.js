(function () {
    'use strict';
    let AWS = require('aws-sdk');

    AWS.config.update({
        region: "us-east-2",
        endpoint: "http://localhost:8010"
    });

    ///////////////////////////

    let dynamo = new AWS.DynamoDB();
    let docClient = new AWS.DynamoDB.DocumentClient();

    let path = require('path'),
        bodyParser = require('body-parser'),
        express = require('express'),
        app = express();

    let params = {
        TableName : "test1",
        KeySchema: [
            { AttributeName: "daymonth", KeyType: "HASH"},  //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "daymonth", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    dynamo.describeTable({TableName: params.TableName}, function (err, data) {
        if (err) {
               console.error("***Red Alert*** describeTable failed. Message: ", JSON.stringify(err, null, 2));
           } else {
               console.log(params.TableName+ " table created. JSON: ", JSON.stringify(data, null, 2));
               if (!data.Table.TableStatus == "ACTIVE"){
                   createDynamoTable(params);
               }
           }
    });


    function createDynamoTable(params){
        dynamo.createTable(params, function(err, data) {
            if (err) {
                console.error("***Red Alert*** createTable failed. Message:", JSON.stringify(err, null, 2));
            } else {
                console.log("Successfully created table: ", JSON.stringify(data, null, 2));
            }
        });
    }

    app.use("/css", express.static(__dirname + '/css'));
    app.use("/js", express.static(__dirname + '/js'));
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/', function (request, response) {
        response.sendFile(path.resolve('index.html'));
    });

    app.get('/input', function (request, response) {
        response.sendFile(path.resolve('input.html'));
    });

    app.get('/api/event/:daymonth', function (request, response) {
        let key = request.params.daymonth;

        let getParams = {
            TableName:"test1",
            Key: {
                daymonth: key
            }
        }

        docClient.get(getParams, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                response.json(data);
            }
        });
    });

    app.get('api/events', function (request, response) {
        today.find({}, function (err, events) {
            response.json(events);
        });
    });

    // app.post('/api/setDate', function (req, res) {
    //     console.log("+++++++++ ", req);
    // });

    app.post('/api/event', function(request, response) {
        let daymonthVal = '' + groomDateInt(request.body.month) + groomDateInt(request.body.day);
        let entry = {
            TableName:"test1",
            Item: {
                "daymonth": daymonthVal, //must be a string
                "bad": request.body.bad,
                "badLink": request.body.badLink,
                "badYear": request.body.badYear,
                "good": request.body.good,
                "goodLink": request.body.goodLink,
                "goodYear": request.body.goodYear
            }
        }

        docClient.put(entry, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                response.json(data);
            }
        });
    });

    app.put('/api/event/:eventId', function (request, response) {

    });

    app.delete('/api/event/:eventId', function(request, response) {
        var eventId = request.body.eventId;
        today.remove({ _id: eventId }, function(err) {
            if(err) {
                response.json({
                    error: err
                });
                return;
            }

            response.end();
        });
    });

    app.listen(8002, function(){
        let time = new Date();
        console.log('we up...   -_______- ', time);
    });

    function groomDateInt(val){
        if (val.indexOf("0") == 0){
            val.replace(0, '');
        }
        if (val > 0 && val < 10){
            return '0'+val;
        } else {
            return ''+val;
        }
    }

})();
