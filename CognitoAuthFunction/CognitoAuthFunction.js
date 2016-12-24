'use strict';

var AmazonCognitoIdentity = require("./amazon-cognito-identity.min.js");
var AuthenticationDetails = AmazonCognitoIdentity.AuthenticationDetails;
var CognitoUser = AmazonCognitoIdentity.CognitoUser;
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

// Example of event and can be used for testing from command line
var mock_event={
    username_input: 'hello@example.com',
    password_input: 'Abc.1234',
    app_client_id: '123456789012345678901234',
    user_pool_id: 'ap-northeast-0_123456789',
    identity_pool_id: 'ap-northeast-1:12345678s-1234-1234-1234-123456789012',
    region: 'ap-northeast-1'
}


exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let authenticationData = {
        Username: event.username_input,
        Password: event.password_input,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let poolData = {
        UserPoolId: event.user_pool_id,
        ClientId: event.app_client_id
    };

    var userPool = new CognitoUserPool(poolData);
    let userData = {
        Username: event.username_input,
        Pool: userPool
    };

    console.log("Authenticating the user");
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('AccessToken: ' + result.getAccessToken().getJwtToken());
            console.log('IdToken: ' + result.getIdToken().getJwtToken());
            console.log(JSON.stringify(result))
            callback && callback(null, JSON.stringify(result));
        },
        onFailure: function (err) {
            console.log("Failed-" + err.code + ": " + err.message)
            callback && callback(null, err.message);
        },
    });

    console.log("End")
};

// Testing from command line
//exports.handler(mock_event, null, null);