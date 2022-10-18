const apiId = 'vb1x18iwyc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  //  Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-weakvw91.us.auth0.com',            // Auth0 domain
  clientId: 'phuIB7PJcoCgZL57WGcLVb2PBZFDHRlt',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
