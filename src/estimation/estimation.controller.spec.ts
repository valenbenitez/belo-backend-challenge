import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import { Repository } from 'typeorm';
import { Estimation } from './entities/estimation.entity';
import { EstimationController } from './estimation.controller';
import { EstimationModule } from './estimation.module';
import { EstimationService } from './estimation.service';

describe('EstimationController', () => {
  let controller: EstimationController;
  let estimationService: EstimationService;
  let estimationRepository: Repository<Estimation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          load: [configuration],
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: configuration().postgresConnection.type,
          host: configuration().postgresConnection.host,
          port: configuration().postgresConnection.port,
          username: configuration().postgresConnection.username,
          password: configuration().postgresConnection.password,
          database: configuration().postgresConnection.database,
          entities: [Estimation],
          synchronize: true,
        }),
        EstimationModule,
      ],
      controllers: [EstimationController],
      providers: [EstimationService],
    }).compile();

    estimationService = module.get<EstimationService>(EstimationService);

    controller = module.get<EstimationController>(EstimationController);
    estimationRepository = module.get<Repository<Estimation>>(
      'EstimationRepository',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should receive a fee', async () => {
    const result = await controller.estimateQuote({
      baseCcy: 'ETH',
      quoteCcy: 'USDT',
      requestForQuote: '50',
      side: 'buy',
      feeOfBelo: 8,
    });
    expect(result.message).toStrictEqual(
      'Estimacion valida hasta los proximos 10 segundos',
    );
  });
});
