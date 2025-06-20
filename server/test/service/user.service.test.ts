import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import { UserService } from '../../src/service/user.service';
// 如果你想使用 assert，保留这行
import * as assert from 'assert';
// 显式导入 Jest 的 expect 函数
import { expect } from '@jest/globals';

describe('test/service/user.service.test.ts', () => {
  let app: Application;
  let userService: UserService;

  beforeAll(async () => {
    // 创建应用
    app = await createApp<Framework>();
    // 获取用户服务实例
    userService = await app.getApplicationContext().getAsync<UserService>(UserService);
  });

  afterAll(async () => {
    await close(app);
  });

  // 测试获取用户信息方法
  it('should get user info correctly', async () => {
    // 模拟用户数据
    const mockUser = {
      userNo: 'test123456',
      avatarUrl: 'http://example.com/avatar.jpg',
      nickName: 'TestUser',
      countryCode: '86',
      mobileNumber: '13800138000',
      province: '广东省',
      city: '深圳市',
      area: '南山区',
      gender: 1,
    };

    // 调用方法获取用户信息
    const userInfo = userService.getUserInfo(mockUser as any);

    // 验证结果
    expect(userInfo).toBeDefined();
    expect(userInfo.userNo).toBe('test123456');
    expect(userInfo.nickName).toBe('TestUser');
    // 验证手机号是否被正确处理（部分隐藏）
    expect(userInfo.mobileNumber).toBe('138******00');
  });

  // 测试手机号码隐藏方法
  it('should mask mobile number correctly', () => {
    const mobileNumber = '13800138000';
    const maskedMobile = userService.getUnshowMobile(mobileNumber);
    expect(maskedMobile).toBe('138******00');
  });

  // 测试姓名隐藏方法
  it('should mask name correctly', () => {
    const name = '张三';
    const maskedName = userService.getUnshowName(name);
    expect(maskedName).toBe('张*');

    const longName = '张三丰';
    const maskedLongName = userService.getUnshowName(longName);
    expect(maskedLongName).toBe('张**');
  });

  // 测试通过用户编号查找用户
  it('should find user by userNo', async () => {
    // 使用 jest.spyOn 正确模拟 userModel.findOne 方法
    const mockUser = {
      id: 1,
      userNo: 'test123456',
      nickName: 'TestUser',
      mobileNumber: '13800138000',
    };
    
    // 确保 spyOn 正确设置并返回预期结果
    jest.spyOn(userService.userModel, 'findOne').mockResolvedValue(mockUser as any);

    const user = await userService.findByNo('test123456');
    expect(user).toBeDefined();
    expect(user.userNo).toBe('test123456');
    
    // 恢复原始实现，避免影响其他测试
    jest.restoreAllMocks();
  });
});