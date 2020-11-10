// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

function getList(req: Request, res: Response) {
  const json = `{"success":true,"message":"操作成功！","code":0,"result":{"records":[{"mp3":"","createBy":"damu","createTime":"2019-11-08 01:08:35","updateBy":null,"updateTime":null,"id":"5aeae1ec0ede66a22d921b64cc2900a3","title":"pmp","picture":null,"status":null}],"total":1,"size":10,"current":1,"searchCount":true,"pages":1},"timestamp":1603869054582}`;
  const result = JSON.parse(json);
  return res.json(result);
}

function add(req: Request, res: Response) {
  const json = `{"success":true}`;
  const result = JSON.parse(json);
  return res.json(result);
}

function upload(req: Request, res: Response) {
  const result = { 'message': '/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png', 'result': 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' };
  return res.json(result);
}
export default {
  'GET /api/word/article/list': getList,

  'POST /api/sys/common/upload': upload,
  'POST /api/word/article/add': add,
};
