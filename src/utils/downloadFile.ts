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
 * 下载文件
 * @param data
 * @param filename 文件名称
 * @returns
 */
export function download(data, filename, fileType = '') {
  if (!data) {
    return;
  }
  const fileBlob = new Blob([data], { type: fileType });
  if (navigator.msSaveBlob) {
    // for IE
    navigator.msSaveBlob(fileBlob, filename);
  } else {
    const url = window.URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
}

/**
 * 根据文件地址下载文件
 * @param {*} sUrl
 */
export function downloadByUrl({
  url}: {
  url: string;}) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('type','download');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
