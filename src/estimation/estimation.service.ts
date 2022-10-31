import { Injectable } from '@nestjs/common';
import { CreateEstimationDto } from './dto/create-estimation.dto';
import { UpdateEstimationDto } from './dto/update-estimation.dto';
import * as CryptoJS from 'crypto-js';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Estimation } from './entities/estimation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstimationService {
  private readonly SECRET_KEY: string;
  private readonly API_KEY: string;
  private readonly PASSPHRASE: string;
  constructor(
    @InjectRepository(Estimation)
    private readonly estimationRepository: Repository<Estimation>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.API_KEY = configService.get('API_KEY');
    this.SECRET_KEY = configService.get('SECRET_KEY');
    this.PASSPHRASE = configService.get('PASSPHRASE');
  }

  async executeSwap(UpdateEstimationDto: UpdateEstimationDto) {
    const { baseCcy, quoteCcy, side, sz, feeOfBelo } = UpdateEstimationDto;
    let quoteId: any = UpdateEstimationDto.quoteId;
    const amount = Number(sz) - (feeOfBelo * Number(sz)) / 100;
    try {
      const timestamp = new Date().toISOString();
      if (quoteId === '') {
        [quoteId] = await this.estimationRepository.find({
          skip: 0,
          take: 1,
          order: { id: 'DESC' },
        });
        quoteId = quoteId.quote_id;
      }
      const body = {
        baseCcy: baseCcy,
        quoteCcy: quoteCcy,
        side: side,
        sz: amount,
        szCcy: quoteCcy,
        quoteId: quoteId,
      };

      const sign = CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(
          timestamp +
            'POST' +
            '/api/v5/asset/convert/trade' +
            JSON.stringify(body),
          this.SECRET_KEY,
        ),
      );

      const response = await this.httpService.axiosRef
        .post('https://www.okx.com/api/v5/asset/convert/trade', body, {
          headers: {
            accept: 'application/json',
            'Content-type': 'application/json',
            'OK-ACCESS-KEY': this.API_KEY,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-TIMESTAMP': timestamp,
            'OK-ACCESS-PASSPHRASE': this.PASSPHRASE,
          },
        })
        .catch((error) => console.log(error.response));
      return response['data'];
    } catch (error) {
      console.log(error);
    }
  }

  async estimateQuote(createEstimationDto: CreateEstimationDto) {
    const { baseCcy, quoteCcy, requestForQuote, side, feeOfBelo } =
      createEstimationDto;
    const rfq =
      Number(requestForQuote) - (feeOfBelo * Number(requestForQuote)) / 100;
    const timestamp = new Date().toISOString();
    const body = {
      baseCcy: baseCcy,
      quoteCcy: quoteCcy,
      side: side,
      rfqSz: String(rfq),
      rfqSzCcy: quoteCcy,
    };

    const sign = this.createSign(
      'POST',
      '/api/v5/asset/convert/estimate-quote',
      body,
    );

    let response: any = await this.httpService.axiosRef
      .post('https://www.okx.com/api/v5/asset/convert/estimate-quote', body, {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          'OK-ACCESS-KEY': this.API_KEY,
          'OK-ACCESS-SIGN': sign,
          'OK-ACCESS-TIMESTAMP': timestamp,
          'OK-ACCESS-PASSPHRASE': this.PASSPHRASE,
        },
      })
      .catch((error) => console.log(error.response.data));

    response = response['data']['data'].map((element: any) => ({
      baseCurrency: element.baseCcy,
      baseSize: element.baseSz,
      priceOfBaseCurrency: element.cnvtPx,
      originAmount: element.origRfqSz,
      quoteCurrency: element.quoteCcy,
      quoteId: element.quoteId,
      side: element.side,
      expirateTime: element.ttlMs,
    }));

    try {
      const estimation = this.estimationRepository.create({
        quote_id: response[0].quoteId,
      });
      await this.estimationRepository.save(estimation);
    } catch (error) {
      console.log(error);
    }
    return {
      data: response[0],
      message: `Estimacion valida hasta los proximos ${
        response[0].expirateTime / 1000
      } segundos`,
    };
  }

  createSign(method: string, path: string, body: object) {
    const timestamp = new Date().toISOString();
    const sign = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        timestamp + method + path + JSON.stringify(body),
        this.SECRET_KEY,
      ),
    );
    return sign;
  }
}
