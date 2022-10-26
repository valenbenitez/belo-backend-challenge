import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstimationModule } from './estimation/estimation.module';

@Module({
  imports: [EstimationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
