import config from '~/config';
import html2Canvas from 'html2canvas';

export function listToTree(list, node, parentNode) {
  let tree = [];
  let map = {};
  for (let i = 0, l = list.length; i < l; i++) {
    // 以每条数据的id作为obj的key值，数据作为value值存入到一个临时对象里面
    map[list[i][node]] = list[i];
  }
  //console.log('map',map)
  for (let i = 0, l = list.length; i < l; i++) {
    let key = map[list[i][parentNode]];
    //console.log('key',key)
    //循环每一条数据的pid，假如这个临时对象有这个key值，就代表这个key对应的数据有children，需要Push进去
    //如果这一项数据属于哪个数据的子级
    if (key) {
      // 如果这个数据没有children
      if (!key['children']) {
        key['children'] = [];
        key['children'].push(list[i]);
        // 如果这个数据有children
      } else {
        key['children'].push(list[i]);
      }
    } else {
      //如果没有这个Key值，就代表找不到属于哪个数据，那就代表没有父级,直接放在最外层
      tree.push(list[i]);
    }
  }
  return tree;
}
export function getCookie(cname) {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}
export function getTimeMmss(Date1, type, midFlag) {
  if (!Date1) return '';
  Date1 = new Date(Date1);
  var year = Date1.getFullYear();
  var month =
    Date1.getMonth() + 1 < 10
      ? '0' + (Date1.getMonth() + 1)
      : Date1.getMonth() + 1;
  var day = Date1.getDate() < 10 ? '0' + Date1.getDate() : Date1.getDate();
  var hour = Date1.getHours() < 10 ? '0' + Date1.getHours() : Date1.getHours();
  var minute =
    Date1.getMinutes() < 10 ? '0' + Date1.getMinutes() : Date1.getMinutes();
  var second =
    Date1.getSeconds() < 10 ? '0' + Date1.getSeconds() : Date1.getSeconds();
  if (type === 'hm') {
    return hour + (midFlag ? midFlag : ':') + minute;
  }
  if (type === 'hms') {
    return (
      hour +
      (midFlag ? midFlag : ':') +
      minute +
      (midFlag ? midFlag : ':') +
      second
    );
  }
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}

function checkHasJXTenant(list) {
  const JXTenantId = 2;
  for (let i = 0; i < list.length; i++) {
    if (list[i].tenantId === JXTenantId) {
      return true;
    }
  }
  return false;
}
export function initGlableFilters(app) {
  app.config.globalProperties.$filters = {
    dateFormat(dat) {
      if (!dat) return '--';
      dat = new Date(dat);
      //获取年月日，时间
      const year = dat.getFullYear();
      const mon =
        dat.getMonth() + 1 < 10
          ? '0' + (dat.getMonth() + 1)
          : dat.getMonth() + 1;
      const data = dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate();
      const hour = dat.getHours() < 10 ? '0' + dat.getHours() : dat.getHours();
      const min =
        dat.getMinutes() < 10 ? '0' + dat.getMinutes() : dat.getMinutes();
      const seon =
        dat.getSeconds() < 10 ? '0' + dat.getSeconds() : dat.getSeconds();
      return (
        year + '-' + mon + '-' + data + ' ' + hour + ':' + min + ':' + seon
      );
    },
  };
}
export const dateFormat = (dat) => {
  if (!dat) return '--';
  dat = new Date(dat);
  //获取年月日，时间
  const year = dat.getFullYear();
  const mon =
    dat.getMonth() + 1 < 10 ? '0' + (dat.getMonth() + 1) : dat.getMonth() + 1;
  const data = dat.getDate() < 10 ? '0' + dat.getDate() : dat.getDate();
  const hour = dat.getHours() < 10 ? '0' + dat.getHours() : dat.getHours();
  const min = dat.getMinutes() < 10 ? '0' + dat.getMinutes() : dat.getMinutes();
  const seon =
    dat.getSeconds() < 10 ? '0' + dat.getSeconds() : dat.getSeconds();
  return year + '-' + mon + '-' + data + ' ' + hour + ':' + min + ':' + seon;
};

