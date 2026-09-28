// variabel state & dom
document.addEventListener('DOMContentLoaded', () => {
    const state = {
        conversations: JSON.parse(localStorage.getItem('studymate_chats')) || [],
        currentChatId: null,
        params: JSON.parse(localStorage.getItem('studymate_params')) || { ...CONFIG.defaultParams },
        theme: localStorage.getItem('studymate_theme') || 'dark',
        isProcessing: false,
        activeSubject: 'all',
        recognition: null,
        isListening: false
    };

    const aiService = new AIService();

    const elements = {
        sidebar: document.getElementById('sidebar'),
        toggleSidebarBtn: document.getElementById('toggleSidebarBtn'),
        closeSidebarBtn: document.getElementById('closeSidebarBtn'),
        newChatBtn: document.getElementById('newChatBtn'),
        historyList: document.getElementById('historyList'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeIcon: document.getElementById('themeIcon'),
        themeLabel: document.getElementById('themeLabel'),
        
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        settingsModal: document.getElementById('settingsModal'),
        saveParamsBtn: document.getElementById('saveParamsBtn'),
        resetParamsBtn: document.getElementById('resetParamsBtn'),
        toneSelect: document.getElementById('toneSelect'),
        roleSelect: document.getElementById('roleSelect'),
        detailSelect: document.getElementById('detailSelect'),
        apiProviderSelect: document.getElementById('apiProviderSelect'),
        apiKeyContainer: document.getElementById('apiKeyContainer'),
        apiKeyInput: document.getElementById('apiKeyInput'),
        systemPromptText: document.getElementById('systemPromptText'),
        
        currentToneLabel: document.getElementById('currentToneLabel'),
        currentRoleLabel: document.getElementById('currentRoleLabel'),
        currentEngineLabel: document.getElementById('currentEngineLabel'),

        welcomeView: document.getElementById('welcomeView'),
        messagesList: document.getElementById('messagesList'),
        chatContainer: document.getElementById('chatContainer'),
        typingIndicator: document.getElementById('typingIndicator'),
        samplePromptsGrid: document.getElementById('samplePromptsGrid'),
        suggestionsContainer: document.getElementById('suggestionsContainer'),
        suggestionChips: document.getElementById('suggestionChips'),

        chatForm: document.getElementById('chatForm'),
        userPrompt: document.getElementById('userPrompt'),
        sendBtn: document.getElementById('sendBtn'),
        voiceInputBtn: document.getElementById('voiceInputBtn'),
        micIcon: document.getElementById('micIcon'),

        clearChatBtn: document.getElementById('clearChatBtn'),
        exportChatBtn: document.getElementById('exportChatBtn'),
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),

        toastContainer: document.getElementById('toastContainer')
    };

    init();

    function init() {
        applyTheme(state.theme);
        initMarkedConfig();
        initSpeechRecognition();
        populateSamplePrompts();
        renderSubjectChips();
        renderHistoryList();
        syncParamUI();
        
        if (state.conversations.length > 0) {
            loadConversation(state.conversations[0].id);
        } else {
            createNewChat();
        }

        bindEvents();
    }

    // urus markdown & matematika
    function initMarkedConfig() {
        marked.setOptions({
            highlight: function(code, lang) {
                const language = highlight.getLanguage(lang) ? lang : 'plaintext';
                return highlight.highlight(code, { language }).value;
            },
            langPrefix: 'hljs language-',
            breaks: true,
            gfm: true
        });
    }

    function renderMarkdown(text) {
        let rawHtml = marked.parse(text);
        
        rawHtml = rawHtml.replace(/<pre><code(?:\s+class="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
            const cleanLang = lang ? lang.replace('hljs language-', '').replace('language-', '') : 'code';
            return `
                <div class="code-wrapper">
                    <div class="code-header">
                        <span><i class="fa-solid fa-code"></i> ${cleanLang.toUpperCase()}</span>
                        <button class="copy-code-btn" onclick="copyToClipboard(this)">
                            <i class="fa-regular fa-copy"></i> Salin Kode
                        </button>
                    </div>
                    <pre><code class="${lang || 'hljs'}">${code}</code></pre>
                </div>
            `;
        });

        return rawHtml;
    }

    function renderKaTeXMath(element) {
        if (window.renderMathInElement) {
            renderMathInElement(element, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }

    // event tombol & form
    function bindEvents() {
        elements.toggleSidebarBtn.addEventListener('click', () => elements.sidebar.classList.add('open'));
        elements.closeSidebarBtn.addEventListener('click', () => elements.sidebar.classList.remove('open'));
        elements.newChatBtn.addEventListener('click', () => createNewChat());

        elements.themeToggleBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('studymate_theme', state.theme);
            applyTheme(state.theme);
        });

        elements.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUserSubmit();
        });

        elements.userPrompt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserSubmit();
            }
        });

        elements.userPrompt.addEventListener('input', () => {
            elements.userPrompt.style.height = 'auto';
            elements.userPrompt.style.height = `${Math.min(elements.userPrompt.scrollHeight, 150)}px`;
        });

        elements.voiceInputBtn.addEventListener('click', toggleVoiceInput);

        elements.clearChatBtn.addEventListener('click', handleClearChat);
        elements.exportChatBtn.addEventListener('click', handleExportChat);

        elements.openSettingsBtn.addEventListener('click', () => {
            syncParamUI();
            elements.settingsModal.classList.remove('hidden');
        });

        elements.closeSettingsBtn.addEventListener('click', () => elements.settingsModal.classList.add('hidden'));

        elements.apiProviderSelect.addEventListener('change', (e) => {
            if (e.target.value === 'built_in') {
                elements.apiKeyContainer.classList.add('hidden');
            } else {
                elements.apiKeyContainer.classList.remove('hidden');
            }
        });

        elements.saveParamsBtn.addEventListener('click', saveParamsFromUI);
        elements.resetParamsBtn.addEventListener('click', resetParamsToDefault);

        document.querySelectorAll('.subject-chips .chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.subject-chips .chip').forEach(c => c.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                state.activeSubject = target.dataset.subject;
                populateSamplePrompts();
            });
        });
    }

    // kelola riwayat chat
    function createNewChat() {
        const newChat = {
            id: 'chat_' + Date.now(),
            title: 'Percakapan Baru',
            createdAt: new Date().toISOString(),
            messages: []
        };
        state.conversations.unshift(newChat);
        saveState();
        loadConversation(newChat.id);
        renderHistoryList();
        showToast('Percakapan baru dibuat!');
    }

    function loadConversation(chatId) {
        state.currentChatId = chatId;
        const currentChat = state.conversations.find(c => c.id === chatId);

        renderHistoryList();

        elements.messagesList.innerHTML = '';
        elements.suggestionsContainer.classList.add('hidden');

        if (!currentChat || currentChat.messages.length === 0) {
            elements.welcomeView.classList.remove('hidden');
        } else {
            elements.welcomeView.classList.add('hidden');
            currentChat.messages.forEach(msg => appendMessageUI(msg.role, msg.content, false));
            elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
            renderFollowUpSuggestions(currentChat.messages[currentChat.messages.length - 1].content);
        }
    }

    function getCurrentConversation() {
        return state.conversations.find(c => c.id === state.currentChatId);
    }

    function saveState() {
        localStorage.setItem('studymate_chats', JSON.stringify(state.conversations));
        localStorage.setItem('studymate_params', JSON.stringify(state.params));
    }

    // kirim pesan & balesan bot
    async function handleUserSubmit() {
        const promptText = elements.userPrompt.value.trim();
        if (!promptText || state.isProcessing) return;

        let currentChat = getCurrentConversation();
        if (!currentChat) {
            createNewChat();
            currentChat = getCurrentConversation();
        }

        elements.userPrompt.value = '';
        elements.userPrompt.style.height = 'auto';

        if (currentChat.messages.length === 0) {
            currentChat.title = promptText.length > 28 ? promptText.substring(0, 28) + '...' : promptText;
            renderHistoryList();
        }

        elements.welcomeView.classList.add('hidden');
        elements.suggestionsContainer.classList.add('hidden');

        const userMsg = { role: 'user', content: promptText };
        currentChat.messages.push(userMsg);
        appendMessageUI('user', promptText, true);
        saveState();

        state.isProcessing = true;
        setProcessingStatus(true);

        try {
            const aiResponseText = await aiService.generateResponse(currentChat.messages, state.params);
            
            const aiMsg = { role: 'assistant', content: aiResponseText };
            currentChat.messages.push(aiMsg);
            saveState();

            await appendAiMessageAnimated(aiResponseText);
            renderFollowUpSuggestions(aiResponseText);

        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
            appendMessageUI('assistant', `⚠️ **Ada masalah:** ${err.message}`);
        } finally {
            state.isProcessing = false;
            setProcessingStatus(false);
        }
    }

    function appendMessageUI(role, content, animate = false) {
        const row = document.createElement('div');
        row.className = `message-row ${role === 'user' ? 'user-row' : 'ai-row'}`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

        const wrapper = document.createElement('div');
        wrapper.className = 'message-content-wrapper';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (role === 'user') {
            bubble.textContent = content;
        } else {
            bubble.innerHTML = renderMarkdown(content);
            renderKaTeXMath(bubble);
        }

        const actions = document.createElement('div');
        actions.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'msg-action-btn';
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Salin';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(content);
            showToast('Teks berhasil disalin!');
        };
        actions.appendChild(copyBtn);

        if (role === 'assistant') {
            const speakBtn = document.createElement('button');
            speakBtn.className = 'msg-action-btn';
            speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Baca Suara';
            speakBtn.onclick = () => speakText(content);
            actions.appendChild(speakBtn);
        }

        wrapper.appendChild(bubble);
        wrapper.appendChild(actions);

        row.appendChild(avatar);
        row.appendChild(wrapper);

        elements.messagesList.appendChild(row);
        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }

    async function appendAiMessageAnimated(fullContent) {
        const row = document.createElement('div');
        row.className = 'message-row ai-row';

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

        const wrapper = document.createElement('div');
        wrapper.className = 'message-content-wrapper';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        wrapper.appendChild(bubble);
        row.appendChild(avatar);
        row.appendChild(wrapper);

        elements.messagesList.appendChild(row);

        const chunkSize = 8;
        for (let i = 0; i <= fullContent.length; i += chunkSize) {
            const currentChunk = fullContent.substring(0, i);
            bubble.innerHTML = renderMarkdown(currentChunk);
            elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
            await new Promise(r => setTimeout(r, 15));
        }

        bubble.innerHTML = renderMarkdown(fullContent);
        renderKaTeXMath(bubble);

        const actions = document.createElement('div');
        actions.className = 'message-actions';
        actions.innerHTML = `
            <button class="msg-action-btn" onclick="navigator.clipboard.writeText(\`${fullContent.replace(/`/g, '\\`')}\`); showToast('Disalin!');">
                <i class="fa-regular fa-copy"></i> Salin
            </button>
            <button class="msg-action-btn" onclick="window.speakText(\`${fullContent.replace(/"/g, '&quot;')}\`)">
                <i class="fa-solid fa-volume-high"></i> Baca Suara
            </button>
        `;
        wrapper.appendChild(actions);

        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }

    // rekomendasi pertanyaan
    function renderFollowUpSuggestions(lastAiMessage) {
        elements.suggestionChips.innerHTML = '';
        const lower = lastAiMessage.toLowerCase();
        let suggestions = CONFIG.followUpSuggestions.default;

        if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('algoritma')) {
            suggestions = CONFIG.followUpSuggestions.coding;
        } else if (lower.includes('hukum') || lower.includes('teori') || lower.includes('definisi')) {
            suggestions = CONFIG.followUpSuggestions.theoretical;
        }

        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'sug-chip';
            btn.textContent = text;
            btn.onclick = () => {
                elements.userPrompt.value = text;
                handleUserSubmit();
            };
            elements.suggestionChips.appendChild(btn);
        });

        elements.suggestionsContainer.classList.remove('hidden');
    }

    // sampel pertanyaan
    function populateSamplePrompts() {
        elements.samplePromptsGrid.innerHTML = '';
        const filtered = state.activeSubject === 'all' 
            ? CONFIG.samplePrompts 
            : CONFIG.samplePrompts.filter(p => p.subject === state.activeSubject);

        filtered.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'sample-prompt-btn';
            btn.innerHTML = `
                <div>
                    <strong><i class="${item.icon}"></i> ${item.title}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.category}</div>
                </div>
                <i class="fa-solid fa-arrow-right"></i>
            `;
            btn.onclick = () => {
                elements.userPrompt.value = item.prompt;
                handleUserSubmit();
            };
            elements.samplePromptsGrid.appendChild(btn);
        });
    }

    function renderSubjectChips() {}

    function renderHistoryList() {
        elements.historyList.innerHTML = '';
        if (state.conversations.length === 0) {
            elements.historyList.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); padding:10px;">Belum ada riwayat.</div>';
            return;
        }

        state.conversations.forEach(chat => {
            const item = document.createElement('div');
            item.className = `history-item ${chat.id === state.currentChatId ? 'active' : ''}`;
            item.innerHTML = `
                <span class="item-title">
                    <i class="fa-regular fa-message"></i> ${chat.title}
                </span>
                <button class="delete-hist-btn" title="Hapus Chat"><i class="fa-solid fa-xmark"></i></button>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-hist-btn')) {
                    loadConversation(chat.id);
                    if (window.innerWidth <= 868) elements.sidebar.classList.remove('open');
                }
            });

            item.querySelector('.delete-hist-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteConversation(chat.id);
            });

            elements.historyList.appendChild(item);
        });
    }

    function deleteConversation(chatId) {
        state.conversations = state.conversations.filter(c => c.id !== chatId);
        saveState();
        if (state.currentChatId === chatId) {
            if (state.conversations.length > 0) {
                loadConversation(state.conversations[0].id);
            } else {
                createNewChat();
            }
        } else {
            renderHistoryList();
        }
        showToast('Riwayat percakapan dihapus!');
    }

    function handleClearChat() {
        const currentChat = getCurrentConversation();
        if (!currentChat || currentChat.messages.length === 0) return;

        if (confirm('Yakin mau hapus semua pesan di chat ini?')) {
            currentChat.messages = [];
            currentChat.title = 'Percakapan Baru';
            saveState();
            loadConversation(currentChat.id);
            showToast('Chat udah dibersihin!');
        }
    }

    function handleExportChat() {
        const currentChat = getCurrentConversation();
        if (!currentChat || currentChat.messages.length === 0) {
            showToast('Belum ada chat buat diekspor!', 'warning');
            return;
        }

        let exportText = `# Percakapan StudyMate AI — ${currentChat.title}\n`;
        exportText += `Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}\n\n---\n\n`;

        currentChat.messages.forEach(msg => {
            const roleName = msg.role === 'user' ? '👤 Mahasiswa' : '🤖 StudyMate AI';
            exportText += `### ${roleName}:\n${msg.content}\n\n---\n\n`;
        });

        const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StudyMate_AI_${currentChat.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Chat berhasil diekspor ke Markdown!');
    }

    // simpan parameter setting
    function syncParamUI() {
        elements.toneSelect.value = state.params.tone || 'santai';
        elements.roleSelect.value = state.params.role || 'tutor';
        elements.detailSelect.value = state.params.detail || 'komprehensif';
        elements.apiProviderSelect.value = state.params.apiProvider || 'built_in';
        elements.apiKeyInput.value = state.params.apiKey || '';
        elements.systemPromptText.value = state.params.customSystemPrompt || '';

        if (elements.apiProviderSelect.value === 'built_in') {
            elements.apiKeyContainer.classList.add('hidden');
        } else {
            elements.apiKeyContainer.classList.remove('hidden');
        }

        const toneTextMap = {
            santai: 'Santai & Sederhana',
            formal: 'Formal & Akademis',
            analogi: 'Analogi & Cerita',
            ringkas: 'Ringkas & To the point'
        };

        const roleTextMap = {
            tutor: 'Teman Belajar',
            dosen: 'Dosen Pembimbing',
            quizmaster: 'Quiz Master',
            coder: 'Coding Mentor'
        };

        const engineTextMap = {
            built_in: 'Smart Study Engine (Built-in)',
            gemini: 'Google Gemini API',
            openrouter: 'OpenRouter API'
        };

        elements.currentToneLabel.textContent = toneTextMap[state.params.tone] || 'Santai';
        elements.currentRoleLabel.textContent = roleTextMap[state.params.role] || 'Teman Belajar';
        elements.currentEngineLabel.textContent = engineTextMap[state.params.apiProvider] || 'Smart AI';
    }

    function saveParamsFromUI() {
        state.params.tone = elements.toneSelect.value;
        state.params.role = elements.roleSelect.value;
        state.params.detail = elements.detailSelect.value;
        state.params.apiProvider = elements.apiProviderSelect.value;
        state.params.apiKey = elements.apiKeyInput.value.trim();
        state.params.customSystemPrompt = elements.systemPromptText.value.trim();

        saveState();
        syncParamUI();
        elements.settingsModal.classList.add('hidden');
        showToast('Pengaturan bot udah disimpan!');
    }

    function resetParamsToDefault() {
        state.params = { ...CONFIG.defaultParams };
        saveState();
        syncParamUI();
        showToast('Pengaturan balik ke standar.');
    }

    // suara & tema
    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            elements.voiceInputBtn.style.display = 'none';
            return;
        }

        state.recognition = new SpeechRecognition();
        state.recognition.lang = 'id-ID';
        state.recognition.interimResults = false;

        state.recognition.onstart = () => {
            state.isListening = true;
            elements.voiceInputBtn.classList.add('listening');
            showToast('Lagi dengerin suara... Ngomong aja.');
        };

        state.recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            elements.userPrompt.value += (elements.userPrompt.value ? ' ' : '') + transcript;
            elements.userPrompt.dispatchEvent(new Event('input'));
        };

        state.recognition.onend = () => {
            state.isListening = false;
            elements.voiceInputBtn.classList.remove('listening');
        };

        state.recognition.onerror = () => {
            state.isListening = false;
            elements.voiceInputBtn.classList.remove('listening');
            showToast('Gagal ngenalin suara.', 'error');
        };
    }

    function toggleVoiceInput() {
        if (!state.recognition) return;
        if (state.isListening) {
            state.recognition.stop();
        } else {
            state.recognition.start();
        }
    }

    window.speakText = function(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        
        const cleanText = text.replace(/```[\s\S]*?```/g, 'Kode program terlampir.').replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        showToast('Lagi nemenin baca suara...');
    };

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            elements.themeIcon.className = 'fa-solid fa-sun';
            elements.themeLabel.textContent = 'Mode Terang';
        } else {
            elements.themeIcon.className = 'fa-solid fa-moon';
            elements.themeLabel.textContent = 'Mode Gelap';
        }
    }

    function setProcessingStatus(isBusy) {
        if (isBusy) {
            elements.statusIndicator.classList.add('busy');
            elements.statusText.textContent = 'AI Lagi Mikir...';
            elements.typingIndicator.classList.remove('hidden');
            elements.sendBtn.disabled = true;
        } else {
            elements.statusIndicator.classList.remove('busy');
            elements.statusText.textContent = 'AI Ready';
            elements.typingIndicator.classList.add('hidden');
            elements.sendBtn.disabled = false;
        }
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}" style="color: ${type === 'error' ? '#ef4444' : '#10b981'};"></i>
            <span>${message}</span>
        `;
        elements.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }

    window.copyToClipboard = function(btn) {
        const pre = btn.closest('.code-wrapper').querySelector('pre code');
        navigator.clipboard.writeText(pre.textContent);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Kebagi/Disalin!';
        setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i> Salin Kode', 2000);
    };
});
