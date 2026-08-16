const state = {
  profile: { name: '林晓晓', avatar: '林', style: '简短口语化，喜欢使用“哈哈”“真的嘛”，偶尔用狗头和捂脸表情。', confidence: 78 },
  personality: '温柔', attitude: '亲近', length: '简短', autoEmoji: true,
  messages: [
    { from: 'ai', text: '今天怎么样？有没有好一点呀～', time: '20:16' },
    { from: 'me', text: '还是有点累，事情好多', time: '20:17' },
    { from: 'ai', text: '那你先别想那么多，去喝点水，休息十分钟？慢慢来就好', time: '20:17' },
    { from: 'me', text: '你怎么和以前一样，总是先让我休息哈哈', time: '20:18' },
    { from: 'ai', text: '因为这招对你一直有用呀，真的嘛～', time: '20:18' }
  ], emojis: [], api: { base: '', model: '', key: '', enabled: false }
};

const $ = id => document.getElementById(id);
const messagesEl = $('messages');

function showToast(text) { const el = $('toast'); el.textContent = text; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2300); }
function saveState() {
  const snapshot = JSON.parse(JSON.stringify(state));
  snapshot.api.key = '';
  localStorage.setItem('chatmirror-state', JSON.stringify(snapshot));
}
function loadState() { try { const saved = JSON.parse(localStorage.getItem('chatmirror-state')); if (saved) Object.assign(state, saved); } catch (_) {} }

function renderMessages() {
  messagesEl.innerHTML = state.messages.map(m => `<div class="message-row ${m.from === 'me' ? 'mine' : 'ai'}">${m.from === 'ai' ? `<div class="mini-avatar">${state.profile.avatar}</div>` : ''}<div class="bubble">${escapeHtml(m.text)}</div><span class="message-time">${m.time}</span></div>`).join('');
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
function currentTime() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); }

function addMessage(from, text) { state.messages.push({ from, text, time: currentTime() }); renderMessages(); saveState(); }
function addTyping() { const el = document.createElement('div'); el.className = 'message-row ai'; el.id = 'typingRow'; el.innerHTML = `<div class="mini-avatar">${state.profile.avatar}</div><div class="bubble typing"><i></i><i></i><i></i></div>`; messagesEl.appendChild(el); messagesEl.scrollTop = messagesEl.scrollHeight; }
function removeTyping() { $('typingRow')?.remove(); }

function mockReply(input) {
  const prefix = { 温柔: '先抱抱你～', 活泼: '哎呀，', 冷淡: '嗯，', 毒舌: '你这人啊，', 成熟: '我觉得可以这样看：', 搞怪: '收到，脑内小剧场启动！' }[state.personality];
  const ending = { 亲近: '别给自己太大压力啦', 普通: '按自己的节奏来就好', 客气: '希望能对你有帮助', 敷衍: '你看着办就好', 暧昧: '我会一直陪着你的呀' }[state.attitude];
  const detail = state.length === '详细' ? '如果愿意的话，也可以和我说说具体是哪一部分让你觉得累。' : state.length === '适中' ? '先做最重要的一件，其他的晚点再处理。' : '';
  if (/累|难过|烦|焦虑|压力/.test(input)) return `${prefix}听起来你今天真的挺辛苦的，${ending}。${detail}`;
  if (/早安|早上好/.test(input)) return `${prefix}早呀，今天也要顺顺利利的～${ending}`;
  if (/晚安|睡觉/.test(input)) return `好哦，那就早点休息，晚安${state.attitude === '暧昧' ? '，做个好梦' : '～'}`;
  if (/谢谢|感谢/.test(input)) return `不用客气啦，${ending}。`;
  return `${prefix}${input.includes('?') || input.includes('？') ? '这个问题嘛，我觉得可以先按自己的感觉来。' : '我看到啦，哈哈。'}${detail || ending}`;
}

