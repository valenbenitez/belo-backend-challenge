import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EstimationService } from './estimation.service';
import { CreateEstimationDto } from './dto/create-estimation.dto';
import { UpdateEstimationDto } from './dto/update-estimation.dto';

@Controller('convert')
export class EstimationController {
  constructor(private readonly estimationService: EstimationService) {}

  @Post('execute')
  executeQuote(@Body() updateEstimationDto: UpdateEstimationDto) {
    return this.estimationService.executeSwap(updateEstimationDto);
  }

  @Post('estimate')
  estimateQuote(@Body() createEstimationDto: CreateEstimationDto) {
    return this.estimationService.estimateQuote(createEstimationDto);
  }
}
