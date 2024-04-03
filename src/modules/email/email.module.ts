import { Module, Global } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { ConfigDataModule } from 'config/config-data.module';

@Global()
@Module({
  imports: [ConfigDataModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
