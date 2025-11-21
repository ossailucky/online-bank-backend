import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';



@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordReset(to: string, url: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Reset Your Password',
        text: 'Click the link to reset your password.',
        template: 'password-reset',
      context: {
        name,
        url,
      }
      });
    } catch (error) {
      throw new HttpException(error.message || 'Email sending failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
