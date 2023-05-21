// Import nodemailer
const nodemailer = require("nodemailer");
// Import user model form MongoDB
const databaseUser = require("../model/user.model.js");

/////////////////////////
/**
 * SMTP set-up
 **/
/////////////////////////

// Imports the Config of our email
const SMTP_CONFIG = require("../config/smtp.js");

// Creates the transport thats going to have the config necessary for nodemailer send the email
const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    pool: SMTP_CONFIG.pool,
    auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

/**
 * Sends and email to the Destination email to confirm to account
 * @param {String} destinationEmail The email of the destined user
 * @param {String} emailCode JSON web token
 *
 * trow error if email not send
 */
const sendConfirmEmail = async function (destinationEmail, emailCode) {
    try {
        await transporter.sendMail({
            from: SMTP_CONFIG.user,
            to: destinationEmail,
            subject: "Please confirm your account",
            html: `<!DOCTYPE html><html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><link 
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700;900&amp;display=swap" rel="stylesheet" type="text/css"><!--<![endif]--><style>
      *{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none} @media (max-width:720px){.social_block.desktop_hide .social-table{display:inline-block!important}.image_block img.big,.row-content{width:100%!important}.mobile_hide{display:none}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}
      </style></head><body style="background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none"><table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff;background-image:url(https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/BackgroundImg.png)"><tbody><tr><td><table 
      class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;border-radius:0;color:#000;width:700px" width="700"><tbody><tr><td class="column column-1" width="25%" 
      style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:middle;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="width:100%;padding-right:0;padding-left:0"><div class="alignment" align="center" style="line-height:10px"><img 
      src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/Logo_17.png" style="display:block;height:auto;border:0;width:129px;max-width:100%" width="129"></div></td></tr></table></td><td class="column column-2" width="75%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:middle;border-top:0;border-right:0;border-bottom:0;border-left:0">
      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="width:100%;padding-right:0;padding-left:0"><div class="alignment" align="center" style="line-height:10px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/Khajiit.png" 
      style="display:block;height:auto;border:0;width:238px;max-width:100%" width="238"></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#143951;background-size:auto"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" 
      style="mso-table-lspace:0;mso-table-rspace:0;background-size:auto;color:#000;width:700px" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-top:40px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" 
      style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:30px"><div style="font-family:Tahoma,Verdana,sans-serif"><div class style="font-size:12px;font-family:Roboto,Tahoma,Verdana,Segoe,sans-serif;mso-line-height-alt:14.399999999999999px;color:#fff;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px">
      <span style="font-size:30px;"><strong>Thank you for registering with our Game. We appreciate your interest and value your partnership.</strong></span></p></div></div></td></tr></table><table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px"><div 
      style="font-family:Tahoma,Verdana,sans-serif"><div class style="font-size:12px;font-family:Roboto,Tahoma,Verdana,Segoe,sans-serif;mso-line-height-alt:18px;color:#fff;line-height:1.5"><p style="margin:0;font-size:16px;text-align:center;mso-line-height-alt:24px"><span style="font-size:16px;">If you did not register for an account with us, please disregard this email.</span></p><p style="margin:0;font-size:16px;text-align:center;mso-line-height-alt:24px">
      <span style="font-size:16px;">If you have any questions or need further assistance, please don't hesitate to contact our support team.</span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" 
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px">&#8202;</div><table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" 
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="width:100%;padding-right:0;padding-left:0"><div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/Index-Tease.png" style="display:block;height:auto;border:0;width:700px;max-width:100%" width="700" alt="Enginemailer's editor" 
      title="Enginemailer's editor"></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px" width="700"><tbody><tr><td 
      class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:40px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="font-family:Tahoma,Verdana,sans-serif"><div class 
      style="font-size:14px;font-family:Roboto,Tahoma,Verdana,Segoe,sans-serif;mso-line-height-alt:16.8px;color:#fff;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="font-size:20px;"><strong>To complete the registration process, please confirm your email address by clicking on the following link:</strong></span></p></div></div></td></tr></table><table class="button_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" 
      role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><div class="alignment" align="center">
      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://localhost:3000/confirm/${emailCode}" style="height:48px;width:210px;v-text-anchor:middle;" arcsize="105%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
      <a href="http://localhost:3000/confirm/${emailCode}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:50px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:8px;padding-bottom:8px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;"><strong>Activate Account</strong></span></span></a>
      <!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#143951;background-size:auto"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" 
      style="mso-table-lspace:0;mso-table-rspace:0;background-size:auto;color:#000;width:700px" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:25px;padding-top:25px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="social_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" 
      style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad"><div class="alignment" align="center"><table class="social-table" width="104px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;display:inline-block"><tr><td style="padding:0 10px 0 10px"><a href="https://twitter.com/KhajiitOfficial" target="_blank"><img 
      src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/twitter@2x.png" width="32" height="32" alt="Twitter" title="Twitter" style="display:block;height:auto;border:0"></a></td><td style="padding:0 10px 0 10px"><a href="https://www.instagram.com/khajiitofficial/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/instagram@2x.png" width="32" height="32" alt="Instagram" 
      title="Instagram" style="display:block;height:auto;border:0"></a></td></tr></table></div></td></tr></table><table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="font-family:sans-serif"><div class style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.399999999999999px;color:#fff;line-height:1.2"><p
       style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="font-size:15px;"><strong>Our mailing address:</strong></span></p><p style="margin:0;mso-line-height-alt:14.399999999999999px">&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:18px"><em><span style="font-size:12px;"><strong>khajiit.business@gmail.com</strong></span></em></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>
      <!-- End --><div style="background-color:transparent;">
      </div></body></html>`,
        });
        return true;
    } catch (error) {
        return error;
    }
};

