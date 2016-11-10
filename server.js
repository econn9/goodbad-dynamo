(function () {
    'use strict';

    let path = require('path'),
        bodyParser = require('body-parser'),
        express = require('express'),
        app = express();

    AWS.config.update({
            region: "us-east-2",
            endpoint: "http://localhost:8010"
    });

    let dynamo = new AWS.DynamoDB(),
        docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
        TableName : "events",
        KeySchema: [
            { AttributeName: "eventId", KeyType: "HASH"},  //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "eventId", AttributeType: "S" }
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

    app.get('/api/events/:eventId', function (request, response) {
        let key = request.params.eventId;

        let getParams = {
            TableName:params.TableName,
            Key: {
                eventId: key
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

    app.post('/api/events', function(request, response) {
        let entry = {
            TableName:params.TableName,
            Item: {
                month: request.body.month,
                day: request.body.day,
                good: request.body.good,
                goodLink: request.body.goodLink,
                goodYear: request.body.goodYear,
                bad: request.body.bad,
                badLink: request.body.badLink,
                badYear: request.body.badYear
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
        // TODO
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

})();
