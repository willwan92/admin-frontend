import { PageRequest } from './basic';

export interface QueryLogPageReq extends PageRequest {
  startDate: string;
  endDate: string;
  user?: string;
  type?: number | null;
  pri?: number | null;
  sip?: string;
  msg?: string;
}

export interface QueryLogRes {
  date: string;
  user: string;
  sip: string;
  pri: number;
  type: number;
  msg: string;
}
