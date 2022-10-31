import { IsEnum, IsNumber, IsString, Length } from 'class-validator';

export class CreateEstimationDto {
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

  @IsString({ message: 'RFQ amount should be a string' })
  requestForQuote: string;

  @IsString({ message: 'side should be a string' })
  @IsEnum(['buy', 'sell'])
  side: string;

  @IsNumber({}, { message: 'the fee must be a number' })
  feeOfBelo: number;
}
