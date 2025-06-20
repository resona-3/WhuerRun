# mod-info
Get the latest version update prompt of the node module (npm).

获取 node 模块最新版本更新提示

[![npm](https://img.shields.io/npm/v/mod-info.svg?style=flat)](https://www.npmjs.org/package/mod-info)
[![install size](https://packagephobia.com/badge?p=mod-info)](https://packagephobia.com/result?p=mod-info)
![node-current (tag)](https://img.shields.io/node/v/mod-info/latest)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/echosoar/mod-info/master/LICENSE)


<br />

## 使用

```bash
$ npm i mod-info --save
```

```ts

import mi from 'mod-info';

/*
@params module name <string>
@params module current version <string>
@params? config <IConfig> 详见类型定义

@return info <IResult> 详见类型定义
*/
const info = await mi('test-mode-info', '1.1.4');
/*
{
  update: true,     // 是否存在更新的版本
  version: '1.2.4'  // 更新的版本号
  tips: [           // 一些更新内容提示
    '一些更新内容提示'
  ]
}
*/
```
## 类型定义
### IConfig
```ts
type ILevelConfig = 'major' | 'minor' | 'patch';
interface IConfig {
  // 配置更新提示等级
  // 配置为 major 时只有发布更高 major 版本了才认为更新
  // 配置为 minor 时只有发布了相同 major 版本，且 minor 版本更高才认为更新
  // 配置为 patch 时只有发布了相同 major 和 minor 版本，且 patch 版本更高才认为更新
  // 默认值为 ['major', 'minor', 'patch']
  level?: ILevelConfig[];

  // 检测更新间隔，单位为 毫秒，默认为 24 * 60 * 60 * 1000，即一天内只检测一次
  timeout?: number;

  // 是否忽略非正式版本的更新，例如 1.2-beta.3 这种 beta 版本，默认为 true
  ignoreInformalVersion?: boolean;
}
```
### IResult
```ts
interface IResult {
  // 是否存在（当前检测规则 level 下的）最新版本
  update: boolean;

  // 如果存在最新版本，它的版本号是
  version: string;
  
  // 当前版本匹配到的 更新提示信息 列表
  tips: string[];
}
```

## 更新提示信息配置

在模块的 `package.json` 中通过 `module-info-tips` 可以配置 `更新提示信息`，使用 `mod-info` 检测版本时会获取到这些提示信息。

更新提示信息可以通过 `match` 和 `ignore` 两个字段来匹配或忽略在某些版本下提示，同时支持使用 `*` 或 `x` 来匹配任意版本，例如：

```json
{
  "name": "test-mode-info",
  "version": "1.2.4",
  "module-info-tips": [
    {
      "match": "0",
      "ignore": "0.1.*",
      "tip": "0.x tip"
    },
    {
      "match": ["1.2", "1.3"],
      "ignore": ["1.2.3"],
      "tip": "1.x tip"
    },
    {
      "match": "*",
      "ignore": "*.1",
      "tip": "x tip"
    }
  ]
}

```

---

MIT LICENSE

