# aws-cognito-auth-lambda-nodejs

**`CognitoAuthFunction`**, which contains Node.js code that can be deployed to
AWS Lambda, implements the "authenticate" part of the 
[Amazon Cognito](https://aws.amazon.com/cognito/) service.

## Why Node.js

> Cognito User Pools is in beta release currently and the authentication APIs are
not part of the server side SDKs as of now. Recommendation is to use one of the
client side SDKs ([Android](https://github.com/aws/aws-sdk-android),
[iOS](https://github.com/aws/aws-sdk-ios) or
[JavaScript](https://github.com/aws/amazon-cognito-identity-js)).
The authentication APIs will be included in the server side SDKs with general
availability release of the feature." - 
[Reference](http://stackoverflow.com/questions/37898341/boto3-how-i-can-cognito-auth)
(Software Engineer at AWS, 19-Jun-2016)

## Idea: Using amazon-cognito-identity-js in a Node.js Lambda function

The plan is to implement a Node.js Lambda function with the JavaScript lib 
[amazon-cognito-identity-js](https://github.com/aws/amazon-cognito-identity-js).

Since some dependencies (e.g. navigator) are client side code and do not work
with Node.js (see 
[reference](http://stackoverflow.com/questions/16500499/nodejs-referenceerror-navigator-is-not-defined),
we need to ***hack*** the code a little bit.

1. Download **[amazon-cognito-identity.min.js](https://github.com/aws/amazon-cognito-identity-js/tree/master/dist)**
 and keep a copy in this repo.
2. Replace `DeviceName: navigator.userAgent` to `DeviceName: CognitoAuthFunction-Custom` (
`navigator.userAgent` is used to return browser or mobile device information; e.g.
 "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"")

## Deploy to AWS Lambda

### Creating the deployment package

Create CognitoAuthFunction.zip containing

    1. `CognitoAuthFunction.js`
    2. `amazon-cognito-identity.min.js`
    3. `node_modules/*`


### Run from Command Line

1. Install npm and nodejs

2. Build

    ~~~~
    npm install aws-sdk sjcl jsbn
    ~~~~

3. Run/test

    1. Uncomment the last line in `CognitoAuthFunction.js`
    2. Change `mock_event`
    3. Run `node CognitoAuthFunction.js`