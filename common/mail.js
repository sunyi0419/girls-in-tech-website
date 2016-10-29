var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config        = require('../config');
var util          = require('util');
var logger = require('./logger');
var transporter     = mailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  if (config.debug) {
    return;
  }
  // 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
  transporter.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      logger.error(err);
    }
  });
};
exports.sendMail = sendMail;

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendActiveMail = function (who, token, name) {
  var from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to      = who;
  var subject = config.name + ' Activation';
  var html    = '<p>Hi, ' + name + '</p>' +
    '<p>We have received your register submission to ' + config.name + ', please follow this link to activate your account：</p>' +
    '<a href  = "' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">Activate Account</a>' +
    '<p>If you did not register at ' + config.name + ', please ignore this message</p>' +
    '<p>Welcome to ' + config.name + '!</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * 发送密码重置通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendResetPassMail = function (who, token, name) {
  var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
  var to = who;
  var subject = config.name + ' password reset';
  var html = '<p>Hi, ' + name + '</p>' +
    '<p>We have received your password reset request to ' + config.name + ', please follow this link to reset your password in 24 hours.</p>' +
    '<a href="' + SITE_ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">Reset Password</a>' +
    '<p>If you did not submit your password reset request at ' + config.name + ', please ignore this message</p>' +
    '<p>' + config.name + ' is be with you</p>';

  exports.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};
