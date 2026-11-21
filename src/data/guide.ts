/**
 * 新手指南。菜单名称与路径按 App 源码（ui/settings、ui/night、ui/today）和 README「快速开始」核对过。
 * 正文是受信任的静态 HTML（只由本仓库维护），在页面里用 set:html 输出。
 */
export interface Chapter { id: string; title: string; summary: string; html: string }

export const guide: Record<'zh' | 'en', { title: string; desc: string; lead: string; toc: string; help: string; helpBody: string; chapters: Chapter[] }> = {
  zh: {
    title: '新手指南 · 涛声 TaoSheng',
    desc: '涛声使用手册：安装与开箱、转写和大模型怎么选、后台保活、声纹认人、专题录音、待办提醒、夜间睡眠、通话录音、推送备份与智能体。',
    lead: '一份手册讲清楚每个功能怎么配。不知道从哪开始，就按顺序看前三章。',
    toc: '目录',
    help: '还是没弄明白？',
    helpBody: '在 设置 → 通用 → 高级诊断 导出问题记录，到 GitHub 提一个 Issue，写上手机型号和系统版本。',
    chapters: [
      {
        id: 'start', title: '安装与开箱', summary: '下载、安装，跟着向导 3 分钟走完。',
        html: `
<h3>安装</h3>
<ol>
<li>在官网点「下载安卓版」，安装包从魔搭国内镜像下载，约 105 MB。</li>
<li>手机上直接打开下载好的 APK。提示“未知来源”时，按提示允许这一次安装即可。</li>
<li>需要 Android 10 及以上、64 位（arm64）手机，近几年的手机基本都满足。</li>
</ol>
<blockquote>只认官方签名的安装包。签名证书指纹和 SHA-256 校验值见 <a href="/download#verify">安装与校验</a>，别处下载的改装版可能被动过手脚。</blockquote>
<h3>开箱向导（约 3 分钟）</h3>
<ol>
<li><strong>打开必要权限</strong>：麦克风、通知、电池白名单。每一项都会先说明用途，再弹系统确认。同时后台会自动下载本机转写模型（约 170～330 MB，用流量时会提醒）。</li>
<li><strong>配置整理模型</strong>：点「去 DeepSeek 获取密钥」，在网页里创建密钥并复制，回到涛声会自动识别剪贴板并测试。也可以先选“以后再说”。</li>
<li><strong>说句话试试</strong>：模型装好后说一句话，当场就能看到转写和整理出的事件、待办。</li>
<li><strong>其他设置（可选）</strong>：向导最后会问要不要现在设置后台保活、备份、推送、足迹。建议先把<a href="#background">后台保活</a>设好。</li>
</ol>
<p>换手机的老用户：在向导第一页点「换手机了？从备份恢复」。</p>
<h3>四个页面各管什么</h3>
<table>
<tr><th>今天</th><td>收音状态、今日节奏、待确认的事、按时间排好的事件；放大镜可以搜原话和事件。</td></tr>
<tr><th>问问</th><td>打字提问，“这周我答应了哪些事？”，答案带原话出处。</td></tr>
<tr><th>记忆</th><td>按天的回顾、关键信息、重点 ★、灵感和技能卡片。</td></tr>
<tr><th>待办</th><td>待确认 / 进行中 / 已完成；左滑标重点，右滑删除。</td></tr>
</table>
<p>设置分四组：<span class="path">记录</span>（录音管理、外接设备、语音转写、人物声纹）、<span class="path">整理</span>（整理模型、整理技能、推送通道）、<span class="path">线索</span>（环境声音、屏幕时间、位置足迹、夜间睡眠）、<span class="path">通用</span>（备份恢复、版本更新、高级诊断、关于涛声）。设置页顶部可以直接搜，比如搜“耗电”“不录”。</p>`,
      },
      {
        id: 'models', title: '转写和大模型怎么选', summary: '本地还是云端？哪家模型？一张表说清。',
        html: `
<p>涛声分两步干活：先把声音<strong>转写</strong>成文字，再交给<strong>大模型整理</strong>成事件、待办和记忆。两步可以分开选。</p>
<h3>转写：设置 → 记录 → 语音转写</h3>
<table>
<tr><th>方式</th><td>适合谁</td></tr>
<tr><th>本地转写</th><td>最在意隐私、不想花钱。SenseVoice 模型在手机上完全离线识别，骁龙手机可用 NPU 加速。首次使用时下载模型。</td></tr>
<tr><th>豆包语音</th><td>想要更快更准。填豆包语音 API Key；有火山方舟 Agent Plan 套餐的，也可以填套餐的专属 Key。</td></tr>
<tr><th>阿里百炼千问</th><td>多人对话多，需要服务端直接区分说话人。</td></tr>
<tr><th>自定义接口</th><td>有自己的转写服务。支持 OpenAI 兼容接口，可逐句返回时间和说话人。</td></tr>
</table>
<h3>大模型：设置 → 整理 → 整理模型</h3>
<ul>
<li>默认用 DeepSeek，开箱向导里点一下就能拿到密钥。</li>
<li>内置豆包、通义、Kimi、智谱等十多家服务商，一键切换，可查余额、低额提醒。</li>
<li>任意 OpenAI 兼容接口都能填，支持自定义请求头（内置 OpenCode Go），也支持局域网自建模型。</li>
<li>配置多个模型时，主模型断网、宕机或欠费，会自动切到备用模型。</li>
<li>思考模型、慢模型也能用：边生成边接收，太久没动静会自动把一批切小。</li>
</ul>
<blockquote>想全程不出自己的设备：转写选本地，整理填局域网自建模型的地址。</blockquote>`,
      },
      {
        id: 'background', title: '让它一直在后台', summary: '各品牌手机的保活设置，最影响体验的一步。',
        html: `
<p>涛声需要在后台一直收音。安卓各家厂商对后台限制不同，<strong>这一步没设好，最常见的现象就是“过一阵就不录了”</strong>。</p>
<p>App 里有逐项引导：<span class="path">设置 → 记录 → 录音管理</span>，里面列出了你这台手机需要打开的每一项。</p>
<table>
<tr><th>小米 / 红米 / 澎湃 OS</th><td>打开<strong>自启动</strong>，电池策略设为<strong>无限制</strong>。</td></tr>
<tr><th>华为 / 荣耀 / 鸿蒙</th><td>在「应用启动管理」里把涛声改成<strong>手动管理</strong>，三项全部打开。</td></tr>
<tr><th>卓易通里使用</th><td>要对<strong>卓易通本身</strong>做上面的设置，而不是对涛声。</td></tr>
<tr><th>其他品牌</th><td>找“自启动”“后台运行”“电池优化”，把涛声设为允许 / 不优化。</td></tr>
</table>
<h3>常见问题</h3>
<ul>
<li><strong>录音时喊“小爱同学”没反应？</strong>不少手机在有 App 录音时会暂停唤醒词监听，这是硬件限制。录音期间请改用长按电源键唤醒语音助手。</li>
<li><strong>耗电多少？</strong>只在有人说话时录，实测约 0.5%/小时。设置里搜“耗电”可以看到相关选项。</li>
<li><strong>麦克风被别的 App 占用？</strong>今天页顶部会提示是谁占用了麦克风。</li>
</ul>`,
      },
      {
        id: 'voiceprint', title: '声纹认人', summary: '让它分清哪句是你说的，哪句是家人同事。',
        html: `
<ol>
<li>打开 <span class="path">设置 → 记录 → 人物声纹 → 我</span>，照着屏幕朗读三段短文。读完后，涛声就能认出哪句是你说的。</li>
<li>认识别人：在今天页的原话上<strong>长按</strong>，选「这是谁」，指定一次就会记住这个人的声音。</li>
<li>每个人的样本都能回放、删除；样本声音可以一键清除。</li>
</ol>
<p>声纹提取和比对都在手机上完成（CAM++ 模型），不会上传。</p>`,
      },
      {
        id: 'topic', title: '专题录音与打点', summary: '开会、培训、通话，一键出纪要。',
        html: `
<ol>
<li>今天页顶部的橙色主卡上点 <strong>◉ 专题</strong>，选类型：会议、培训、通话·访谈、口播稿。</li>
<li>录音期间边开边整理，每 10 分钟一块；结束后很快出纪要，认不出参会人也能出。</li>
<li>听到要紧处点「📍记一下」，前后的内容会整理得更细，重点原声保留。</li>
<li>主卡上可以暂停 / 继续，也可以预约开始时间；忘了开，可以事后补选一段时间。</li>
</ol>
<p>选“培训”时不区分说话人，适合听课。桌面小组件“涛声快捷”可以一键开专题；专题进行中，小组件会变成“记一下”。</p>`,
      },
      {
        id: 'todo', title: '待办与提醒', summary: '自动摘待办、语音加待办、闹钟级强提醒。',
        html: `
<ul>
<li>原话里答应的事会自动变成待办，先放在「待确认」，点接受或忽略。说一句“发了”，相关待办会自动完成。</li>
<li>手动添加：通知栏、长按桌面图标或小组件，随口说一句就能加。</li>
<li>待办页有周 / 月日历视图，过期的可以一键改到今天；也能一键加到手机日历。</li>
<li><strong>强提醒</strong>：给待办设具体的时间点，打开强提醒后到点会持续响铃震动，锁屏整屏提醒，直到你回应。第一次设置时，涛声会列出需要打开的系统功能，照着打开即可。</li>
</ul>`,
      },
      {
        id: 'sleep', title: '夜间睡眠', summary: '记录几点睡、几点起，鼾声、咳嗽和梦话。',
        html: `
<h3>打开</h3>
<p><span class="path">设置 → 线索 → 夜间睡眠</span>，打开「夜里记录」。第一次会下载识别模型（约 27 MB），不需要打开环境音识别。模型下好之前，夜里只记声音曲线，可疑的声音先存下来，下好后再补做识别。</p>
<h3>怎么记</h3>
<ul>
<li>手机放床头，睡着后自动开始；早上解锁、拔充电线或关闹钟就自动结束。</li>
<li><strong>睡眠时段</strong>默认按你最近两周的作息自动定，也可以自己设。夜班、白天补觉可以「再加一段」，午睡可以单独打开。</li>
<li>和别人同屋睡，打开「同屋有人」，鼾声会写成“卧室里的鼾声”。</li>
<li>没充电且电量低于 30% 时，「睡前电量提醒」会提醒一次。</li>
</ul>
<h3>早上看什么</h3>
<ul>
<li>今天页“今日节奏”里点“昨晚”：几点上床、约几点入睡、几点起、醒了几次。</li>
<li>声音地图上点圆点回听；双指或双击放大，长按看几点几分、有多响。</li>
<li>拿不准的声音最多问你 3 段“是 / 不是”，越用越准。</li>
<li>睡前标上“侧睡”“开了加湿器”等情况，几晚后就能对比；每周一有周报。</li>
<li>可以按 7 / 30 / 90 天生成带图表的“给医生的一页”PDF。</li>
</ul>
<blockquote>由手机录音自动统计，仅供参考，不是医疗检查。</blockquote>`,
      },
      {
        id: 'calls', title: '通话录音', summary: '手机自己录，涛声来收：三步设置。',
        html: `
<p>安卓不允许第三方 App 录通话，但手机自带的电话 App 可以自动录。涛声只读这些录音，原文件不动、不删。</p>
<h3>第 1 步：打开手机的自动通话录音</h3>
<table>
<tr><th>小米 / 红米</th><td>电话 → 设置 → 通话录音 → 打开“自动录音所有通话”</td></tr>
<tr><th>华为 / 荣耀</th><td>电话 → 右上角 ⋮ → 设置 → 打开“通话自动录音” → 选“所有通话”</td></tr>
<tr><th>OPPO / 一加 / 真我</th><td>电话 → 设置 → 通话录音 → 打开“自动录音” → 选“所有通话”</td></tr>
<tr><th>vivo / iQOO</th><td>电话 → 设置 → 通话录音 → 打开“自动录音” → 选“所有通话”</td></tr>
<tr><th>三星</th><td>电话 → 右上角 ⋮ → 设置 → 录制通话 → 打开“自动录制通话”</td></tr>
</table>
<h3>第 2 步：先打一通测试电话</h3>
<p>没录过通话的手机，录音文件夹还不存在。随便打一通电话说几句，让手机先录一个。</p>
<h3>第 3 步：在涛声里添加</h3>
<p><span class="path">设置 → 记录 → 录音管理 → 自动导入文件夹 → 添加文件夹 → 通话录音</span>，涛声会直接打开到这款手机存录音的位置，点“使用此文件夹”。然后选已有录音怎么处理：只收新的、最近 7 天 / 30 天，或列出全部（点开哪通再转哪通，不花额度）。</p>
<p>涛声不读通讯录：对方显示名字还是号码，取决于手机录音时写进文件名的内容。号码不会发给任何服务。</p>
<blockquote>个人记录自己的通话一般没有问题。企业用来记录客户沟通，请遵守公司规定和当地法规，必要时提前告知对方。</blockquote>`,
      },
      {
        id: 'sync', title: '推送、备份与智能体', summary: '把记忆送到你常用的地方，换手机不丢。',
        html: `
<h3>推送通道：设置 → 整理 → 推送通道</h3>
<p>支持 PushPlus、企业微信机器人、Server 酱、飞书、钉钉、Telegram、邮件、Notion、同步文件夹（坚果云 / WebDAV / S3，可接 Obsidian）、自定义 Webhook。可以推每日回顾、待办提醒、新整理的事、技能卡片和每日记忆文档；按你设的间隔合并推送，没有变化不连云端。</p>
<h3>复制给智能体</h3>
<p>配置好同步文件夹后，在推送通道里点「复制给智能体」，把复制的内容粘贴给 Claude Code、Codex 等，它就能只读你的记忆库。想收回权限，删掉网盘的应用密码即可。</p>
<h3>备份：设置 → 通用 → 备份恢复</h3>
<ul>
<li>备份到坚果云、WebDAV（Nextcloud、群晖等）或 S3 兼容存储（阿里云、腾讯云、R2 等），也可以只备份到本机文件夹。</li>
<li>可以设口令加密，保留 3 / 7 / 30 天版本，增量备份。</li>
<li>换手机时在开箱向导第一页选「从备份恢复」，连设置和密钥一起恢复。</li>
</ul>`,
      },
    ],
  },
  en: {
    title: 'Getting started — TaoSheng',
    desc: 'The TaoSheng guide: install and first run, choosing transcription and LLM, keeping it alive in the background, voiceprints, topics, todos, sleep tracking, call recordings, push, backup and AI agents.',
    lead: 'Everything from install to daily use in one place. Not sure where to begin? Read the first three chapters in order.',
    toc: 'Contents',
    help: 'Still stuck?',
    helpBody: 'Export a diagnostic log from Settings → General → Diagnostics and open a GitHub issue with your phone model and Android version.',
    chapters: [
      {
        id: 'start', title: 'Install & first run', summary: 'Download, install, and finish the wizard in three minutes.',
        html: `
<h3>Install</h3>
<ol>
<li>Tap “Download for Android”. The APK (about 105 MB) comes from the ModelScope mirror.</li>
<li>Open the APK on your phone. If Android warns about unknown sources, allow this install.</li>
<li>You need Android 10+ on a 64-bit (arm64) phone — nearly every recent phone qualifies.</li>
</ol>
<blockquote>Only trust the officially signed APK. The certificate fingerprint and SHA-256 are on <a href="/en/download#verify">Install &amp; verify</a>.</blockquote>
<h3>Setup wizard (about 3 minutes)</h3>
<ol>
<li><strong>Permissions</strong>: microphone, notifications and battery whitelist, each explained before Android asks. The on-device transcription model (170–330 MB) downloads in the background; you’re warned on mobile data.</li>
<li><strong>Digest model</strong>: tap “Get a DeepSeek key”, create and copy a key, and TaoSheng picks it up from the clipboard and tests it. You can skip this for now.</li>
<li><strong>Say something</strong>: once the model is ready, speak a sentence and see the transcript, events and todos appear.</li>
<li><strong>Optional</strong>: keep-alive, backup, push and places. Set up <a href="#background">keep-alive</a> first.</li>
</ol>
<p>Switching phones? Tap “Restore from backup” on the wizard’s first page.</p>
<h3>The four tabs</h3>
<table>
<tr><th>Today</th><td>Listening status, the day’s rhythm, things to confirm and the timeline. The magnifier searches lines and events.</td></tr>
<tr><th>Ask</th><td>Type a question like “What did I promise this week?” Answers cite the original lines.</td></tr>
<tr><th>Memory</th><td>Daily reviews, key facts, starred items, ideas and skill cards.</td></tr>
<tr><th>Todo</th><td>To confirm / doing / done. Swipe left to star, right to delete.</td></tr>
</table>
<p>Settings has four groups: <span class="path">Capture</span>, <span class="path">Digest</span>, <span class="path">Context</span> (ambient sound, screen time, places, sleep) and <span class="path">General</span>. Search at the top — try “battery”.</p>
<p class="note">The app’s interface is currently in Chinese; menu names here are translated.</p>`,
      },
      {
        id: 'models', title: 'Choosing transcription and LLM', summary: 'Local or cloud? Which provider? One table.',
        html: `
<p>TaoSheng works in two steps: <strong>transcribe</strong> speech to text, then let an <strong>LLM organize</strong> it into events, todos and memories. You choose each independently.</p>
<h3>Transcription: Settings → Capture → Transcription</h3>
<table>
<tr><th>On-device</th><td>Most private and free. SenseVoice runs fully offline, with NPU acceleration on Snapdragon.</td></tr>
<tr><th>Doubao</th><td>Faster and more accurate. Use a Doubao speech API key, or a Volcengine Agent Plan key.</td></tr>
<tr><th>Alibaba Qwen</th><td>Lots of multi-person conversation; the service separates speakers itself.</td></tr>
<tr><th>Custom</th><td>Your own OpenAI-compatible service, with per-line timing and speakers.</td></tr>
</table>
<h3>LLM: Settings → Digest → Digest model</h3>
<ul>
<li>DeepSeek by default; the wizard gets you a key in a tap.</li>
<li>A dozen built-in providers (Doubao, Qwen, Kimi, Zhipu…) with one-tap switching and balance alerts.</li>
<li>Any OpenAI-compatible endpoint, custom headers, or a self-hosted model on your LAN.</li>
<li>With several models configured, it fails over automatically when the main one is down or out of credit.</li>
</ul>
<blockquote>Fully on your own devices: on-device transcription plus a LAN-hosted model.</blockquote>`,
      },
      {
        id: 'background', title: 'Keep it running', summary: 'Per-brand keep-alive settings — the step that matters most.',
        html: `
<p>Android vendors restrict background apps differently. If this isn’t set up, the usual symptom is “it stopped recording after a while”.</p>
<p>The app walks you through it in <span class="path">Settings → Capture → Recording</span>.</p>
<table>
<tr><th>Xiaomi / Redmi / HyperOS</th><td>Enable <strong>Autostart</strong>; set battery to <strong>No restrictions</strong>.</td></tr>
<tr><th>Huawei / Honor / HarmonyOS</th><td>In App launch, set TaoSheng to <strong>Manage manually</strong> with all three switches on.</td></tr>
<tr><th>Other brands</th><td>Look for autostart, background activity and battery optimization; allow TaoSheng.</td></tr>
</table>
<ul>
<li><strong>Voice assistant wake word stops working?</strong> Many phones pause wake-word detection while another app records. Long-press the power button instead.</li>
<li><strong>Battery?</strong> About 0.5% per hour in testing, because it records only speech.</li>
</ul>`,
      },
      {
        id: 'voiceprint', title: 'Voiceprints', summary: 'Teach it your voice and the people around you.',
        html: `
<ol>
<li>Open <span class="path">Settings → Capture → People → Me</span> and read the three short passages aloud.</li>
<li>For others, long-press a line on Today and choose “Who is this”. Once is enough.</li>
<li>Every sample can be replayed or deleted.</li>
</ol>
<p>Voiceprints (CAM++) are computed and matched on the phone and never uploaded.</p>`,
      },
      {
        id: 'topic', title: 'Topics & bookmarks', summary: 'Meetings, classes and calls, with notes at the end.',
        html: `
<ol>
<li>On Today, tap <strong>◉ Topic</strong> on the orange card and pick meeting, class, call/interview or script.</li>
<li>It organizes as you go in ten-minute blocks, so notes arrive soon after you finish — even when speakers are unknown.</li>
<li>Tap “📍 Mark” at important moments for extra detail and kept audio.</li>
<li>Pause, resume, schedule ahead, or select a past time range afterwards.</li>
</ol>`,
      },
      {
        id: 'todo', title: 'Todos & reminders', summary: 'Automatic todos, voice todos, alarm-grade reminders.',
        html: `
<ul>
<li>Promises become todos under “To confirm”. Say “sent it” later and the matching todo completes itself.</li>
<li>Add by voice from the notification, a long-press on the app icon, or the widget.</li>
<li>Week/month calendar views; move overdue items to today in one tap; add to your phone calendar.</li>
<li><strong>Alarm reminders</strong> ring and vibrate full-screen on the lock screen until you respond. The app lists the system switches needed the first time.</li>
</ul>`,
      },
      {
        id: 'sleep', title: 'Sleep', summary: 'Bedtime, wake time, snoring, coughs and sleep talk.',
        html: `
<p>Turn it on in <span class="path">Settings → Context → Sleep</span>. A 27 MB recognition model downloads first; until then only the sound curve is kept and suspicious clips wait to be recognized.</p>
<ul>
<li>Starts when you fall asleep, ends when you unlock, unplug or dismiss your alarm.</li>
<li>The sleep window follows your last two weeks automatically, or set it yourself. Add naps, night shifts and daytime sleep.</li>
<li>Sharing a room? Turn on “Someone else in the room” and snoring is labeled “in the bedroom”.</li>
<li>In the morning, open “Last night”: tap dots to replay, pinch to zoom, answer up to three yes/no questions to improve accuracy.</li>
<li>Tag nights (“side sleeping”, “humidifier on”) to compare; weekly report every Monday; a one-page PDF for your doctor over 7/30/90 days.</li>
</ul>
<blockquote>Estimated from phone audio. For reference only, not a medical test.</blockquote>`,
      },
      {
        id: 'calls', title: 'Call recordings', summary: 'Your phone records, TaoSheng collects.',
        html: `
<ol>
<li>Turn on automatic call recording in your phone’s own Phone app settings.</li>
<li>Make one test call so the recordings folder exists.</li>
<li>In TaoSheng: <span class="path">Settings → Capture → Recording → Auto-import folders → Add → Call recordings</span>, then choose how to handle existing recordings.</li>
</ol>
<p>TaoSheng never reads your contacts and never sends numbers to any service. Follow local law when recording calls.</p>`,
      },
      {
        id: 'sync', title: 'Push, backup & agents', summary: 'Send your memory where you work, and never lose it.',
        html: `
<h3>Push: Settings → Digest → Push channels</h3>
<p>PushPlus, WeCom bots, ServerChan, Lark, DingTalk, Telegram, email, Notion, a sync folder (WebDAV / Nutstore / S3, works with Obsidian) and custom webhooks. Incremental, batched, and offline when nothing changed.</p>
<h3>Copy for agent</h3>
<p>With a sync folder set up, tap “Copy for agent” and paste into Claude Code or Codex for read-only access to your memory. Revoke by deleting the app password.</p>
<h3>Backup: Settings → General → Backup</h3>
<p>WebDAV, Nutstore, S3-compatible storage or a local folder; passphrase encryption; 3/7/30-day versions. Restore everything on a new phone from the setup wizard.</p>`,
      },
    ],
  },
};
