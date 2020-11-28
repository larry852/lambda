const save = require("./save").save;
const get = require("./get").get;

const TABLE_NAME = "black-list";
const TOKEN = "b9011eb2-dbb5-48f2-99eb-4fb94bc31079";

const AWS = require("aws-sdk");

exports.handler = async event => {
    
  console.log("Event:", event);
  
  const unauthorizedResponse = {
    statusCode: 401,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: "Unauthorized",
    isBase64Encoded: false
  };
  
  const badRequestResponse = {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: "Bad request. email and app fields required",
    isBase64Encoded: false
  };

  if (event.headers.Authorization && event.headers.Authorization !== TOKEN) {
    return unauthorizedResponse;
  }
  
  const request = JSON.parse(event.body);
  console.log("Request:", request);  
  request.ip = event.identity.sourceIP;
  request.date = new Date();

  const clientDB = new AWS.DynamoDB.DocumentClient();
  let data = null;
  request.key = request.email;
  if (event.httpMethod === "POST") {
    if (!(request.email && request.app)) {
        return badRequestResponse;
    }
    console.log("Data to save", request);
    data = await save(TABLE_NAME, request, clientDB);
  } else if (event.httpMethod === "GET") {
    if (!request.email) {
        return badRequestResponse;
    }
    console.log("Email to check", request.key);
    const register = await get(TABLE_NAME, request.key, clientDB);
    data = !!register;
  }

  const response = {
    statusCode: data ? 200 : 500,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data),
    isBase64Encoded: false
  };
  return response;
};
