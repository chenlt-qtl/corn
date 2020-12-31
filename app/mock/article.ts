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

function queryById(req: Request, res: Response) {
  const result = {"success":true,"message":"操作成功！","code":0,"result":{"sentences":[],"article":{"id":"745f3188826d4db8634b035c0ad904ba","title":"123","mp3":"http://localhost:89/word/mp3/damu/20201221/1608535412875.mp3","picture":"http://localhost:89/word/img/damu/20201221/1608535402917.png","status":null,"createTime":"2020-12-21 15:23:37","createBy":"damu","updateTime":"2020-12-21 15:23:37","updateBy":"damu"}},"timestamp":1608693204056};
  return res.json(result);
}

export default {
  'GET /api/word/article/list': getList,

  'POST /api/sys/common/upload': upload,
  'POST /api/word/article/add': add,
  'GET /api/word/article/queryById': queryById,
  'PUT /api/word/article/edit': add,
};
