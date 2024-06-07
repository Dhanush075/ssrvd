import { Injectable, Scope } from '@nestjs/common';
import { RequestContext } from '@skillmine-dev-public/auth-utils';


@Injectable({ scope: Scope.REQUEST })
export class RequestContextPreparationService {
  private context: RequestContext = <RequestContext>{};

  async prepareContext(req: any, res: any): Promise<RequestContext> {
    try {
      this.logIncomingRequest(req);
      this.context = new RequestContext(req, res);
      return Promise.resolve(this.context);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async logIncomingRequest(req: any) {
    try {
      // Do your logging here
    } catch (error) {}
  }

  getCurrentContext() {
    return this.context;
  }

 

 
}
