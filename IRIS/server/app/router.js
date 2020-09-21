'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 用户获取验证码路由
  router.get('/verification', controller.user.verification);
  // 用户上传文件路由
  router.post('/upload', controller.user.upload);
  // 用户注册路由
  router.post('/register', controller.user.register);
  // 用户登录路由
  router.post('/login', controller.user.login);
  // 用户创建漫画
  router.post('/carton', controller.carton.carton);
  // 用户查询所有漫画
  router.get('/carton', controller.carton.cartons);

  // 用户根据分类查询漫画
  router.get('/carton/category/:id', controller.carton.categoryCarton)
  // 根据访问量查询漫画
  router.get('/carton/views', controller.carton.viewsCarton);
  // 根据评论量查询漫画
  router.get('/carton/comments', controller.carton.comments);
  // 根据点赞量查询漫画
  router.get('/carton/likes', controller.carton.likes);
  // 根据是否原创筛选漫画
  router.get('/carton/create', controller.carton.create);
  // 根据是否完结筛选漫画
  router.get('/carton/finished', controller.carton.finished);
  // 根据更新时间筛选漫画
  router.get('/carton/updated', controller.carton.updated);
  // 根据关键字搜索漫画
  router.get('/carton/search/:key', controller.carton.search);
  // 用户点赞漫画
  router.post('/carton/like/:id', controller.carton.like);
  // 用户取消点赞漫画
  router.post('/carton/cancelLike/:id', controller.carton.cancelLike);
  // 用户根据漫画id查询漫画
  router.get('/carton/:id', controller.carton.getCarton);
};
