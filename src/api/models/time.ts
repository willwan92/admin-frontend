import { StatusEnum } from '@/enums/statusEnum';

export interface TimeServerConf {
  server: string;
  period: number;
  start: StatusEnum;
}

export interface QuerySysTimeRes {
  time: string;
}

export interface SetSysTimeReq {
  date: string;
  time: string;
}
