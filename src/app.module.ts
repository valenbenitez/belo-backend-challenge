import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstimationModule } from './estimation/estimation.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    EstimationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
