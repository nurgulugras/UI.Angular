import { Injectable, Injector } from '@angular/core';
import { EnvironmentConfigService } from './environment-config.service';
import { AuthToolService } from '../AuthToolService';

/* APP ayağa kalkmadan önce yüklenecek tanımlamalar */

@Injectable({
  providedIn: 'root'
})
export class InitConfigsService {

  constructor(private environmentConfigService: EnvironmentConfigService, private injector: Injector) { }

  load() {
    return new Promise<boolean>((resolve) => {

      // önce konfigler okunması gerekiyor.
      this.environmentConfigService.loadConfig().subscribe(() => {

        // konfigler okunduktan sonra servisler oluturuluyor.
        var authToolService = this.injector.get(AuthToolService);

        let promiseList: any[] = [];

        if (authToolService.isLoggedIn()) {
          // n tane servis promise şekliyle alınabilir
        }

        if (promiseList.length > 0) {
          // tüm promislerin işi bittikten sonra resolve yapılır ve uygulama açılır.
          Promise.all([promiseList]).then((values) => {
            resolve(true);
          });
        } else {
          resolve(true);
        }

      });

    });
  }

}
