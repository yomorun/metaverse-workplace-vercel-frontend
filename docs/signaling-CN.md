# 客户端信令文档

与 [Presence Server](https://github.com/yomorun/yomo-vhq-backend) 的交互信令文档，描述了 `控制信令` 和 `数据结构`

## 技术名词

- 作用：指用户的信息（用户名、头像）、状态（在线、离线、位置、位移事件）
- Interface：`wss://x.yomo.dev`
- 协议：目前是通过 `Socket.io` 框架（一种对 WebSocket 的封装），如果不适合 Unity，我们可以配合改成 Pure WebSocket 的方式

## 本文举例场景

本文描述场景：User `Bob` 上线后，开始将状态信息与已经在线的 User `Alice` 进行同步

### 1、Bob 鉴权后

对User展示类信息的描述，简化为 `{name: "USER_NAME", avatar: "https://user_avatar_image_url"}`，可以用各种方式登录，只要传输这两个 key 即可

### 2、Bob 上线 

涉及信令：
- Emit `online` to Presence Server

Bob 连接到 `wss://x.yomo.dev` 发送 `online` 事件，
数据结构为：`{ name: "Bob", avatar: “https://Bob_avatar_url” }`，
参考代码：[pages/index.js#L103](https://github.com/yomorun/yomo-vhq-nextjs/blob/b67cf2a106/pages/index.js#L103)

### 3、Alice 收到 Bob 的上线通知 

涉及信令：
- Receive `online` from Presence Server

Alice 收到 Bob 上线的通知，监听服务器事件 `online`，
参考代码：[pages/index.js#L51](https://github.com/yomorun/yomo-vhq-nextjs/blob/b67cf2a106/pages/index.js#L51)，
此时 Alice 可以开始维护自己的在线好友列表（比如好友网络的闪断等）

### 4、Alice 收到 ask 事件、发送 sync 事件

涉及信令：
- Receive `ask` from Presence Server
- Send `sync` to Presence Server

Alice 收到 `ask` 事件，该信令没有 Payload Data。
此时 Alice 要发送 `sync` 事件，上报自己当前的坐标，数据结构为：`{name: "Alice", pos: "{x: 10, y: 20}", avatar: "https://Alice_avatar_url" }`,
收到该事件后，参考代码：[components/me.js#L49](https://github.com/yomorun/yomo-vhq-nextjs/blob/b67cf2a106/components/me.js#L49)，

### 5、Bob 监听并收到 sync 事件

涉及信令：
- Receive `sync` from Presence Server

Bob 收到 `sync` 事件后，开始在 UI 界面上渲染，此时 Alice 开始出现在 Bob 的界面，坐标为`{x: 10, y: 20}`

### 6、Bob 按住键盘的 `w` ，进行向上移动

涉及信令
- Send `movement` to Presence Server

Bob 的键盘