/**
 * This function resends the email to user
 * @param {String} username The User's username to search through the database
 * @param {*} response
 *
 * @returns Return a response that contains success:true
 */
const resendEmail = async function (username, response) {
    databaseUser
        .findOne({ username: username })
        .then((fetchedUser) => {
            if (!fetchedUser) {
                return response.send({ success: false, error: "User not found" });
            }
            sendConfirmEmail(fetchedUser.email, fetchedUser.confirmationCode);
            return response.send({ success: true });
        })
        .catch((sendError) => response.send({ success: false, error: `Occurred an error:\n${sendError}` }));
};

/**
 * Register the user on mongoDB database with its information
 * and sends a email with url token to confirm the email to able
 * to login
 *
 * @param   {*}  request
 * @param   {*}  response
 *
 **/
const verifyUser = async (request, response, next) => {
    // Searches the database for a user with this confirmation token
    databaseUser
        .findOne({
            confirmationCode: request.params.confirmationCode,
        })
        .then((fetchedUser) => {
            // If doesnt find a user on the Database sends error
            if (!fetchedUser) {
                return response.status(404).send({ message: "User Not found." });
            }

            // console.log(isAccountActive(fetchedUser.status))

            if (!isAccountActive(fetchedUser.status)) {
                // Changes the status to Active
                fetchedUser.status = "Active";
                // Saves the the changes made to the Database
                fetchedUser.save();

                response.render("index", {
                    isUserLogged: false,
                    showAccountCreated: true,
                    confirmstate: true,
                    showIndexOnUnauthenticated: false,
                    page: "debugOnlyText",
                    changeOnProfile: false,
                });
            } else {
                response.render("index", {
                    isUserLogged: false,
                    showAccountCreated: true,
                    confirmstate: false,
                    showIndexOnUnauthenticated: false,
                    page: "debugOnlyText",
                    changeOnProfile: false,
                });
            }
        })
        .catch((searchingError) => console.error(searchingError));
};

/**
 * This function serves to see if and account is currently
 * active or in pending status
 *
 * @param {String} userStatus The status of the user in the database
 *
 * @returns {Boolean} A boolean saying if the account is active or pending
 */
function isAccountActive(userStatus) {
    const confirmedEmail = "Active";
    return userStatus === confirmedEmail;
}

module.exports = { sendConfirmEmail, verifyUser, resendEmail, isAccountActive };
