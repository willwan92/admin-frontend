import { PageRequest } from './basic';

export interface QuerySysrouteReq extends PageRequest {
  mask?: string;
  ip?: string;
  gwip?: string;
}

export interface SysrouteModel {
  id: number;
  ip: string;
  mask: string;
  gwip: string;
  metric: number;
}
