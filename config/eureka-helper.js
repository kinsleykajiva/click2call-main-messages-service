const dotenv = require('dotenv');
dotenv.config();
const Eureka = require('eureka-js-client').Eureka;

const eurekaHost =  process.env.DEV_NODE_ENVIROMMENT ?process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:  '127.0.0.1';
console.log('eurekaHost', eurekaHost)
//const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || 'api-app-eureka.intacall.com');
const eurekaPort = 8761;
const hostName =  'localhost';
const ipAddr =  process.env.DEV_NODE_ENVIROMMENT ?process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:  '127.0.0.1';
const vipAddress =  process.env.DEV_NODE_ENVIROMMENT ?process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:  '127.0.0.1';
const dataCenterInfo =  process.env.DEV_NODE_ENVIROMMENT ?{
    "@class": "com.netflix.appinfo.AmazonInfo",
    "name": "Amazon"
} : {
  '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
  'name': 'MyOwn'
};


exports.registerWithEureka = (appName, PORT) => {
    const client = new Eureka({
        instance: {
            app: appName,
            hostName: hostName,
            statusPageUrl: 'http://localhost:'+PORT,
            ipAddr: ipAddr,
            port: {
                '$': PORT,
                '@enabled': 'true',
            },
            vipAddress: vipAddress,
            dataCenterInfo,
        },
        //retry 10 time for 3 minute 20 seconds.
        eureka: {
            host: eurekaHost,
            port: eurekaPort,
            servicePath: '/eureka/apps/',
            maxRetries: 10,
            requestRetryDelay: 2000,
            preferIpAddress:false
        },
    })

    client.logger.level('debug')

    client.start( error => {
       // console.log(error || process.env.SERVICE_NAME+ " registered")
    });



    function exitHandler(options, exitCode) {
        if (options.cleanup) {
        }
        if (exitCode || exitCode === 0) console.log(exitCode);
        if (options.exit) {
            client.stop();
        }
    }

    client.on('deregistered', () => {
        process.exit();
      //  console.log('after deregistered');
    })

    client.on('started', () => {
       // console.log("eureka host  " + eurekaHost);
    })

    process.on('SIGINT', exitHandler.bind(null, {exit:true}));
};