import { Module } from '@nestjs/common';
import { EstimationService } from './estimation.service';
import { EstimationController } from './estimation.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimation } from './entities/estimation.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Estimation])],
  controllers: [EstimationController],
  providers: [EstimationService],
})
export class EstimationModule {}
