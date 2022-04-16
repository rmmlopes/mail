/*
 * @adonisjs/mail
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="../../adonis-typings/mail.ts" />

import nodemailer from 'nodemailer'
import {
  MessageNode,
  SmtpMailResponse,
  SmtpDriverContract,
  SmtpConfig,
} from '@ioc:Adonis/Addons/Mail'

/**
 * Smtp driver to send email using smtp
 */
export class SmtpDriver implements SmtpDriverContract {
  private transporter: any

  constructor(config: SmtpConfig) {
    this.transporter = nodemailer.createTransport(config)
  }

  /**
   * Send message
   */
  public async send(message: MessageNode): Promise<SmtpMailResponse> {
    if (!this.transporter) {
      throw new Error('Driver transport has been closed and cannot be used for sending emails')
    }
    
    message.headers = this.convertHeadersToNodemailFormat(message.headers)
    
    return this.transporter.sendMail(message)
  }

  /**
   * Close transporter connection, helpful when using connections pool
   */
  public async close() {
    this.transporter.close()
    this.transporter = null
  }
  
  /**
   * nodemailer expects an object for headers, Adonis mailer uses an an array of objects
   *   headers: [ { 'x-test': 'teststr' }, { 'x-test': '1234' } ]  ===>
   *   headers: { 'x-test': [ 'teststr', '1234' ] }
   */
  public convertHeadersToNodemailFormat(headers) {
    if (headers) {
      var newHeaders = {}
      console.log(headers)
      for (var header of headers) {
        console.log(header)
        for (var headerKey in header) {
          if (!newHeaders[headerKey]) {
            newHeaders[headerKey] = []
          }
          if (header[headerKey] instanceof Array) {
            for (var headerListVal of header[headerKey]) {
              newHeaders[headerKey].push(headerListVal)
            }
          } else {
            newHeaders[headerKey].push(header[headerKey])
          }
        }
      }
      return newHeaders
    }
    return headers
  }
}
