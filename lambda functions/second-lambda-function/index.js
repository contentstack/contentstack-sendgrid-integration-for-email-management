// Module dependency
const axios = require("axios");

const { baseUrl, ctUid, apiKey, managementToken, stageUid } = process.env;

//axios instance
const contentstackAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    "content-type": "application/json",
    Authorization: `${managementToken}`,
    api_key: `${apiKey}`,
  },
});

// get all entries 
const allEntries = async () => {
  let options = {
    url: `v3/content_types/${ctUid}/entries`,
    method: "GET",
    json: true,
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response.data);
};

// update workflow stage to Email Campaign Sent
const stageCompleted = async (contentTypeUid, uid) => {
  let message = "Email Campaign delivered to recipients for this specific entry.";
  let options = {
    url: `v3/content_types/${contentTypeUid}/entries/${uid}/workflow`,
    method: "POST",
    data: {
      workflow: {
        workflow_stage: {
          uid: stageUid,
          comment: message,
        },
      },
    },
  };
  let result = await contentstackAxios(options);
  return Promise.resolve(result);
};

exports.handler = async (event) => {
  let body = JSON.parse(event.body);
  try {
    let entriesData = await allEntries();
    let result= entriesData.entries.filter((i)=>i.single_send_id === body[0].singlesend_id)
    await stageCompleted(ctUid, result[0].uid);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email Delivered !!" }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
