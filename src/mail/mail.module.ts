import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import 'dotenv/config';
import { join } from 'path';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Gmail SMTP server
        port: 465,         // SSL port
        secure: true,     // must be false for 587
        auth: {
          user: process.env.GMAIL_USER, // Your Gmail address (e.g., example@gmail.com)
          pass: process.env.GMAIL_PASS, // App password or Gmail password
        },
      },
      defaults: {
        from: 'Online Bank <luckyblaqy@gmail.com>', // Replace with your Gmail address
      },
      template: {
        dir: join(process.cwd(), 'mail-templates'), // Path to your email templates
        adapter: new HandlebarsAdapter(), // Use Handlebars adapter
        options: {
          strict: true, // Throws if a variable is not found in the context
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
