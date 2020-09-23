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
  // 用户退出登录路由
  router.post('/logout', controller.user.logout)
  // 查询用户的登录状态
  router.get('/loginStatus', controller.user.getStatus);

  // 有关用户的路由
  // 查询所有用户
  router.get('/user', controller.user.user);
  //查询单个用户
  router.get('/user/:uid', controller.user.getUser);
  // 修改用户信息
  router.post('/user', controller.user.modifyUser);


  // 关于用户评论路由
  // 创建评论
  router.post('/comment', controller.comment.comment);
  // 根据漫画id查找评论
  router.get('/cartonComments/:id', controller.comment.cartonComments);

  // 关于分类
  // 查询所有分类
  router.get('/category', controller.category.categories)

  // 大文件上传路由
  router.post('/uploadBig', controller.user.uploadBig);

  // 关于漫画的路由
  // 用户创建漫画
  // router.post('/carton', controller.carton.carton);
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
  // 根据二级筛选漫画 分类和完结
  router.get('/carton/screen', controller.carton.screen)
  // 根据用户发表漫画查询
  router.get('/carton/publish/:uid', controller.carton.publish)
  // 根据关键字搜索漫画
  router.get('/carton/search/:key', controller.carton.search);
  // 用户点赞漫画
  router.post('/carton/like/:id', controller.carton.like);
  // 用户取消点赞漫画
  router.post('/carton/cancelLike/:id', controller.carton.cancelLike);
  // 用户关注漫画
  router.post('/carton/followCarton/:id', controller.carton.followCarton);
  // 用户取消关注漫画
  router.post('/carton/cancelFollow/:id', controller.carton.cancelFollow);
  // 获取用户关注漫画
  router.get('/carton/userFollow', controller.carton.userFollow);
  // 用户根据漫画id查询漫画
  router.get('/carton/:id', controller.carton.getCarton);
};
