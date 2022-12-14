'use strict';

// 密码正则表达式
// 规则：8-16位字母、数字和特殊符号，至少三种字符的组合
const PWD_REGEXP =
  /^(?=.*[~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]])(?=.*[a-zA-Z])(?=.*\d)[~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]\w]{8,16}$/;

// MAC地址
// 规则：用`:`分隔。例如：87:89:90:54:12:30
const MAC_REGEXP = /^([0-9a-fA-F]{2})(([:][0-9a-fA-F]{2}){5})$/;

// 手机号正则表达式
const MOBILE_REGEXP = /^1[3-9]\d{9}$/;

// 浮点数表达式
const FLOAT_REGEXP = /^(-?\d+)(\.\d+)?$/;

// 整数表达式
const INT_REGEXP = /^\d+$/;

// 正整数表达式
const POSITIVE_INT_REGEXP = /^[1-9]\d*$/;

// IPv4 规则正则表达式
const IPV4_REGEXP =
  /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;

// IP/Mask 规则正则表达式，Mask可选值：8、16、24和32
const IPMASK_REGEXP =
  /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}(\/(8|16|24|32))?$/;

// IPv6 规则正则表达式
const IPV6_REGEXP =
  /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/;

// 域名正则表达式
// 域名规则：
// 1. 顶级域名由2-6位字母组成；
// 2. 其他级域名可由字母、数字和`-`组成，但是不能以`-`开头或结尾，长度范围1-63
// 3. 各级域名用`.`分隔
// const DOMAIN_REGEXP = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/ // IE浏览器不支持反向否定预查?<!
const DOMAIN_REGEXP = /^((?!-)[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,6}$/;

// 邮箱正则表达式
// 邮箱规则：
// 1. 邮箱域名部分规则，同域名规则；
// 2. 邮箱前缀规则：可由字母、数字和`_`和`.`组成，但是只能以字母和数字开头，长度范围2-32
// 3. 邮箱前缀和邮箱域名用`@`分隔
const EMAIL_REGEXP =
  /^[A-Za-z0-9][\w.]{1,31}@((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

export {
  PWD_REGEXP,
  MAC_REGEXP,
  MOBILE_REGEXP,
  FLOAT_REGEXP,
  INT_REGEXP,
  POSITIVE_INT_REGEXP,
  IPV4_REGEXP,
  IPMASK_REGEXP,
  IPV6_REGEXP,
  DOMAIN_REGEXP,
  EMAIL_REGEXP,
};
