(function () {
    'use strict';
    let AWS = require('aws-sdk');

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

    app.use("/css", express.static(__dirname + '/css'));
    app.use("/js", express.static(__dirname + '/js'));


    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/', function (request, response) {
        response.sendFile(path.resolve('index.html'));
    });

    app.get('/input', function (request, response) {
        response.sendFile(path.resolve('input.html'));
    });

    app.get('/api/event/:month/:day', function (request, response) {
        let month = request.params.month;
        let day = request.params.day;

        today.find({'month': month, 'day': day}, function(err, events) {
            if(err) {
                response.json({
                    error: err
                });
                return;
            }

            response.json(events);
        });

    });

    app.get('api/events', function (request, response) {
        today.find({}, function (err, events) {
            response.json(events);
        });
    });

    app.post('/api/event', function(request, response) {
        console.log('body is >>> ' + request.body);

        let insert = new today({
            month: request.body.month,
            day: request.body.day,
            good: request.body.good,
            goodLink: request.body.goodLink,
            goodYear: request.body.goodYear,
            bad: request.body.bad,
            badLink: request.body.badLink,
            badYear: request.body.badYear
        });

        insert.save(function(err, event) {
            console.log('body is >>> ' + request.body);

            if(err) {
                response.json({
                    error: err
                });
                return;
            }
            response.json(event);
        });
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
    app.put('/api/event/:eventId', function (request, response) {
        // TODO
    });

    app.listen(8002, function(){
        let time = new Date();
        console.log('we up...   -_______- ', time);
    });


})();
