require('dotenv').config();

const AWS = require('aws-sdk');
const winston = require('winston'),
    WinstonCloudWatch = require('winston-cloudwatch');
const CloudWatchTransport = require('winston-aws-cloudwatch');

/*
winston.add(new WinstonCloudWatch({
    cloudWatchLogs: new AWS.CloudWatchLogs(),
    logGroupName: 'click2call_messages_chat_serviceUpdate',
    logStreamName: 'click2call_messages_chat_serviceUpdate_STREAM'
}));
*/

/*
AWS.config.update({
    region: process.env.AWS_REGION,
});

*/



const logger = winston.createLogger({
    transports: [
        new CloudWatchTransport({


            submissionInterval: 2000,
            submissionRetryCount: 1,
            batchSize: 20,
            logGroupName: 'click2call_messages_chat_serviceUpdate',
            logStreamName: 'click2call_messages_chat_serviceUpdate_STREAM',
            createLogGroup: false,
            createLogStream: false,
            awsConfig: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            },
            formatLog: item =>
                `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`
        })
    ]
})
/*
logger.log('info', "[STARTUP] Connecting to DB...", {tags: 'startup,mongo'});
logger.log( "[STARTUP] Connecting to DB...", {tags: 'startup,mongo'});
logger.error( "[STARTUP] Connecting to DB...", {tags: 'startup,mongo'});
*/

module.exports = {winston ,logger};
