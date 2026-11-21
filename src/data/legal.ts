/** 隐私政策与使用条款。正文沿用原官网（2026-11-10），许可一节按 FSL-1.1-MIT 重写（2026-11-22）。 */
const REPO = 'https://github.com/0xCoach/TaoSheng';
const issue = (t: string) => `<a href="${REPO}/issues" target="_blank" rel="noopener">${t}</a>`;

export const legal = {
  privacy: {
    zh: {
      title: '隐私政策 · 涛声 TaoSheng', h1: '涛声隐私政策', updated: '最后修改：2026 年 11 月 22 日',
      desc: '涛声隐私政策：不要求注册账号、没有项目服务器、不收集任何个人数据，录音与转写只保存在你自己的手机里。',
      html: `
<p>欢迎使用 <strong>涛声</strong>（以下简称“本软件”）。涛声是一个本机运行的个人记忆工具：没有我们的服务器、不用注册账号、不收集任何个人数据。本政策说明哪些内容留在你的手机里，以及在哪些情况下数据才可能离开设备。</p>
<h2>一、我们收集的信息</h2>
<p>没有。涛声没有后端服务，App 内也不含任何遥测、统计上报、崩溃收集或账号系统。</p>
<ul><li>不要求注册，不收集邮箱、手机号、设备标识符；</li><li>不上传录音、转写文本、声纹、事件或记忆；</li><li>不读取、不传输你填写的任何 API Key；</li><li>不含广告、追踪 SDK 或第三方统计。</li></ul>
<p>App 内的“检查更新”与“下载本地模型”只会向 GitHub、魔搭或你选择的镜像请求公开文件，这些请求不包含你的录音与记忆内容。</p>
<h2>二、数据存在哪里、保存多久</h2>
<p>所有记忆数据都保存在你自己手机上 App 的私有存储里：</p>
<ul><li>录音片段、原话转写、声纹样本、事件、待办与回顾；</li><li>API Key 存放在系统安全区（Android Keystore），不以明文保存；</li><li>原录音默认保留 3 天后自动删除（可设 1～365 天，标星内容可保留）；夜间睡眠录音未确认的 7 天删除、确认过的 90 天删除；</li><li>定位足迹、屏幕时间、睡眠记录和通话号码只存在本机；</li><li>你主动开启的备份写到本机文件夹、WebDAV、坚果云或 S3 等你自己的账号下。</li></ul>
<p>你可以随时用“删除最近 N 分钟”“这段别记”，或删除单条原话。卸载 App 会一并清除本机数据。</p>
<h2>三、你自己选择的第三方服务</h2>
<p>默认情况下涛声不会向任何地方发送数据。只有当你主动开启并配置以下可选能力时，数据才会离开手机：</p>
<ul><li>云端转写（如豆包语音、阿里百炼，或自定义转写服务）：录音片段发往该服务商；</li><li>大模型整理 / 问问：原话与提示词发往你配置的服务商或自建接口；</li><li>推送通道：回顾、待办与每日记忆文档发往你添加的通道；</li><li>备份：加密或明文备份写入你配置的存储目标。</li></ul>
<p>我们不中转、不存储、不查看这些内容，也不参与你与这些服务商之间的关系。请自行阅读其隐私政策与使用条款。选择本地转写 + 局域网自建模型，可以让全流程不出你自己的设备。</p>
<h2>四、删除、导出与卸载</h2>
<p>数据始终由你掌控：录音可回放并导出（多段合成 M4A，附带原话与字幕），日报周报可整篇复制，每条原话可标星或删除；删除声纹样本或某个时间范围都会在本机立即生效。</p>
<p>涛声刻意保留常驻通知与系统麦克风指示灯，不会被改造成隐蔽录音工具。录音与保存他人对话在很多国家和地区受法律约束，请遵守当地法律，并在需要时告知身边的人。</p>
<h2>五、本网站</h2>
<p>taosheng.app 不使用 Cookie、不放统计代码。语言偏好等少量设置只保存在你自己的浏览器里；“关于”页的贡献者头像从 GitHub 加载。网站托管在 Cloudflare，访问会产生其常规的服务器日志。</p>
<h2>六、政策更新与联系我们</h2>
<p>随着项目演进，本政策可能会作适当调整；重要变更会在仓库 README 或版本发布说明中告知。隐私问题欢迎通过 ${issue('GitHub Issue')} 公开讨论。使用条款请参阅 <a href="/terms">《涛声使用条款》</a>。</p>`,
    },
    en: {
      title: 'Privacy Policy — TaoSheng', h1: 'TaoSheng Privacy Policy', updated: 'Last updated: November 22, 2026',
      desc: 'TaoSheng privacy policy: no account, no project server, no data collection. Recordings and transcripts stay on your own phone.',
      html: `
<p>TaoSheng is an on-device personal memory tool. We have no server, require no account and collect no personal data. This policy explains what stays on your phone and the only situations in which data can leave it.</p>
<h2>1. What we collect</h2>
<p>Nothing. There is no backend, telemetry, analytics, crash reporting or account system in the app.</p>
<ul><li>No registration, email, phone number or device identifier;</li><li>No upload of recordings, transcripts, voiceprints, events or memories;</li><li>No reading or transmission of the API keys you enter;</li><li>No ads, tracking SDKs or third-party analytics.</li></ul>
<p>Update checks and model downloads only request public files from GitHub, ModelScope or a mirror you choose, and contain nothing about your recordings or memory.</p>
<h2>2. Where data lives and for how long</h2>
<ul><li>Audio segments, transcripts, voiceprint samples, events, todos and reviews live in the app’s private storage on your phone;</li><li>API keys are kept in the Android Keystore;</li><li>Raw recordings are deleted after 3 days by default (1–365 days, starred items kept); unconfirmed sleep clips after 7 days, confirmed ones after 90;</li><li>Places, screen time, sleep records and call numbers stay on the device;</li><li>Backups you enable go to your own local folder, WebDAV, Nutstore or S3 account.</li></ul>
<p>Use “delete the last N minutes”, “don’t record this” or delete single lines at any time. Uninstalling removes local data.</p>
<h2>3. Third-party services you choose</h2>
<p>Nothing is sent anywhere by default. Data leaves your phone only when you enable cloud transcription, an LLM, push channels or cloud backup that you configured yourself. We do not relay, store or inspect any of it. On-device transcription plus a self-hosted LLM keeps everything on your own devices.</p>
<h2>4. Deletion, export and lawful use</h2>
<p>Recordings can be replayed and exported; reports copied; any line starred or deleted. TaoSheng keeps a persistent notification and respects the microphone indicator; it must not be turned into a covert recorder. Recording conversations is subject to local law.</p>
<h2>5. This website</h2>
<p>taosheng.app uses no cookies and no analytics. Small preferences such as language are stored only in your browser; contributor avatars on the About page load from GitHub. The site is hosted on Cloudflare, which keeps standard server logs.</p>
<h2>6. Changes and contact</h2>
<p>Important changes will be announced in the README or release notes. Privacy questions are welcome as a ${issue('GitHub issue')}. See also the <a href="/en/terms">Terms of Use</a>.</p>`,
    },
  },
  terms: {
    zh: {
      title: '使用条款 · 涛声 TaoSheng', h1: '涛声使用条款', updated: '最后修改：2026 年 11 月 22 日',
      desc: '涛声使用条款：源码按 FSL-1.1-MIT 公开，软件按现状提供，第三方服务由用户自行配置并承担费用，录音使用须遵守当地法律。',
      html: `
<p>欢迎使用 <strong>涛声</strong>——一款面向安卓手机的个人记忆工具。您下载、编译、安装或使用本软件，即表示已阅读并同意本条款。本条款在源码许可之外，说明实际使用中的权利与边界。</p>
<h2>一、服务说明</h2>
<ul><li>需要 Android 10 及以上、arm64 架构的手机，主要在小米 14 Pro 上实测；</li><li>本地转写可选；云端转写与大模型整理需要你自己填写密钥；</li><li>备份、推送通道与自定义技能均为你自行配置的可选功能；</li><li>软件仍在快速迭代，功能可能调整。</li></ul>
<h2>二、用户权利与义务</h2>
<p><strong>您享有以下权利：</strong></p>
<ul><li>免费使用，无需注册账号、无需订阅；</li><li>自由选择本地或第三方服务，随时更换；</li><li>随时导出、备份、删除或彻底清除自己的数据；</li><li>随时停止使用并卸载本软件。</li></ul>
<p><strong>您需要遵守以下义务：</strong></p>
<ul><li>遵守当地法律，在需要时于录音前告知身边的人；</li><li>妥善保管自己的 API Key、备份凭据与导出文件；</li><li>安装前核对签名证书指纹与安装包 SHA-256 校验值；</li><li>分发修改版时，不得让他人误以为它是官方原版或已被官方认可。</li></ul>
<h2>三、源码许可与知识产权</h2>
<p>自 0.4.0 版起，涛声源码按 <a href="${REPO}/blob/main/LICENSE.md" target="_blank" rel="noopener">FSL-1.1-MIT</a>（Functional Source License 1.1，MIT 未来许可）公开：</p>
<ul><li><strong>允许</strong>：个人使用、学习、研究、修改，公司内部使用，以及在此基础上为客户提供专业服务；</li><li><strong>不允许</strong>：把涛声或其修改版做成与涛声竞争的商业产品或服务，例如换名上架售卖，或用它对外提供付费的转写、整理服务；</li><li><strong>自动转为 MIT</strong>：每个版本发布满两年后，该版本自动改按 MIT 许可提供；</li><li>0.3.1 及之前的版本永远按 MIT 许可提供。</li></ul>
<p>以许可证原文为准。第三方组件（sherpa-onnx、Silero VAD、CAM++ / 3D-Speaker、SenseVoice、pyannote segmentation、高通 QNN 运行库等）各自遵循其原始许可，详见 <a href="${REPO}/tree/main/docs/third-party" target="_blank" rel="noopener">docs/third-party</a>。“涛声”名称与图标不在代码许可范围内。</p>
<h2>四、第三方服务</h2>
<p>云端转写、大模型服务商、推送通道与备份目标都是您自行选择并配置的服务：</p>
<ul><li>其可用性、质量、安全性与隐私实践由对应服务商负责；</li><li>费用由您自己的账号承担，我们不收取、也不经手任何费用；</li><li>我们不中转、不存储、不查看发往这些服务的内容，也不为其承担责任。</li></ul>
<h2>五、免责声明</h2>
<p>在法律允许范围内，本软件按“现状”提供，不作任何明示或暗示的保证。我们尤其不对以下情况负责：</p>
<ul><li>因系统电池策略、厂商后台限制或设备故障导致的漏录；</li><li>转写、说话人标注或 AI 整理的误差——要紧的事请对照原录音核实；</li><li>因用户操作、未备份即卸载、或第三方服务故障造成的数据丢失；</li><li>使用本软件产生的任何间接、附带或后果性损失。</li></ul>
<p>涛声是个人记忆辅助工具，不是医疗、法律、金融或专业取证录音系统。夜间睡眠功能由手机录音自动统计，仅供参考，不是医疗检查。</p>
<h2>六、合规使用</h2>
<p>录音与保存他人对话在很多国家和地区受法律约束。您需自行确保符合适用法律，并在需要时取得对方同意。涛声刻意保留前台服务常驻通知，并遵循系统麦克风指示灯；不得将本软件改造或用于隐蔽监听、偷录，或用于侵犯他人权益的目的。</p>
<h2>七、条款变更与联系</h2>
<p>我们可能会更新本条款，重要变更会在仓库 README 或版本发布说明中告知；继续使用更新后的版本，即视为接受更新后的条款。隐私相关内容见 <a href="/privacy">《涛声隐私政策》</a>。有疑问欢迎通过 ${issue('GitHub Issue')} 提出。</p>`,
    },
    en: {
      title: 'Terms of Use — TaoSheng', h1: 'TaoSheng Terms of Use', updated: 'Last updated: November 22, 2026',
      desc: 'TaoSheng terms of use: source available under FSL-1.1-MIT, provided as is, third-party services configured and paid for by you, recording subject to local law.',
      html: `
<p>By downloading, building, installing or using TaoSheng you agree to these terms. They explain the practical rights and limits on top of the source license.</p>
<h2>1. The software</h2>
<ul><li>Requires Android 10+ on arm64; mainly tested on a Xiaomi 14 Pro;</li><li>On-device transcription is optional; cloud transcription and the LLM digest need your own keys;</li><li>Backup, push and custom skills are optional features you configure;</li><li>The software is evolving quickly and features may change.</li></ul>
<h2>2. Your rights and obligations</h2>
<ul><li>Use it free, with no account or subscription; choose and change providers freely; export or delete your data any time;</li><li>Comply with local law and inform people when required; keep your keys and backups safe; verify the signing certificate and SHA-256 before installing; don’t pass off modified builds as official.</li></ul>
<h2>3. License and intellectual property</h2>
<p>From version 0.4.0, the source is available under <a href="${REPO}/blob/main/LICENSE.md" target="_blank" rel="noopener">FSL-1.1-MIT</a> (Functional Source License 1.1, MIT Future License):</p>
<ul><li><strong>Allowed</strong>: personal use, learning, research, modification, internal company use, and professional services for licensees;</li><li><strong>Not allowed</strong>: offering TaoSheng or a derivative as a competing commercial product or service;</li><li><strong>Becomes MIT</strong>: each version converts to the MIT license two years after release;</li><li>Versions up to 0.3.1 remain MIT.</li></ul>
<p>The license text governs. Third-party components keep their own licenses (see <a href="${REPO}/tree/main/docs/third-party" target="_blank" rel="noopener">docs/third-party</a>). The TaoSheng name and logo are not covered by the code license.</p>
<h2>4. Third-party services</h2>
<p>Providers you configure are responsible for their availability, quality and privacy. Fees are billed to your own account. We do not relay, store or review content sent to them.</p>
<h2>5. Disclaimer</h2>
<p>To the extent permitted by law, the software is provided “as is”, without warranty. We are not responsible for missed recordings due to OS or vendor restrictions, transcription or AI errors, data loss, or indirect damages. TaoSheng is a memory aid, not a medical, legal, financial or forensic system; sleep features are for reference only and not a medical test.</p>
<h2>6. Lawful use</h2>
<p>Recording others is legally restricted in many places; you are responsible for compliance and consent. TaoSheng must not be modified or used for covert surveillance.</p>
<h2>7. Changes and contact</h2>
<p>Important changes will be announced in the README or release notes. See the <a href="/en/privacy">Privacy Policy</a>. Questions are welcome as a ${issue('GitHub issue')}.</p>`,
    },
  },
} as const;
