import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import * as assert from 'assert';

describe('test/controller/admin/user.controller.test.ts', () => {
  let app: Application;
  let adminToken: string; // 用于存储管理员登录后的token

  beforeAll(async () => {
    // 创建应用
    app = await createApp<Framework>();

    // 管理员登录获取token
    // 注意：这里需要使用有效的管理员账号密码
    const loginRes = await createHttpRequest(app)
      .post('/admin/login')
      .send({
        adminName: 'admin', // 使用测试环境中存在的管理员账号
        adminPwd: 'admin123', // 使用测试环境中存在的管理员密码
        verifyCode: '123123', // 假设验证码固定为123123
        no: 'testno'
      });

    // 从响应中获取token
    adminToken = loginRes.body.data?.token || '';
  });

  afterAll(async () => {
    await close(app);
  });

  // 测试获取用户列表
  it('should get user list', async () => {
    // 发送请求获取用户列表
    const result = await createHttpRequest(app)
      .get('/admin/user/list')
      .query({
        current: 1,
        pageSize: 10
      })
      .set('Cookie', [`token=${adminToken}`]); // 设置token cookie

    // 验证响应
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(Array.isArray(result.body.data.data)).toBe(true);
  });

  // 测试根据手机号查询用户
  it('should search user by mobile number', async () => {
    const mobileNumber = '138'; // 使用部分手机号进行模糊查询

    const result = await createHttpRequest(app)
      .get('/admin/user/list')
      .query({
        current: 1,
        pageSize: 10,
        mobileNumber
      })
      .set('Cookie', [`token=${adminToken}`]);

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    
    // 验证返回的用户手机号包含查询的部分号码
    if (result.body.data.data.length > 0) {
      const users = result.body.data.data;
      const hasMatchingUser = users.some((user: any) => 
        user.mobileNumber.includes(mobileNumber)
      );
      expect(hasMatchingUser).toBe(true);
    }
  });

  // 测试更新用户状态
  it('should update user status', async () => {
    // 注意：这个测试需要数据库中存在对应的测试数据
    // 假设有一个测试用户编号
    const testUserNo = 'test123456';

    const result = await createHttpRequest(app)
      .put('/admin/user/status')
      .send({
        userNo: testUserNo,
        status: 1 // 启用状态
      })
      .set('Cookie', [`token=${adminToken}`]);

    expect(result.status).toBe(200);
    expect(result.body.code).toBe(200);
    expect(result.body.msg).toBe('更新状态成功');
  });

  // 测试无权限访问（演示账户）
  it('should reject demo account from viewing user info', async () => {
    // 直接模拟请求处理过程中的ctx对象
    jest.spyOn(app, 'createAnonymousContext').mockImplementation(() => {
      const ctx = app.createAnonymousContext();
      ctx.adminInfo = { isDemo: true };
      return ctx;
    });
  
    const result = await createHttpRequest(app)
      .get('/admin/user/list')
      .query({
        current: 1,
        pageSize: 10
      })
      .set('Cookie', [`token=${adminToken}`]);
  
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(1000); // 错误码
    expect(result.body.msg).toBe('演示账户无权查看用户信息');
    
    // 恢复原始实现
    jest.restoreAllMocks();
  });
});