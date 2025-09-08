import { HttpInterceptorFn } from '@angular/common/http';

export const interceptInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: 'Token oveGnMPR637hF3ljIJpeX1jzkc3Oq39FXtqSyKEH',
      apikey: '1',
      companyid: '1',
      timezone: 'Asia/Calcutta'
    }
  });
  return next(clonedReq);
};
