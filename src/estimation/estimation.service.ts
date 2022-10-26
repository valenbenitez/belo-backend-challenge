import { Injectable } from '@nestjs/common';
import { CreateEstimationDto } from './dto/create-estimation.dto';
import { UpdateEstimationDto } from './dto/update-estimation.dto';
import * as CryptoJS from 'crypto-js';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EstimationService {
  constructor(private readonly httpService: HttpService) {}
  async create(createEstimationDto: CreateEstimationDto) {
    const timestamp = new Date().toISOString();
    const secretKey = '8BD2A2F9F8022FF5861BCAFB6866EC00';
    const apiKey = '9db5af74-ccee-4341-857e-5c0030759dc3';
    const passphrase = '1139279449Valen*';
    const sign = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        timestamp + 'GET' + '/api/v5/asset/balances',
        secretKey,
      ),
    );
    const response = await this.httpService.axiosRef
      .get('https://www.okx.com/api/v5/asset/balances', {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          'OK-ACCESS-KEY': apiKey,
          'OK-ACCESS-SIGN': sign,
          'OK-ACCESS-TIMESTAMP': timestamp,
          'OK-ACCESS-PASSPHRASE': passphrase,
        },
      })
      .catch((error) => console.log(error.response.data));
    console.log(response['data']);
    return 'Respuesta';
  }

//base currency = 

  async findAll() {
    const timestamp = new Date().toISOString();
    const secretKey = '8BD2A2F9F8022FF5861BCAFB6866EC00';
    const apiKey = '9db5af74-ccee-4341-857e-5c0030759dc3';
    const passphrase = '1139279449Valen*';
    const body = {
      baseCcy: 'BTC',
      quoteCcy: 'USDT',
      side: 'sell',
      rfqSz: '30',
      rfqSzCcy: 'USDT',
    };
    const sign = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        timestamp +
          'POST' +
          '/api/v5/asset/convert/estimate-quote' +
          JSON.stringify(body),
        secretKey,
      ),
    );
    const response = await this.httpService.axiosRef
      .post('https://www.okx.com/api/v5/asset/convert/estimate-quote', body, {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          'OK-ACCESS-KEY': apiKey,
          'OK-ACCESS-SIGN': sign,
          'OK-ACCESS-TIMESTAMP': timestamp,
          'OK-ACCESS-PASSPHRASE': passphrase,
        },
      })
      .catch((error) => console.log(error.response.data));
    return response['data'];
  }

  findOne(id: number) {
    return `This action returns a #${id} estimation`;
  }

  update(id: number, updateEstimationDto: UpdateEstimationDto) {
    return `This action updates a #${id} estimation`;
  }

  remove(id: number) {
    return `This action removes a #${id} estimation`;
  }
}
