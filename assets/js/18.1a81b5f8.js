(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{810:function(t,s,a){"use strict";a.r(s);var e=a(112),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("center",[a("h1",[t._v("K8s 提权漏洞 CVE-2018-1002105 学习")])]),t._v(" "),a("hr"),t._v(" "),a("blockquote",[a("p",[t._v("以下内容为自己个人的学习笔记，因此内容不会多么详实；其中有些内容也许会存在错误，如有错误欢迎留言处指出，还望谅解。")])]),t._v(" "),a("h1",{attrs:{id:"_0x00-前言"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_0x00-前言"}},[t._v("#")]),t._v(" 0x00 前言")]),t._v(" "),a("p",[t._v("CVE-2018-1002105 是一个 k8s 提权漏洞，该漏洞允许攻击者在拥有 pod 权限的情况下，提升至 API Server 权限，当拥有  API Server 权限后，也就不难逃逸到宿主机了。")]),t._v(" "),a("p",[t._v("该漏洞的 CVSS 3.x 评分为 9.8 分，受影响版本如下：")]),t._v(" "),a("p",[t._v("Kubernetes v1.0.x-1.9.x\nKubernetes v1.10.0-1.10.10 (fixed in v1.10.11)\nKubernetes v1.11.0-1.11.4 (fixed in v1.11.5)\nKubernetes v1.12.0-1.12.2 (fixed in v1.12.3)")]),t._v(" "),a("p",[t._v("在开始学习该漏洞之前，需要先了解一下 WebSocket，WebSocket 是一种网络传输协议，位于 OSI 模型的应用层，和 HTTP 协议一样依赖于传输层的 TCP 协议。")]),t._v(" "),a("p",[t._v("为了实现和 HTTP 的兼容性，WebSocket 握手使用 HTTP 的 Upgrade 头，即表示从 HTTP 协议改成 WebSocket 协议，以下是一个简单的 WebSocket 握手请求。")]),t._v(" "),a("p",[t._v("客户端请求：")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("GET /chat HTTP/1.1\nHost: server.example.com\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\nOrigin: http://example.com\nSec-WebSocket-Protocol: chat, superchat\nSec-WebSocket-Version: 13\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br")])]),a("p",[t._v("服务端响应：")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\nSec-WebSocket-Protocol: chat\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br")])]),a("p",[t._v("在客户端的请求中，"),a("code",[t._v("Connection: Upgrade")]),t._v(" 表示客户端希望升级协议，"),a("code",[t._v("Upgrade: WebSocket")]),t._v(" 表示希望升级到 WebSocket 协议。")]),t._v(" "),a("h1",{attrs:{id:"_0x01-漏洞分析"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_0x01-漏洞分析"}},[t._v("#")]),t._v(" 0x01 漏洞分析")]),t._v(" "),a("p",[t._v("这里以 k8s v1.11.1 版本为例，代码地址：https://github.com/kubernetes/kubernetes/archive/refs/tags/v1.11.1.tar.gz")]),t._v(" "),a("p",[t._v("在进行漏洞分析之前，可以先通过下图去了解一下客户端向 pod 执行命令的流程")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994371.png"}}),t._v(" "),a("p",[t._v("通过这张图不难看出，当客户端向 Node 节点里的 Pod 发送指令时，会先经过 API Server，再到 Kubelet，CVE-2018-1002105 漏洞也是存在于这个流程中，下面先来看看 API Server 的代码，再看看 Kubelet 的代码。")]),t._v(" "),a("h2",{attrs:{id:"api-server-代码分析"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#api-server-代码分析"}},[t._v("#")]),t._v(" API Server 代码分析")]),t._v(" "),a("p",[t._v("先找到 staging/src/k8s.io/apimachinery/pkg/util/proxy/upgradeaware.go 文件，upgradeaware.go 用来处理 API Server 的代理逻辑，在 upgradeaware.go 的 185 行有个 ServerHTTP 函数")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994385.png"}}),t._v(" "),a("p",[t._v("在 187 行可以看到，ServerHTTP 函数调用了 tryUpgrade 函数，漏洞就存在于这个函数中，该函数位于 upgradeaware.go 的第 236行，下面就来分析一下这个函数。")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994397.png"}}),t._v(" "),a("p",[t._v("在  tryUpgrade 函数中，首先调用了 IsUpgradeRequest 函数")]),t._v(" "),a("p",[t._v("IsUpgradeRequest 函数会判断 HTTP 的请求包中是否存在"),a("code",[t._v("Connection: Upgrade")]),t._v("，即判断该请求是否想要升级，如果存在就会返回 True")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994407.png"}}),t._v(" "),a("p",[t._v("接着回到刚才的 tryUpgrade 函数，在 tryUpgrade函数判断协议需要升级之后，建立了与后端服务器的连接")]),t._v(" "),a("img",{attrs:{width:"1400",src:"/img/1649994415.png"}}),t._v(" "),a("p",[t._v("接着 tryUpgrade 函数进行了 HTTP Hijack 操作，简单的说，就是这里程序没有将 HTTP 连接交给 Go 内置的处理流程，而是自己在 TCP 的基础上进行了 HTTP 交互，这是从 HTTP 升级到 WebSocket 的关键步骤之一")]),t._v(" "),a("img",{attrs:{width:"1100",src:"/img/1649994428.png"}}),t._v(" "),a("p",[t._v("然后 tryUpgrade 函数将后端针对上一次的请求响应返回给客户端")]),t._v(" "),a("img",{attrs:{width:"1100",src:"/img/1649994462.png"}}),t._v(" "),a("p",[t._v("然后使用 Goroutine 将客户端和后端服务的代理通道建立了起来")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994471.png"}}),t._v(" "),a("p",[t._v("这里是 API Server 代码中的流程，下面来看看 kubelet 的流程。")]),t._v(" "),a("h2",{attrs:{id:"kubelet-分析"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#kubelet-分析"}},[t._v("#")]),t._v(" Kubelet 分析")]),t._v(" "),a("p",[t._v("Kubelet 代码位置在 pkg/kubelet/server/server.go")]),t._v(" "),a("p",[t._v("在 server.go 中可以发现 Kubelet 启动时，会注册一系列的 API，/exec 也在其中，这里会主要看下 /exec 的代码")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994488.png"}}),t._v(" "),a("p",[t._v("在 server.go 的第 671 行，可以看到 getExec 函数")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994498.png"}}),t._v(" "),a("p",[t._v("在该函数的第 673 行，首先创建了一个 Options 实例，这里看下其中的 NewOptions 函数")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994509.png"}}),t._v(" "),a("p",[t._v("在第 61 行可以看到如果请求中没有给出 stdin、stdout 和 stderr 这三个参数，这个 Options 实例将创建失败，err 参数将返回"),a("code",[t._v("you must specify at least 1 of stdin, stdout, stderr")])]),t._v(" "),a("p",[t._v("这时 getExec 函数第 674 行的 if 判断将为真，此时 getExec 函数将直接返回客户端 http.StatusBadRequest 即状态码 400")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994520.png"}}),t._v(" "),a("p",[t._v("这时，可以构造一下请求测试一下，可以看到确实返回了 400，和分析结果一致。")]),t._v(" "),a("img",{attrs:{width:"1000",src:"/img/1649994533.png"}}),t._v(" "),a("p",[t._v("结合 API Server 的 tryUpgrade 函数代码可以发现，API Server 并没有对这种错误情况进行处理，也就是说在 API Server 中并没有对请求的返回值进行判断，不管返回值是多少都会走到下面的 Goroutine 代码中，依旧为 Kubelet 建立 WebSocket 连接。")]),t._v(" "),a("p",[t._v("而且因为 getExec 报错失败了，所以这种连接也没有对接到某个 Pod 上，连接也没有被销毁，客户端可以继续通过这个连接向 Kubelet 发送指令。")]),t._v(" "),a("p",[t._v("由于经过了 API Server 的代理，因此指令是以 API Server 的权限向 Kubelet 下发的，也就是说客户端能自由的向该 Kubelet 下发指令，而不受限制，从而实现了权限提升。")]),t._v(" "),a("h1",{attrs:{id:"_0x02-漏洞复现"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_0x02-漏洞复现"}},[t._v("#")]),t._v(" 0x02 漏洞复现")]),t._v(" "),a("h2",{attrs:{id:"环境搭建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#环境搭建"}},[t._v("#")]),t._v(" 环境搭建")]),t._v(" "),a("p",[t._v("首先需要安装低版本的 k8s，这里版本为 1.11.1")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("git clone https"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//github.com/brant"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("ruan/metarget.git\ncd metarget/\npip3 install "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("r requirements.txt\n./metarget cnv install cve"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("2018"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1002105")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br")])]),a("p",[t._v("接着需要准备一些文件，文件地址：https://github.com/Metarget/cloud-native-security-book/tree/main/code/0403-CVE-2018-1002105")]),t._v(" "),a("p",[t._v("下载这些文件后，创建相应资源")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("kubectl apply "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("f cve"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("2018"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("1002105_namespace.yaml\nkubectl apply "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("f cve"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("2018"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("1002105_role.yaml\nkubectl apply "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("f cve"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("2018"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("1002105_rolebinding.yaml\nkubectl apply "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("f cve"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("2018"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("1002105_pod.yaml\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br")])]),a("p",[t._v("配置用户认证")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("cp test"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token.csv /etc/kubernetes/pki/test"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("role"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token.csv\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("在 API Server 的配置文件 /etc/kubernetes/manifests/kube-apiserver.yaml 中容器的启动参数部分末尾（spec.container.command）增加一行配置")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("auth"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("file=/etc/kubernetes/pki/test"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("role"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token.csv\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("等待 API Server 重启，此时场景就搭建完毕了，下面测试下，场景是否正常")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("kubectl "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token=password "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("server=https"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//172.16.214.18"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("6443 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("insecure"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("skip"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("tls"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("verify exec "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("it test "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("n test /bin/hostname\nkubectl "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token=password "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("server=https"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//172.16.214.18"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("6443 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("insecure"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("skip"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("tls"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("verify get pods "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("n kube"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("system\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br")])]),a("p",[t._v("结果显示能够对指定 Pod 执行命令，但是不能执行其他越权操作，符合预期场景。")]),t._v(" "),a("img",{attrs:{width:"1100",src:"/img/1649994551.png"}}),t._v(" "),a("h2",{attrs:{id:"漏洞利用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#漏洞利用"}},[t._v("#")]),t._v(" 漏洞利用")]),t._v(" "),a("p",[t._v("使用脚本获得高权限凭证文件，脚本地址：https://github.com/Metarget/cloud-native-security-book/blob/main/code/0403-CVE-2018-1002105/exploit.py")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("python3 exploit.py "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("target 172.16.214.18 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("port 6443 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("bearer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("token password "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("namespace test "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("pod test\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("img",{attrs:{width:"1200",src:"/img/1649994563.png"}}),t._v(" "),a("p",[t._v("接着，使用拿到的高权限凭证在集群中新建一个挂载了宿主机根目录的 Pod，yaml 文件地址：https://github.com/Metarget/cloud-native-security-book/blob/main/code/0403-CVE-2018-1002105/attacker.yaml")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("kubectl "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("server=https"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//172.16.214.18"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("6443 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("certificate"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("authority=./ca.crt "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("certificate=./apiserver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("kubelet"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client.crt "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("key=./apiserver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("kubelet"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client.key apply "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("f attacker.yaml\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("Pod 被成功创建后，执行 ls /host-escape-door 命令可成功看到宿主机下的文件。")]),t._v(" "),a("div",{staticClass:"language-yaml line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-yaml"}},[a("code",[t._v("kubectl "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("server=https"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("//172.16.214.18"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("6443 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("certificate"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("authority=./ca.crt "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("certificate=./apiserver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("kubelet"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client.crt "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("key=./apiserver"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("kubelet"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("client.key exec attacker ls /host"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("escape"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("door\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("img",{attrs:{width:"1000",src:"/img/1649994572.png"}}),t._v(" "),a("p",[t._v("至此，完成了 CVE-2018-1002015 漏洞的复现。")]),t._v(" "),a("h1",{attrs:{id:"_0x03-漏洞修复"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_0x03-漏洞修复"}},[t._v("#")]),t._v(" 0x03 漏洞修复")]),t._v(" "),a("p",[t._v("该漏洞的修复也比较简单，直接在 API Server 中增加对后端服务器返回值的判断即可。")]),t._v(" "),a("p",[t._v("在新版 k8s 中的 tryUpgrade 函数这里，会判断状态码是否等于 http.StatusSwitchingProtocols，即 101，如果状态码不等于 101，则关闭连接。")]),t._v(" "),a("img",{attrs:{width:"1200",src:"/img/1649994587.png"}}),t._v(" "),a("blockquote",[a("p",[t._v("参考资料：")]),t._v(" "),a("p",[t._v("《云原生安全-攻防实践与体系构建》")]),t._v(" "),a("p",[t._v("https://xz.aliyun.com/t/3542")]),t._v(" "),a("p",[t._v("https://zh.wikipedia.org/wiki/WebSocket")])]),t._v(" "),a("Vssue")],1)}),[],!1,null,null,null);s.default=n.exports}}]);