export function jumpLinkHandler(url) {
  let currentEnv = import.meta.env.MODE;
  const envMap = {
    development: 'sit',
    sit: 'sit',
    uat: 'uat',
    prod: 'prod',
  };
  const target = `https://${envMap[currentEnv]}.rlinkiot.com${url}`;
  window.open(target, '_blank');
}
export function getUrlParams(url) {
  url = window.location.href;
  // 通过 ? 分割获取后面的参数字符串
  let urlStr = url.split('?')[1];
  if (!urlStr) return {};
  // 创建空对象存储参数
  let obj = {};
  // 再通过 & 将每一个参数单独分割出来
  let paramsArr = urlStr.split('&');
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    let arr = paramsArr[i].split('=');
    obj[arr[0]] = arr[1];
  }
  return obj;
}
// 拼接图片地址
export function buildImageUrl(id) {
  if (!id) return '';
  if (id.includes('/diyadmin')) return id;
  return `/diyadmin/download?fileId=${id}`;
}
// 拼接图片地址 - new
// const filePath = 'https://ossdiyphone.com/'
// const filePath = 'https://osscolgifts.com/'
const filePath = config[import.meta.env.MODE].filePath;
console.log('filePath', filePath);
export function buildImageUrlNew(id) {
  if (!id) return '';
  if (id.includes(filePath)) {
    return id;
  }
  if (id.includes('/diyadmin/download?fileId=')) {
    return id.replace('/diyadmin/download?fileId=', filePath);
  }
  return `${filePath}${id}`;
}
// 生成唯一的id
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 导出打印图
export const exportPrintImage = (domId, maskImages, width, height) => {
  const cavasDom = document.getElementById('myCanvasMax');
  cavasDom.width = `${width}`;
  cavasDom.height = `${height}`;
  let myCanvasMax = cavasDom.getContext('2d');
  return new Promise((resolve) => {
    html2Canvas(document.querySelector(`#${domId}`), {
      width,
      height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    }).then((canvas) => {
      let imageURL = canvas.toDataURL('image/png'); //canvas转base64图片
      let img = new Image();
      img.src = imageURL;
      img.onload = async () => {
        myCanvasMax.globalCompositeOperation = 'source-over';
        myCanvasMax.drawImage(img, 0, 0, width, height);
        // if (maskImages) {
        //   await drawSingleMax(myCanvasMax, maskImages, 'mask', width, height);
        // }
        // 设置黑边框
        // myCanvasMax.globalCompositeOperation = 'source-over';
        // myCanvasMax.strokeStyle = '#000000';
        // myCanvasMax.lineWidth = '2';
        // myCanvasMax.strokeRect(0, 0, width, height);
        const printUrl = await uploadPrintAndGetUrlMax();
        resolve(printUrl);
      };
    });
  });
};

function dataURItoBlob(base64Data) {
  var byteString;
  if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1]);
  else byteString = unescape(base64Data.split(',')[1]);
  var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
}

function uploadPrintAndGetUrlMax() {
  return new Promise((resolve) => {
    const finalData = document
      .getElementById('myCanvasMax')
      .toDataURL('image/png');
    const blob = dataURItoBlob(finalData);
    //组装formdata
    var fd = new FormData();
    fd.append('file', blob); //fileData为自定义
    fd.append('fileName', 'print'); //fileName为自定义，名字随机生成或者写死，看需求
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', '/diyadmin/upload');
    xmlHttp.send(fd);
    //ajax回调
    xmlHttp.onreadystatechange = (res) => {
      //todo  your code...
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        try {
          resolve(JSON.parse(xmlHttp.responseText).data);
        } catch (error) {}
      }
    };
  });
}
