import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimationDto } from './create-estimation.dto';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateEstimationDto extends PartialType(CreateEstimationDto) {
  @IsString({ message: 'Base currency should be a string' })
  @Length(3, 4, {
    message: 'baseCcy and quoteCcy must be between 3 or 4 characters in length',
  })
  baseCcy: string;

  @IsString({ message: 'Quote currency should be a string' })
  @Length(3, 4, {
    message: 'baseCcy and quoteCcy must be between 3 or 4 characters in length',
  })
  quoteCcy: string;

  @IsString({ message: 'side should be a string' })
  @IsEnum(['buy', 'sell'])
  side: string;

  @IsString({ message: 'amount should be a string' })
  sz: string;

  @IsOptional()
  @IsString({ message: 'quote id should be a string' })
  quoteId?: string;

  @IsNumber({}, { message: 'the fee must be a number' })
  feeOfBelo: number;
}
