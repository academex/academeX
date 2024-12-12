import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/access.decorator';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('/.well-known/assetlinks.json')
  deepLink() {
    return [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.AcademeX.app',
          sha256_cert_fingerprints: [
            '82:69:B0:DC:64:F1:4C:2E:5E:30:0B:B1:1F:05:2F:CE:79:F5:F1:E2:82:06:E6:8E:AD:59:87:4A:B7:D8:8B:C4',
          ],
        },
      },
    ];
  }
}
