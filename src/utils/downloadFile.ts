/**
 * 根据文件url获取文件名
 * @param url 文件url
 */
function getFileName(url) {
  const num = url.lastIndexOf('/') + 1;
  let fileName = url.substring(num);
  //把参数和文件名分割开
  fileName = decodeURI(fileName.split('?')[0]);
  return fileName;
}

/**
 * 根据文件地址下载文件
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string;
  target?: '_self' | '_blank';
  fileName?: string;
}) {
  const link = document.createElement('a');
  link.href = url;
  link.target = target;

  if (link.download !== undefined) {
    link.download = fileName || getFileName(url);
  }

  if (document.createEvent) {
    const e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }

  if (url.indexOf('?') === -1) {
    url += '?download';
  }

  window.open(url, target);
}
