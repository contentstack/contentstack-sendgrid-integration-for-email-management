// Module Dependency

const axios = require("axios");
let minify = require("html-minifier").minify;
const emailBody = require("./template/template");

const { managementToken, baseUrl, sendGridBaseUrl, sendGridAPIKey, stageUid, userId, unSubscribeId } = process.env;

//axios instances
const contentstackAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    "content-type": "application/json",
    Authorization: `${managementToken}`,
  },
});

const sendGridAxios = axios.create({
  baseURL: sendGridBaseUrl,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${sendGridAPIKey}`,
  },
});

//update workflow stage
const updateWorkFlowStage = async (contentTypeUid, uid, id) => {
  let message = `Review Email template for Marketing Campaign ,
                link: https://mc.sendgrid.com/single-sends/${id}/editor`;
  let options = {
    url: `v3/content_types/${contentTypeUid}/entries/${uid}/workflow`,
    method: "POST",
    data: {
      workflow: {
        workflow_stage: {
          uid: stageUid,
          assigned_to: [
            {
              uid: userId,
            },
          ],
          comment: message,
          notify: true,
        },
      },
    },
    json: true,
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response.data);
};

//updateEntry with single-send id
const updateEntry = async (contentTypeUid, uid, id) => {
  let options = {
    url: `v3/content_types/${contentTypeUid}/entries/${uid}`,
    method: "PUT",
    data: {
      entry: {
        single_send_id: `${id}`,
      },
    },
    json: true,
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response);
};

//create single-send
const createSingleSend = async (emailDetail, template) => {
  let receiptId = [];
  emailDetail.data.entry.email_details.send_to.map((item) => {
    receiptId.push(item.id);
  });
  let options = {
    url: `v3/marketing/singlesends`,
    method: "post",
    data: {
      name: `${emailDetail.data.entry.title}`,
      send_to: {
        list_ids: receiptId,
      },
      email_config: {
        subject: `${emailDetail.data.entry.email_details.email_subject}`,
        html_content: template,
        sender_id: emailDetail.data.entry.email_details.from[0].id,
        suppression_group_id: parseInt(unSubscribeId),
      },
    },
  };
  let response = await sendGridAxios(options);
  return Promise.resolve(response);
};

//update existing single-send
const updateSingleSend = async (emailDetail, template, id) => {
  let receiptId = [];
  emailDetail.data.entry.email_details.send_to.map((item) => {
    receiptId.push(item.id);
  });
  let options = {
    url: `v3/marketing/singlesends/${id}`,
    method: "patch",
    data: {
      name: `${emailDetail.data.entry.title}`,
      send_to: {
        list_ids: receiptId,
      },
      email_config: {
        subject: `${emailDetail.data.entry.email_details.email_subject}`,
        html_content: template,
        sender_id: emailDetail.data.entry.email_details.from[0].id,
      },
    },
  };
  let response = await sendGridAxios(options);
  return Promise.resolve(response);
};

//create new single-send
const mainHandler = async (entryData) => {
  let emailTemplate = await emailBody.template(entryData.data.entry);
  let result = await minify(emailTemplate, {
    removeAttributeQuotes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
  });
  let res = await createSingleSend(entryData, result);
  if (res.status === 201) {
    await updateWorkFlowStage(entryData.data.content_type.uid, entryData.data.entry.uid, res.data.id);
    await updateEntry(entryData.data.content_type.uid, entryData.data.entry.uid, res.data.id);
  }
};

//update existing single send
const updateHandler = async (eventData) => {
  let emailTemplate = await emailBody.template(eventData.data.entry);
  let result = await minify(emailTemplate, {
    removeAttributeQuotes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
  });
  if (eventData.data.entry.single_send_id !== null || eventData.data.entry.single_send_id !== "") {
    await updateSingleSend(eventData, result, eventData.data.entry.single_send_id);
  }
};

exports.handler = async (event) => {
  let body = JSON.parse(event.body);
  try {
    contentstackAxios.interceptors.request.use(
      (config) => {
        if (body.api_key) {
          config.headers["api_key"] = body.api_key;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    if (body.data.entry.single_send_id === "" || body.data.entry.single_send_id === null) {
      await mainHandler(body);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Template Generated !!",
        }),
      };
    } else if (body.data.entry.single_send_id !== "" || body.data.entry.single_send_id !== null) {
      await updateHandler(body);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Template Updated !!",
        }),
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
      }),
    };
  }
};
