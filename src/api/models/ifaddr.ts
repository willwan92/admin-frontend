import { PageRequest } from './basic';
import { StatusEnum, SwitchEnum } from '@/enums/statusEnum';

export interface QueryIfaddrReq {
  ifname?: string;
  ip?: string;
}

export interface QueryIfaddrPageReq extends PageRequest {
  ifname?: string;
  ip?: string;
}

export interface QueryIfaddrRes {
  ifname: string;
  ip: string;
  netmask: string;
  ping: StatusEnum;
  admin: StatusEnum;
}

export interface AddIfaddrReq {
  ifname: string;
  ip: string;
  netmask: string;
  ping: SwitchEnum;
  admin: SwitchEnum;
}
