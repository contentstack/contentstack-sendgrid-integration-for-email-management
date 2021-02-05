// html template

function template(data){
  return `<!DOCTYPE html>

  <head>
    <title>Email Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 20px 0 30px 0">
            <table align="center" cellpadding="0" cellspacing="0" width="600"
              style="border-collapse: collapse; border: 1px solid #cccccc">
              <tr>
                <td 
                  background=${data.banner_group.background_image.url}
                  style="text-align:center;background-size:cover; background-position:top; height:400">
                  <table class="col-600" width="600" height="400" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td height="40"></td>
                      </tr>
                      <tr>
                      </tr>
                      <tr>
                        <td 
                          style=" text-align:center ;font-family: 'arial'; font-size:37px; color:#ffffff; line-height:24px;  letter-spacing: 4px;">
                          <img style="width:300px"
                            src=${data.banner_group.logo.url} />
                        </td>
                      </tr>
                      <tr>
                        <td 
                          style="text-align:center; font-family: 'arial', sans-serif; font-size:18px; color:#ffffff; line-height:24px; padding: 40px 30px 40px 30px">
                          ${data.banner_group.description}
                        </td>
                      </tr>
                      <tr>
                        <td height="50"></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td  style="background-color:#ffffff;padding: 40px 30px 40px 30px">
                  <table  cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse">
                    <tr>
                      <td style="color: #153643; font-family: Arial, sans-serif">
                        <h1 style="font-size: 24px; margin: 0">
                        ${data.content_body.heading}
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="
                            color: #153643;
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            line-height: 24px;
                            padding: 20px 0 11px 0;
                          ">
                        <img
                          src=${data.content_body.image.url}
                          alt="" width="100%" height="300" style="display: block" />
                        <p style="margin-top:28px">
                        ${data.content_body.description}
                        </p>
                        <a href=${data.cta.href}>
                        <button style="
                          background-color: #fa5c51;
                          border-radius:25px;
                          border: none;
                          color: white;
                          padding: 10px 18px;
                          text-decoration: none;
                          display: inline-block;
                          font-size: 13px;
                          cursor: pointer;
                        ">${data.cta.title}
                        </button></a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style=" background-color:#ee4c50 ;padding: 30px 30px">
                  <table  cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse">
                    <tr>
                      <td style="
                            color: #ffffff;
                            font-family: Arial, sans-serif;
                            font-size: 14px;
                            text-align:center;
                          ">
                        <p style="margin: 0">
                          &reg; Company 2021<br />
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    </html>`;
}

module.exports = {
  template,
};
