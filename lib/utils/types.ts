export type BaseResponseSuccess<T = null> = {
  success: true;
  message: string;
  data?: T;
};

export type BaseResponseFail = {
  success: false;
  message: string;
};

export type BaseResponse<T = null> = BaseResponseSuccess<T> | BaseResponseFail;
