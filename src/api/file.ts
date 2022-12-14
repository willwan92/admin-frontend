import { http } from '@/utils/http/axios';
import { ResponseType } from 'axios';

export function getFileData(url: string, type: ResponseType = 'text') {
  return http.request(
    {
      url,
      method: 'GET',
      responseType: type,
    },
    {
      isTransformResponse: false,
    }
  );
}
