import { Inject, Injectable, Logger } from '@nestjs/common';
//SERVICES
import { ISendEmail } from '../interfaces/sendEmail.interface';
import { Resend } from 'resend';
import { ConfigType } from '@nestjs/config';
import envConfig from 'config/env-config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly sender: string = '';
  private readonly apiKey: string = '';
  private readonly environment: string = '';
  private readonly defaultEmail: string = '';

  constructor(
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>
  ) {
    this.apiKey = this.configService.resendApiKey;
    this.sender = this.configService.emailSender;
    this.environment = this.configService.nodeEnv;
    this.defaultEmail = this.configService.defaultEmail;
    this.resend = new Resend(this.apiKey);
  }

  public async sendEmail(data: ISendEmail): Promise<any> {
    try {
      this.logger.log(`Email sent to: ${data.email}`);
      this.logger.log(`Sender: ${this.sender}`);
      const template = {
        from: this.sender,
        to: data.email,
        subject: data.subject,
        text: data.message,
      };
      if (this.environment !== 'production') {
        template.to = this.defaultEmail;
      }
      const result = await this.resend.emails.send(template);
      if (result.error) {
        this.logger.error(
          `Error sending email: ${JSON.stringify(result.error)}`
        );
      } else {
        this.logger.log(`Email sent with id: ${result.data.id}`);
      }
      return result;
    } catch (error) {
      const errorMsg = error.message ? error.message : error;
      this.logger.error(`Error sending email: ${errorMsg}`);
      throw new Error(error);
    }
  }
}
