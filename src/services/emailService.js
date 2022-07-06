require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Mai Cong Thanh 👻" <maicongthanh45261@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "Thông tin đặt lịch khám bệnh ✔",
        html: getBodyHTMLEmail(dataSend),

    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào , ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này thì bạn đã đăng ký lịch hẹn khám bệnh online . </p>
        <p>Thông tin đặt lịch khám bệnh :</p>
        <div><b>Thời gian : ${dataSend.time} .</b></div>
        <div><b>Địa điểm : ${dataSend.addressClinic} .</b></div>
        <div><b>Bác sĩ : ${dataSend.doctorName} .</b></div>

        <p>Nếu các thông tin trên là đúng , vui lòng nhấn vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh .</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank" > Click here </a>
        </div>
        <div>Xin chân thành cảm ơn !</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear , ${dataSend.patientName}</h3>
        <p>If you have received this email, you have registered for an online medical appointment . </p>
        <p>Information to book a medical appointment :</p>
        <div><b>Time : ${dataSend.time}. </b></div>
        <div><b>Address : ${dataSend.addressClinic} .</b></div>
        <div><b>Doctor : ${dataSend.doctorName} .</b></div>
        
        <p>If the above information is correct, please click on the link below to complete the procedure to book an appointment .</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank" > Click here !</a>
        </div>
        <div>Sincerely thank !</div>
        `
    }
    return result
}

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Mai Cong Thanh 👻" <maicongthanh45261@gmail.com>',
        to: dataSend.email,
        subject: dataSend.language === 'vi' ? "Hóa đơn khám bệnh" : "Medical bills ",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imageBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]

    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào , ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này thì bạn đã hoàn thành xong lịch khám bệnh</p>
        <div><b>Thời gian : ${dataSend.timeDate}</b></div>
        <div><b>Bác sĩ : ${dataSend.doctorName}</b></div>        
        <p>Chúng tôi xin gửi bạn hóa đơn khám bệnh , thông tin hóa đơn và đơn thuốc bạn vui lòng xem dưới file đính kèm !</p>
        <div>Xin chân thành cảm ơn !</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
            <h3>Dear , ${dataSend.patientName} !</h3>
            <p>If you have received this email, you have completed your medical appointment</p>
            <div><b>Time : ${dataSend.timeDate}</b></div>
            <div><b>Doctor : ${dataSend.doctorName}</b></div>        
            <p>We would like to send you medical bills, bill information and prescriptions, please see the attached file below!</p>
            <div>Sincerely thank !</div>
        `
    }
    return result
}

let sendEmailForgotPassword = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Mai Cong Thanh 👻" <maicongthanh45261@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === 'vi' ? "Quên mật khẩu" : "Forgot password ",
        html: getBodyHTMLEmailForgotPassword(dataSend),

    });
}

let getBodyHTMLEmailForgotPassword = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <p>Vui lòng nhấn vào đường link bên dưới để thay đổi mật khẩu</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank" > Click here </a>
        </div>
        <div>Xin chân thành cảm ơn !</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `        
        <p>Please click on the link below to change your password</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank" > Click here !</a>
        </div>
        <div>Sincerely thank !</div>
        `
    }
    return result
}

module.exports = {
    sendSimpleEmail,
    sendAttachment,
    sendEmailForgotPassword
}