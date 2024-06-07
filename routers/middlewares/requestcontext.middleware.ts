import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  Scope,
} from '@nestjs/common';
import { RequestContextPreparationService } from '../context/request/requestcontext.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private requestPreparation: RequestContextPreparationService) {}
  use(req: any, res: any, next: () => void) {
    if (this.requestPreparation) {
      this.requestPreparation
        .prepareContext(req, res)
        .then(d => {                                          
          next();
        })
        .catch(e => {
        
        });
    } else {
      next();
    }
  }
}
