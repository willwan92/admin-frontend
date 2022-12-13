import { http } from '@/utils/http/axios';

export function getFileData(url: string) {
  return http.request(
    {
      url,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
