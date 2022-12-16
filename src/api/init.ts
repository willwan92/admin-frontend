import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
    code: number;
    message: string;
    result: T;
}

export interface BasicPageParams {
    pageNumber: number;
    pageSize: number;
    total: number;
}
/**
 *
 * @description：新增管理卡
 */
export function addCardRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard`,
            method: 'POST',
            data: params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
 *
 * @description：管理卡认证(登录)
 */
export function cardLoginRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard/auth`,
            method: 'POST',
            data: params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
 *
 * @description：管理卡登录
 */
 export function cardLoginOneRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard/authone`,
            method: 'POST',
            data: params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：管理卡退出登录
*/
export function cardLogoutRequest() {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard/logout`,
            method: 'POST'
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：管理卡修改密码
*/
export function editCardPasswordRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard/password`,
            method: 'PATCH',
            data: params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：管理卡算法自检
*/
export function checkCardRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard/checkcard`,
            method: 'PATCH',
            data: params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
 *
 * @description：获取管理卡列表
 */
 export function getCardList(params) {
    let paramsStr = '';
    for(let key in params){
      if(params[key]){
        paramsStr += key+'='+params[key]+'&'
      }
    }
    return http.request<BasicResponseModel>(
      {
        url: `/mngcard?${paramsStr}`,
        method: 'GET'
      },
      {
        isTransformResponse: false,
      }
    );
  }




/**
*
* @description：设备密钥初始化
*/
export function initSecretKeyRequest() {
    return http.request<BasicResponseModel>(
        {
            url: `/initKey`,
            method: 'POST'
        },
        {
            isTransformResponse: false,
        }
    );
}

/**
*
* @description：证书初始化
*/
export function initCaRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/initCa`,
            method: 'POST',
            data:params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：获取证书信息
*/
export function getCaInfoRequest() {
    return http.request<BasicResponseModel>(
        {
            url: `/cacert/show`,
            method: 'get'
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：导入证书
*/
export function importCaRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/importCa`,
            method: 'POST',
            data:params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：生成私钥与证书
*/
export function createCertRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/createCert`,
            method: 'POST',
            data:params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：获取SM2证书列表
*/
export function getSm2ListRequest(params) {
    let paramsStr = '';
    for(let key in params){
        if(params[key]){
        paramsStr += key+'='+params[key]+'&'
        }
    }
    return http.request<BasicResponseModel>(
        {
            url: `/sm2cert/show?${paramsStr}`,
            method: 'get'
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：删除证书
*/
export function deleteCaRequest(name) {
    return http.request<BasicResponseModel>(
        {
            url: `/delcert/${name}`,
            method: 'delete'
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：吊销证书
*/
export function revocationCaRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/revoke`,
            method: 'POST',
            data:params
        },
        {
            isTransformResponse: false,
        }
    );
}

/**
*
* @description：发布吊销列表
*/
export function releaseRevocationRequest(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/releasecrl`,
            method: 'POST',
            data:params
        },
        {
            isTransformResponse: false,
        }
    );
}
/**
*
* @description：导入SM2证书
*/
export function importSm2Request(params) {
    return http.request<BasicResponseModel>(
        {
            url: `/importSm2`,
            method: 'POST',
            data:params
        },
        {
            isTransformResponse: false,
        }
    );
}

/**
*
* @description：获取证书信息
*/
export function getRevocationInfoRequest() {
    return http.request<BasicResponseModel>(
        {
            url: `/crlcert/show`,
            method: 'get'
        },
        {
            isTransformResponse: false,
        }
    );
}

/**
*
* @description：获取初始化进度
*/
export function getInitProgressRequest() {
    return http.request<BasicResponseModel>(
        {
            url: `/initprogress`,
            method: 'get'
        },
        {
            isTransformResponse: false,
        }
    );
}