async function requestApi(input) {
  const body = { model: state.api.model, messages: [{ role: 'system', content: buildSystemPrompt() }, ...state.messages.slice(-10).map(m => ({ role: m.from === 'me' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: input }] };
  const response = await fetch(state.api.base, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.api.key}` }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`API 请求失败（${response.status}）`);
  const data = await response.json(); return data.choices?.[0]?.message?.content || data.output_text || '模型没有返回文字。';
}
function buildSystemPrompt() { return `你正在进行明确标注的AI风格模拟。模拟对象：${state.profile.name}。性格：${state.personality}。对用户态度：${state.attitude}。回复长度：${state.length}。语言风格：${state.profile.style}。不得声称自己是真实人物，不得进行诈骗、转账诱导或冒充身份。`; }

async function sendMessage() {
  const input = $('messageInput').value.trim(); if (!input) return;
  addMessage('me', input); $('messageInput').value = ''; resizeTextarea(); addTyping();
  try { const reply = state.api.enabled ? await requestApi(input) : await new Promise(resolve => setTimeout(() => resolve(mockReply(input)), 650)); removeTyping(); addMessage('ai', reply); } catch (error) { removeTyping(); showToast(error.message); }
}

function openModal(id) { $('modalBackdrop').hidden = false; document.querySelectorAll('.modal').forEach(m => m.hidden = true); $(id).hidden = false; }
function closeModal() { $('modalBackdrop').hidden = true; }
function updateProfileView() { $('headingName').textContent = state.profile.name; $('headingAvatar').textContent = state.profile.avatar; $('styleSummary').textContent = state.profile.style; $('confidenceValue').textContent = `${state.profile.confidence}%`; $('confidenceBar').style.width = `${state.profile.confidence}%`; renderEmojis(); }
function renderEmojis() { const strip = $('emojiStrip'); strip.innerHTML = state.emojis.length ? state.emojis.map(e => `<img class="emoji-thumb" src="${e}" alt="上传的表情包" />`).join('') : '<div class="empty-emoji">上传你的真实表情包</div>'; }
function renderStyleDetail() { $('styleDetail').innerHTML = [['回复长度', state.length === '详细' ? '适中偏详细' : state.length], ['语言特点', state.profile.style], ['高频表达', '哈哈、真的嘛'], ['样本状态', '已加载当前风格档案'], ['风格匹配度', `${state.profile.confidence}%`]].map(([k,v]) => `<div class="detail-row"><span>${k}</span><strong>${escapeHtml(v)}</strong></div>`).join(''); }

function analyzeChat(text) {
  const hasLaugh = /哈哈|hh|笑哭/.test(text); const hasTilde = /～|~/.test(text); const lines = text.split(/\r?\n/).filter(Boolean).length;
  state.profile.style = `${lines > 12 ? '回复较丰富' : '简短'}口语化，${hasLaugh ? '常用“哈哈”等轻松表达' : '表达自然直接'}，${hasTilde ? '喜欢使用波浪号' : '标点使用克制'}。`;
  state.profile.confidence = Math.min(96, Math.max(58, 55 + Math.min(lines, 25) * 2)); updateProfileView(); saveState();
  $('styleDetail').innerHTML = [['回复长度', lines > 12 ? '适中偏详细' : '简短'], ['语言特点', state.profile.style], ['高频表达', hasLaugh ? '哈哈、真的嘛' : '资料不足，继续导入可提高准确度'], ['样本行数', `${lines} 行`], ['风格匹配度', `${state.profile.confidence}%`]].map(([k,v]) => `<div class="detail-row"><span>${k}</span><strong>${escapeHtml(v)}</strong></div>`).join('');
}

function resizeTextarea() { const el = $('messageInput'); el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 110)}px`; }

document.addEventListener('DOMContentLoaded', () => {
  loadState(); updateProfileView(); renderMessages(); renderStyleDetail();
  document.querySelectorAll('.chip').forEach(btn => btn.classList.toggle('active', btn.dataset.value === state.personality));
  document.querySelectorAll('#lengthSelect button').forEach(btn => btn.classList.toggle('active', btn.dataset.value === state.length));
  document.querySelectorAll('.chip').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.chip').forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.personality = btn.dataset.value; saveState(); }));
  document.querySelectorAll('#lengthSelect button').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('#lengthSelect button').forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.length = btn.dataset.value; saveState(); }));
  $('attitudeSelect').value = state.attitude; $('emojiToggle').classList.toggle('active', state.autoEmoji);
  $('attitudeSelect').addEventListener('change', e => { state.attitude = e.target.value; saveState(); });
  $('emojiToggle').addEventListener('click', () => { state.autoEmoji = !state.autoEmoji; $('emojiToggle').classList.toggle('active', state.autoEmoji); saveState(); });
  $('sendBtn').addEventListener('click', sendMessage); $('messageInput').addEventListener('input', resizeTextarea); $('messageInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  $('closeBanner').addEventListener('click', e => e.currentTarget.parentElement.remove());
  $('openImportBtn').addEventListener('click', () => openModal('importModal')); $('newProfileBtn').addEventListener('click', () => openModal('importModal'));
  $('openStyleBtn').addEventListener('click', () => { const imported = $('chatImportText').value.trim(); if (imported) analyzeChat(imported); else renderStyleDetail(); openModal('styleModal'); }); $('editStyleBtn').addEventListener('click', () => { renderStyleDetail(); openModal('styleModal'); });
  $('openSettingsBtn').addEventListener('click', () => openModal('settingsModal')); document.querySelector('[data-panel="settings"]').addEventListener('click', () => openModal('settingsModal')); document.querySelector('[data-panel="privacy"]').addEventListener('click', () => openModal('privacyModal'));
  document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeModal)); $('modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') closeModal(); });
  $('dropZone').addEventListener('click', () => $('chatFileInput').click()); $('chatFileInput').addEventListener('change', e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => $('chatImportText').value = reader.result; reader.readAsText(file); });
  $('analyzeBtn').addEventListener('click', () => { const text = $('chatImportText').value.trim(); if (!text) return showToast('请先粘贴或选择聊天记录'); analyzeChat(text); closeModal(); showToast('风格分析完成，已应用到当前对象'); });
  $('uploadEmojiBtn').addEventListener('click', () => $('emojiInput').click()); $('emojiBtn').addEventListener('click', () => $('emojiInput').click()); $('emojiInput').addEventListener('change', e => { [...e.target.files].slice(0, 6).forEach(file => { const reader = new FileReader(); reader.onload = () => { state.emojis.push(reader.result); updateProfileView(); saveState(); }; reader.readAsDataURL(file); }); showToast('表情包已添加'); });
  $('attachBtn').addEventListener('click', () => openModal('importModal'));
  $('voiceBtn').addEventListener('click', () => { if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) { const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; const recognition = new Recognition(); recognition.lang = 'zh-CN'; recognition.onresult = e => { $('messageInput').value += e.results[0][0].transcript; resizeTextarea(); }; recognition.start(); showToast('正在听，请说话'); } else { $('voiceInput').click(); } }); $('voiceInput').addEventListener('change', e => { if (e.target.files[0]) showToast(`已选择语音：${e.target.files[0].name}，语气分析将在下一版接入`); });
  $('saveSettingsBtn').addEventListener('click', () => { state.api = { base: $('apiBaseInput').value.trim(), model: $('apiModelInput').value.trim(), key: $('apiKeyInput').value.trim(), enabled: $('apiEnabledInput').checked }; $('modelStatus').textContent = state.api.enabled ? `自定义模型 · ${state.api.model || '未命名'}` : '本地模拟模式'; saveState(); closeModal(); showToast(state.api.enabled ? '自定义 API 已启用' : '已切换到本地模拟模式'); });
  $('apiBaseInput').value = state.api.base; $('apiModelInput').value = state.api.model; $('apiKeyInput').value = state.api.key; $('apiEnabledInput').checked = state.api.enabled; $('modelStatus').textContent = state.api.enabled ? `自定义模型 · ${state.api.model || '未命名'}` : '本地模拟模式';
  $('clearDataBtn').addEventListener('click', () => { localStorage.removeItem('chatmirror-state'); location.reload(); });
});
