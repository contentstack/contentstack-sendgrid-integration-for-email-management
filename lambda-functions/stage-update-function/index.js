// Module dependency
const axios = require("axios");

const { baseUrl, contentTypeUid, apiKey, managementToken, workflowId } = process.env;

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
    url: `v3/content_types/${contentTypeUid}/entries`,
    method: "GET",
    json: true,
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response);
};

// get workflow stages
const getWorkflow = async () => {
  let options = {
    method: "GET",
    json: true,
    url: `v3/workflows/${workflowId}`,
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response);
};

// update workflow stage to Email Campaign Sent
const stageCompleted = async (uid, stageUid) => {
  let message = "Email Campaign delivered !!.";
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
    let result = entriesData.data.entries.filter((i) => i.single_send_id === body[0].singlesend_id);
    let workflowResponse = await getWorkflow();
    if (workflowResponse.status === 200) {
      let stageId = workflowResponse.data.workflow;
      await stageCompleted(result[0].uid, stageId.workflow_stages[2].uid);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email Delivered !!" }),
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
