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
 * @description：管理卡登录
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
* @description：管理卡退出登录
*/
export function cardLogoutRequest() {
    return http.request<BasicResponseModel>(
        {
            url: `/mngcard/password`,
            method: 'POST'
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
