import { Module } from '@nestjs/common';
import { EstimationService } from './estimation.service';
import { EstimationController } from './estimation.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EstimationController],
  providers: [EstimationService],
})
export class EstimationModule {}
