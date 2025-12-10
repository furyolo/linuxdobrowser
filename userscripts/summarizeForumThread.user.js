// ==UserScript==
// @name         Linux.do 智能总结
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Linux.do 帖子总结
// @author       半杯无糖、WolfHolo、Andy
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @require      https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :host {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

            --primary: #c96442;
            --primary-light: #e07d5c;
            --primary-dark: #a84d32;
            --primary-gradient: linear-gradient(135deg, #c96442 0%, #e08860 50%, #d4724e 100%);
            --primary-glow: rgba(201, 100, 66, 0.35);

            --success: #2d9d78;
            --success-light: #d1fae5;
            --danger: #dc4446;
            --danger-light: #fef2f2;
            --warning: #d4a054;

            --bg-base: #faf8f6;
            --bg-card: #ffffff;
            --bg-glass: rgba(255, 255, 255, 0.88);
            --bg-glass-dark: rgba(250, 248, 246, 0.96);
            --bg-hover: rgba(201, 100, 66, 0.08);
            --bg-active: rgba(201, 100, 66, 0.12);
            --bg-setting: #f5f2ef;
            --bg-input: #ffffff;
            --border-light: rgba(201, 100, 66, 0.12);
            --border-medium: rgba(201, 100, 66, 0.2);

            --shadow-sm: 0 1px 3px rgba(168, 77, 50, 0.06), 0 1px 2px rgba(168, 77, 50, 0.08);
            --shadow-md: 0 4px 12px -2px rgba(168, 77, 50, 0.12), 0 2px 6px -2px rgba(168, 77, 50, 0.08);
            --shadow-lg: 0 12px 40px -8px rgba(168, 77, 50, 0.18), 0 4px 12px -4px rgba(168, 77, 50, 0.08);
            --shadow-xl: 0 20px 50px -12px rgba(168, 77, 50, 0.25), 0 0 0 1px rgba(201, 100, 66, 0.05);
            --shadow-glow: 0 4px 20px var(--primary-glow), 0 0 0 1px rgba(201, 100, 66, 0.1);

            --text-main: #2d2520;
            --text-sec: #6b5d54;
            --text-muted: #9c8b80;
            --text-inverse: #ffffff;

            --sidebar-width: 420px;
            --btn-size: 52px;
            --radius-sm: 10px;
            --radius-md: 14px;
            --radius-lg: 18px;
            --radius-xl: 24px;
            --radius-full: 9999px;

            --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-slow: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        :host(.dark-theme) {
            --bg-base: #1a1614;
            --bg-card: #252220;
            --bg-glass: rgba(37, 34, 32, 0.92);
            --bg-glass-dark: rgba(26, 22, 20, 0.96);
            --bg-hover: rgba(224, 125, 92, 0.12);
            --bg-active: rgba(224, 125, 92, 0.18);
            --bg-setting: #1e1b19;
            --bg-input: #2d2926;
            --border-light: rgba(224, 125, 92, 0.15);
            --border-medium: rgba(224, 125, 92, 0.25);

            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
            --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 12px 40px -8px rgba(0, 0, 0, 0.4);
            --shadow-xl: 0 20px 50px -12px rgba(0, 0, 0, 0.5);

            --text-main: #f5f0eb;
            --text-sec: #b8a99d;
            --text-muted: #7a6d64;
        }

        * { box-sizing: border-box; }

        .sidebar-panel {
            position: fixed;
            top: 0;
            bottom: 0;
            width: var(--sidebar-width);
            background: var(--bg-glass-dark);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            box-shadow: var(--shadow-xl);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            transition: transform var(--transition-slow);
            border: 1px solid var(--border-light);
        }
        .panel-left {
            left: 0;
            border-left: none;
            border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
            transform: translateX(-100%);
        }
        .panel-left.open { transform: translateX(0); }
        .panel-right {
            right: 0;
            border-right: none;
            border-radius: var(--radius-xl) 0 0 var(--radius-xl);
            transform: translateX(100%);
        }
        .panel-right.open { transform: translateX(0); }

        #toggle-btn {
            position: fixed;
            width: var(--btn-size);
            height: var(--btn-size);
            background: var(--primary-gradient);
            color: white;
            box-shadow: var(--shadow-glow);
            z-index: 9999;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            transition: all var(--transition-normal);
            border: 2px solid rgba(255, 255, 255, 0.2);
            outline: none;
        }
        #toggle-btn::before {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: inherit;
            background: var(--primary-gradient);
            opacity: 0;
            z-index: -1;
            filter: blur(12px);
            transition: opacity var(--transition-normal);
        }
        #toggle-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 8px 30px var(--primary-glow), 0 0 0 4px rgba(201, 100, 66, 0.15);
        }
        #toggle-btn:hover::before {
            opacity: 0.6;
        }
        #toggle-btn:active {
            cursor: grabbing;
            transform: scale(0.96);
        }
        #toggle-btn svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
            transition: transform var(--transition-normal);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }

        .btn-snap-left { border-radius: 0 var(--radius-lg) var(--radius-lg) 0; }
        .btn-snap-right { border-radius: var(--radius-lg) 0 0 var(--radius-lg); }
        .btn-floating { border-radius: var(--radius-lg); }

        #toggle-btn.arrow-flip svg { transform: rotate(180deg); }

        .resize-handle {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 6px;
            cursor: col-resize;
            z-index: 10001;
            background: transparent;
            transition: background var(--transition-fast);
        }
        .resize-handle::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 3px;
            height: 40px;
            background: var(--primary);
            border-radius: 2px;
            opacity: 0;
            transition: opacity var(--transition-fast);
        }
        .resize-handle:hover::after { opacity: 0.5; }
        .handle-left { right: -3px; }
        .handle-right { left: -3px; }

        .header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-light);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(to bottom, var(--bg-card), transparent);
            flex-shrink: 0;
        }
        .header-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: -0.02em;
        }
        .header-title-icon {
            width: 36px;
            height: 36px;
            background: var(--primary-gradient);
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: var(--shadow-sm);
        }
        .header-actions { display: flex; gap: 6px; }

        .icon-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 10px;
            border-radius: var(--radius-sm);
            color: var(--text-sec);
            transition: all var(--transition-fast);
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .icon-btn:hover {
            background: var(--bg-hover);
            color: var(--primary);
            transform: scale(1.05);
        }
        .icon-btn:active {
            transform: scale(0.95);
        }
        .icon-btn.active {
            background: var(--bg-active);
            color: var(--primary);
        }

        .icon-btn[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 50%;
            right: calc(100% + 10px);
            transform: translateY(-50%) scale(0.9);
            background: var(--text-main);
            color: var(--text-inverse);
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all var(--transition-fast);
            z-index: 10000;
        }
        .icon-btn[data-tooltip]:hover::after {
            opacity: 1;
            transform: translateY(-50%) scale(1);
        }

        /* 聚焦模式下tooltip同样显示在左侧 */
        :host(.summary-focus-mode.show-top-ui) .header .icon-btn[data-tooltip]::after {
            top: 50%;
            right: calc(100% + 10px);
            bottom: auto;
            left: auto;
        }

        .tab-bar {
            display: flex;
            padding: 12px 16px;
            gap: 6px;
            border-bottom: 1px solid var(--border-light);
            background: var(--bg-glass);
            flex-shrink: 0;
        }
        .tab-item {
            flex: 1;
            padding: 12px 16px;
            text-align: center;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-sec);
            cursor: pointer;
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
        }
        .tab-item::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--primary-gradient);
            opacity: 0;
            transition: opacity var(--transition-fast);
        }
        .tab-item:hover {
            color: var(--primary);
            background: var(--bg-hover);
        }
        .tab-item.active {
            color: var(--text-inverse);
            background: var(--primary-gradient);
            box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .tab-item.active::before {
            opacity: 1;
        }
        .tab-item span {
            position: relative;
            z-index: 1;
        }

        .content-area {
            flex: 1;
            overflow-y: auto;
            position: relative;
            background: var(--bg-base);
        }
        .view-page {
            padding: 24px;
            display: none;
            animation: fadeSlideIn 0.35s ease;
        }
        .view-page.active { display: block; }
        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .form-group { margin-bottom: 24px; }
        .form-label {
            display: block;
            font-size: 11px;
            color: var(--text-sec);
            margin-bottom: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        input, textarea, select {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid var(--border-light);
            border-radius: var(--radius-md);
            font-size: 14px;
            font-family: inherit;
            background: var(--bg-input);
            box-sizing: border-box;
            transition: all var(--transition-fast);
            color: var(--text-main);
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(201, 100, 66, 0.12);
            background: var(--bg-card);
        }
        input::placeholder, textarea::placeholder {
            color: var(--text-muted);
        }
        textarea {
            resize: vertical;
            min-height: 100px;
            line-height: 1.6;
        }

        .btn {
            width: 100%;
            padding: 16px 24px;
            border: none;
            border-radius: var(--radius-md);
            background: var(--primary-gradient);
            color: var(--text-inverse);
            font-weight: 600;
            font-size: 15px;
            font-family: inherit;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all var(--transition-normal);
            box-shadow: var(--shadow-glow);
            letter-spacing: 0.02em;
            position: relative;
            overflow: hidden;
        }
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px var(--primary-glow);
        }
        .btn:hover::before {
            left: 100%;
        }
        .btn:active {
            transform: translateY(0) scale(0.98);
        }
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .btn-secondary {
            background: var(--bg-card);
            color: var(--text-main);
            box-shadow: var(--shadow-sm);
            border: 2px solid var(--border-light);
        }
        .btn-secondary:hover {
            background: var(--bg-hover);
            border-color: var(--primary);
            box-shadow: var(--shadow-md);
        }

        .btn-xs {
            padding: 8px 14px;
            font-size: 12px;
            font-family: inherit;
            background: var(--bg-card);
            color: var(--text-main);
            border-radius: var(--radius-sm);
            border: 1.5px solid var(--border-light);
            cursor: pointer;
            white-space: nowrap;
            font-weight: 600;
            transition: all var(--transition-fast);
        }
        .btn-xs:hover {
            background: var(--primary);
            color: var(--text-inverse);
            border-color: var(--primary);
            transform: translateY(-1px);
        }

        .result-box {
            margin-top: 20px;
            padding: 24px;
            background: var(--bg-card);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            font-size: 14px;
            line-height: 1.8;
            color: var(--text-main);
            min-height: 180px;
            max-height: calc(100vh - 380px);
            overflow-y: auto;
            word-break: break-word;
            box-shadow: var(--shadow-sm);
            position: relative;
        }
        .result-box::-webkit-scrollbar {
            width: 4px;
        }
        .result-box::-webkit-scrollbar-track {
            background: transparent;
        }
        .result-box::-webkit-scrollbar-thumb {
            background: rgba(156, 139, 128, 0.3);
            border-radius: 2px;
        }
        .result-box::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 139, 128, 0.5);
        }
        .result-box.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            font-size: 13px;
            text-align: center;
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-base) 100%);
        }

        .result-actions {
            position: sticky;
            top: 12px;
            right: 12px;
            display: flex;
            gap: 6px;
            opacity: 0;
            transition: opacity var(--transition-fast);
            margin-left: auto;
            width: fit-content;
            z-index: 10;
            float: right;
        }
        .result-actions:hover {
            opacity: 1;
        }
        .result-action-btn {
            padding: 6px 12px;
            font-size: 11px;
            font-family: inherit;
            background: var(--bg-glass);
            color: var(--text-sec);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all var(--transition-fast);
            backdrop-filter: blur(8px);
        }
        .result-action-btn:hover {
            background: var(--primary);
            color: var(--text-inverse);
            border-color: var(--primary);
        }
        .result-action-btn.copied {
            background: var(--success);
            color: var(--text-inverse);
            border-color: var(--success);
        }

        .result-box h1, .result-box h2, .result-box h3 {
            margin: 20px 0 12px;
            font-weight: 700;
            color: var(--text-main);
            letter-spacing: -0.02em;
        }
        .result-box h1 { font-size: 1.5em; }
        .result-box h2 { font-size: 1.25em; border-bottom: 2px solid var(--border-light); padding-bottom: 8px; }
        .result-box h3 { font-size: 1.1em; color: var(--primary); }
        .result-box p { margin-bottom: 14px; }
        .result-box ul, .result-box ol { padding-left: 24px; margin: 12px 0; }
        .result-box li { margin-bottom: 8px; }
        .result-box li::marker { color: var(--primary); }
        .result-box code {
            background: var(--bg-hover);
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'JetBrains Mono', 'SF Mono', monospace;
            color: var(--primary-dark);
            font-size: 0.88em;
            border: 1px solid var(--border-light);
        }
        .result-box pre {
            background: linear-gradient(135deg, #2d2520 0%, #3d332c 100%);
            padding: 18px;
            border-radius: var(--radius-md);
            overflow-x: auto;
            color: #f5f0eb;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .result-box pre code {
            background: none;
            color: #f5f0eb;
            padding: 0;
            border: none;
        }
        .result-box blockquote {
            border-left: 4px solid var(--primary);
            margin: 16px 0;
            padding: 14px 20px;
            color: var(--text-sec);
            background: var(--bg-hover);
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            font-style: italic;
        }
        .result-box a {
            color: var(--primary);
            text-decoration: none;
            border-bottom: 1px solid var(--primary-light);
            transition: all var(--transition-fast);
        }
        .result-box a:hover {
            color: var(--primary-dark);
            border-bottom-color: var(--primary-dark);
        }
        .result-box strong {
            color: var(--primary-dark);
            font-weight: 600;
        }

        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
        }

        .chat-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--border-light);
            margin-bottom: 14px;
        }
        .chat-toolbar-title {
            font-size: 13px;
            color: var(--text-sec);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .chat-toolbar-title .msg-count {
            background: var(--primary-gradient);
            color: var(--text-inverse);
            font-size: 11px;
            padding: 3px 10px;
            border-radius: var(--radius-full);
            font-weight: 700;
            box-shadow: var(--shadow-sm);
        }
        .btn-clear {
            padding: 8px 14px;
            font-size: 12px;
            font-family: inherit;
            background: var(--danger-light);
            color: var(--danger);
            border-radius: var(--radius-sm);
            border: 1px solid transparent;
            cursor: pointer;
            font-weight: 600;
            transition: all var(--transition-fast);
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .btn-clear:hover {
            background: var(--danger);
            color: var(--text-inverse);
            transform: scale(1.02);
        }

        .chat-messages-wrapper {
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        .chat-messages {
            height: 100%;
            overflow-y: auto;
            padding: 16px 0;
        }
        .chat-list { display: flex; flex-direction: column; gap: 18px; }

        .bubble {
            padding: 16px 20px;
            border-radius: var(--radius-lg);
            font-size: 14px;
            line-height: 1.75;
            max-width: 88%;
            word-break: break-word;
            box-shadow: var(--shadow-sm);
            animation: bubbleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
        }
        @keyframes bubbleIn {
            from { opacity: 0; transform: translateY(15px) scale(0.92); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bubble-user {
            align-self: flex-end;
            background: var(--primary-gradient);
            color: var(--text-inverse);
            border-bottom-right-radius: 6px;
            box-shadow: var(--shadow-glow);
        }
        .bubble-ai {
            align-self: flex-start;
            background: var(--bg-card);
            border: 1px solid var(--border-light);
            color: var(--text-main);
            border-bottom-left-radius: 6px;
        }

        .bubble-ai h1, .bubble-ai h2, .bubble-ai h3 { margin: 12px 0 8px; }
        .bubble-ai p { margin-bottom: 10px; }
        .bubble-ai p:last-child { margin-bottom: 0; }
        .bubble-ai code {
            background: var(--bg-hover);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85em;
        }

        .bubble-ai .thinking-block {
            margin: -6px -8px 12px;
            border-radius: var(--radius-sm);
        }
        .bubble-ai .thinking-block:last-child {
            margin-bottom: -6px;
        }
        .bubble-ai .thinking-header {
            padding: 8px 12px;
        }
        .bubble-ai .thinking-preview {
            padding: 0 12px 10px;
            font-size: 11px;
        }
        .bubble-ai .thinking-content-inner {
            padding: 10px 12px 12px;
            font-size: 11px;
            max-height: 300px;
        }

        .scroll-buttons {
            position: absolute;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 10;
            transition: all var(--transition-normal);
        }
        .scroll-buttons.top-area { top: 10px; }
        .scroll-buttons.bottom-area { bottom: 10px; }
        .scroll-btn {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-full);
            background: var(--bg-card);
            border: 1px solid var(--border-light);
            box-shadow: var(--shadow-md);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-sec);
            transition: all var(--transition-fast);
            opacity: 0;
            transform: scale(0.8);
            pointer-events: none;
        }
        .scroll-btn.visible {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
        }
        .scroll-btn:hover {
            background: var(--primary);
            color: var(--text-inverse);
            border-color: var(--primary);
            box-shadow: var(--shadow-glow);
            transform: scale(1.1);
        }
        .scroll-btn.generating {
            background: var(--primary-gradient);
            color: var(--text-inverse);
            border-color: var(--primary);
            box-shadow: var(--shadow-glow);
            animation: pulse-btn 1.5s ease-in-out infinite;
        }
        .scroll-btn.generating::after {
            content: '新内容';
            position: absolute;
            right: 42px;
            background: var(--primary-gradient);
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 12px;
            white-space: nowrap;
            box-shadow: var(--shadow-md);
            animation: fadeIn 0.3s ease;
        }
        @keyframes pulse-btn {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .scroll-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        .chat-input-area {
            border-top: 1px solid var(--border-light);
            padding: 18px 0 0;
            flex-shrink: 0;
            background: linear-gradient(to top, var(--bg-base), transparent);
        }
        .chat-input-row { display: flex; gap: 14px; align-items: flex-end; }
        .chat-input {
            flex: 1;
            min-height: 52px;
            max-height: 140px;
            border-radius: var(--radius-xl);
            padding: 16px 22px;
            resize: none;
            border: 2px solid var(--border-light);
            font-size: 14px;
            line-height: 1.5;
            transition: all var(--transition-fast);
        }
        .chat-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(201, 100, 66, 0.12);
        }
        .chat-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: var(--bg-setting);
        }
        .chat-input::placeholder {
            color: var(--text-muted);
            font-style: italic;
        }

        .thinking-block {
            margin-bottom: 16px;
            border-radius: var(--radius-md);
            overflow: hidden;
            background: linear-gradient(135deg, rgba(201, 100, 66, 0.05) 0%, rgba(201, 100, 66, 0.02) 100%);
            border: 1px solid rgba(201, 100, 66, 0.12);
            transition: all var(--transition-normal);
        }
        .thinking-block:hover {
            border-color: rgba(201, 100, 66, 0.22);
            box-shadow: 0 2px 12px rgba(201, 100, 66, 0.06);
        }
        .thinking-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            cursor: pointer;
            user-select: none;
            transition: background var(--transition-fast);
        }
        .thinking-header:hover {
            background: rgba(201, 100, 66, 0.05);
        }
        .thinking-header-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .thinking-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            background: var(--primary-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: var(--shadow-sm);
            flex-shrink: 0;
        }
        .thinking-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-dark);
        }
        .thinking-status {
            font-size: 10px;
            color: var(--text-muted);
            background: rgba(201, 100, 66, 0.1);
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 6px;
        }
        .thinking-block.streaming .thinking-status {
            background: var(--primary);
            color: white;
            animation: status-pulse 1.2s ease-in-out infinite;
        }
        @keyframes status-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        .thinking-toggle {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: rgba(201, 100, 66, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
            flex-shrink: 0;
        }
        .thinking-toggle:hover {
            background: rgba(201, 100, 66, 0.15);
        }
        .thinking-toggle svg {
            width: 12px;
            height: 12px;
            fill: var(--primary);
            transition: transform var(--transition-normal);
        }
        .thinking-block.expanded .thinking-toggle svg {
            transform: rotate(180deg);
        }

        .thinking-preview {
            padding: 0 14px 12px;
            font-size: 12px;
            line-height: 1.5;
            color: var(--text-muted);
            max-height: 4.5em;
            overflow: hidden;
            position: relative;
        }
        .thinking-preview p {
            margin: 0 0 4px;
            font-size: 12px;
        }
        .thinking-preview p:last-child {
            margin-bottom: 0;
        }
        .thinking-preview::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 24px;
            background: linear-gradient(to bottom, transparent, rgba(253, 250, 247, 0.98));
            pointer-events: none;
        }
        .thinking-block.expanded .thinking-preview {
            display: none;
        }

        .thinking-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .thinking-block.expanded .thinking-content {
            max-height: 5000px;
        }
        .thinking-content-inner {
            padding: 12px 14px 14px;
            font-size: 12px;
            line-height: 1.7;
            color: var(--text-sec);
            border-top: 1px dashed rgba(201, 100, 66, 0.12);
            max-height: 400px;
            overflow-y: auto;
        }
        .thinking-content-inner p {
            margin-bottom: 8px;
            font-size: 12px;
        }
        .thinking-content-inner p:last-child {
            margin-bottom: 0;
        }
        .thinking-content-inner h1,
        .thinking-content-inner h2,
        .thinking-content-inner h3 {
            font-size: 13px;
            margin: 10px 0 6px;
            color: var(--primary-dark);
        }
        .thinking-content-inner ul,
        .thinking-content-inner ol {
            padding-left: 18px;
            margin: 6px 0;
        }
        .thinking-content-inner li {
            margin-bottom: 4px;
            font-size: 12px;
        }
        .thinking-content-inner code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            background: rgba(201, 100, 66, 0.08);
            padding: 1px 5px;
            border-radius: 3px;
        }
        .thinking-content-inner pre {
            background: rgba(45, 37, 32, 0.9);
            padding: 10px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 11px;
        }
        .thinking-content-inner pre code {
            background: none;
            padding: 0;
        }
        .thinking-content-inner::-webkit-scrollbar {
            width: 3px;
        }
        .thinking-content-inner::-webkit-scrollbar-track {
            background: transparent;
        }
        .thinking-content-inner::-webkit-scrollbar-thumb {
            background: rgba(201, 100, 66, 0.25);
            border-radius: 2px;
        }
        .thinking-content-inner::-webkit-scrollbar-thumb:hover {
            background: rgba(201, 100, 66, 0.4);
        }

        .thinking-block.streaming .thinking-icon {
            animation: pulse-glow 1.5s ease-in-out infinite;
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: var(--shadow-sm); }
            50% { box-shadow: 0 0 10px var(--primary-glow); }
        }

        :host(.dark-theme) .thinking-block {
            background: linear-gradient(135deg, rgba(224, 125, 92, 0.06) 0%, rgba(224, 125, 92, 0.02) 100%);
            border-color: rgba(224, 125, 92, 0.15);
        }
        :host(.dark-theme) .thinking-header:hover {
            background: rgba(224, 125, 92, 0.06);
        }
        :host(.dark-theme) .thinking-title {
            color: var(--primary-light);
        }
        :host(.dark-theme) .thinking-toggle {
            background: rgba(224, 125, 92, 0.12);
        }
        :host(.dark-theme) .thinking-content-inner {
            border-top-color: rgba(224, 125, 92, 0.15);
        }
        :host(.dark-theme) .thinking-preview::after {
            background: linear-gradient(to bottom, transparent, rgba(37, 34, 32, 0.98));
        }

        :host(.dark-theme) .content-area::-webkit-scrollbar-track {
            background: rgba(224, 125, 92, 0.05);
        }
        :host(.dark-theme) .result-box::-webkit-scrollbar-thumb {
            background: rgba(184, 169, 157, 0.25);
        }
        :host(.dark-theme) .result-box::-webkit-scrollbar-thumb:hover {
            background: rgba(184, 169, 157, 0.4);
        }
        :host(.dark-theme) .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(184, 169, 157, 0.2);
        }
        :host(.dark-theme) .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: rgba(184, 169, 157, 0.35);
                }
                :host(.dark-theme) .thinking-content-inner::-webkit-scrollbar-thumb {
                    background: rgba(224, 125, 92, 0.2);
                }
                :host(.dark-theme) .thinking-content-inner::-webkit-scrollbar-thumb:hover {
                    background: rgba(224, 125, 92, 0.35);
                }
        
                /* 代码块样式优化 - 支持长行自动换行，无横向滚动条 */
                .result-box pre code,
                .bubble-ai pre code,
                .thinking-content-inner pre code {
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                }
        
                .result-box pre,
                .bubble-ai pre,
                .thinking-content-inner pre {
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    overflow-x: hidden !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
        
                /* 文本换行优化 - 处理长文本、URL、中英混合溢出 */
                .result-box,
                .bubble-ai,
                .thinking-content-inner,
                .result-box p,
                .bubble-ai p,
                .thinking-content-inner p {
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    white-space: normal !important;
                    hyphens: auto;
                    overflow-x: hidden !important;
                    max-width: 100% !important;
                }
        
                .result-box a,
                .bubble-ai a,
                .thinking-content-inner a {
                    word-break: break-all !important;
                    overflow-wrap: break-word !important;
                    hyphens: auto;
                }
        
                /* 容器确保无溢出 */
                .result-box,
                .bubble-ai,
                .thinking-content-inner {
                    box-sizing: border-box !important;
                    width: 100% !important;
                }
        
                .send-btn {
            width: 52px;
            height: 52px;
            border-radius: var(--radius-full);
            padding: 0;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-gradient);
            border: none;
            cursor: pointer;
            transition: all var(--transition-normal);
            box-shadow: var(--shadow-glow);
        }
        .send-btn:hover {
            transform: scale(1.08) rotate(5deg);
            box-shadow: 0 8px 30px var(--primary-glow);
        }
        .send-btn:active {
            transform: scale(0.95);
        }
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        .send-btn svg {
            width: 22px;
            height: 22px;
            fill: white;
            margin-left: 3px;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        }

        .settings-page {
            background: var(--bg-setting);
            min-height: 100%;
            padding: 24px;
            box-sizing: border-box;
        }
        .settings-group {
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            overflow: hidden;
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-light);
        }
        .settings-group-title {
            font-size: 11px;
            color: var(--primary);
            text-transform: uppercase;
            padding: 20px 20px 10px;
            font-weight: 700;
            letter-spacing: 0.1em;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .settings-group-title::before {
            content: '';
            width: 4px;
            height: 14px;
            background: var(--primary-gradient);
            border-radius: 2px;
        }
        .setting-item {
            padding: 18px 20px;
            border-bottom: 1px solid var(--border-light);
            transition: background var(--transition-fast);
        }
        .setting-item:last-child { border-bottom: none; }
        .setting-item:hover { background: var(--bg-hover); }
        .setting-label {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
            margin-bottom: 6px;
            display: block;
        }
        .setting-desc {
            font-size: 12px;
            color: var(--text-sec);
            margin-bottom: 12px;
            line-height: 1.6;
        }

        .setting-item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .setting-item-row .setting-info {
            flex: 1;
            margin-right: 16px;
        }
        .setting-item-row .setting-label {
            margin-bottom: 4px;
        }
        .setting-item-row .setting-desc {
            margin-bottom: 0;
        }

        .toggle-switch {
            position: relative;
            width: 52px;
            height: 28px;
            flex-shrink: 0;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--border-medium);
            border-radius: var(--radius-full);
            transition: all var(--transition-normal);
        }
        .toggle-slider::before {
            content: '';
            position: absolute;
            height: 22px;
            width: 22px;
            left: 3px;
            bottom: 3px;
            background: white;
            border-radius: 50%;
            transition: all var(--transition-normal);
            box-shadow: var(--shadow-sm);
        }
        .toggle-switch input:checked + .toggle-slider {
            background: var(--primary-gradient);
            box-shadow: var(--shadow-glow);
        }
        .toggle-switch input:checked + .toggle-slider::before {
            transform: translateX(24px);
        }
        .toggle-switch input:focus + .toggle-slider {
            box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.2);
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2.5px solid rgba(255,255,255,0.25);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            display: none;
        }
        .btn.loading .spinner { display: inline-block; }
        .btn.loading .btn-text { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .thinking {
            display: flex;
            gap: 5px;
            padding: 8px 0;
        }
        .thinking-dot {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: thinking 1.4s ease-in-out infinite;
        }
        .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes thinking {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
        }

        .tip-text {
            text-align: center;
            color: var(--text-muted);
            font-size: 14px;
            padding: 50px 24px;
            line-height: 2;
        }
        .tip-text strong {
            color: var(--primary);
        }
        .tip-text .tip-icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
            opacity: 0.7;
        }
        .hidden { display: none !important; }

        /* 聚焦模式样式 - 总结页面沉浸式阅读 */
        :host(.summary-focus-mode) .header {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            border: none;
            transition: all var(--transition-normal);
            pointer-events: none;
        }

        :host(.summary-focus-mode) .tab-bar {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            border: none;
            transition: all var(--transition-normal);
            pointer-events: none;
        }

        /* 当鼠标在顶部时显示header和tab */
        :host(.summary-focus-mode.show-top-ui) .header {
            max-height: 100px;
            opacity: 1;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-light);
            pointer-events: auto;
        }

        :host(.summary-focus-mode.show-top-ui) .tab-bar {
            max-height: 80px;
            opacity: 1;
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-light);
            pointer-events: auto;
        }

        :host(.summary-focus-mode) #page-summary .form-group {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            transition: all var(--transition-normal);
            pointer-events: none;
        }

        :host(.summary-focus-mode) #page-summary #btn-summary {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            transition: all var(--transition-normal);
            pointer-events: none;
        }

        :host(.summary-focus-mode) #page-summary .shortcut-hint {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin: 0;
            padding: 0;
            transition: all var(--transition-normal);
            pointer-events: none;
        }

        /* 当鼠标在顶部时显示控制区域 */
        :host(.summary-focus-mode.show-top-ui) #page-summary .form-group {
            max-height: 300px;
            opacity: 1;
            margin-bottom: 24px;
            pointer-events: auto;
        }

        :host(.summary-focus-mode.show-top-ui) #page-summary #btn-summary {
            max-height: 100px;
            opacity: 1;
            padding: 16px 24px;
            pointer-events: auto;
        }

        :host(.summary-focus-mode.show-top-ui) #page-summary .shortcut-hint {
            max-height: 50px;
            opacity: 1;
            pointer-events: auto;
        }

        :host(.summary-focus-mode) #page-summary {
            padding-top: 24px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        :host(.summary-focus-mode) #page-summary #summary-result {
            margin-top: 0;
            flex: 1;
            min-height: 0;
            max-height: none;
        }

        /* 聚焦模式下content-area也要填充 */
        :host(.summary-focus-mode) .content-area {
            display: flex;
            flex-direction: column;
        }

        :host(.summary-focus-mode) #page-summary.active {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .content-area::-webkit-scrollbar {
            width: 6px;
        }
        .content-area::-webkit-scrollbar-track {
            background: rgba(201, 100, 66, 0.05);
            border-radius: 3px;
        }
        .content-area::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--primary-light), var(--primary));
            border-radius: 3px;
        }
        .content-area::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, var(--primary), var(--primary-dark));
        }

        .chat-messages::-webkit-scrollbar {
            width: 5px;
        }
        .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(156, 139, 128, 0.25);
            border-radius: 3px;
        }
        .chat-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 139, 128, 0.45);
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .range-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
        }
        .range-buttons {
            display: flex;
            gap: 8px;
        }
        .range-inputs {
            display: flex;
            gap: 14px;
            align-items: center;
        }
        .range-inputs input {
            flex: 1;
        }
        .range-separator {
            color: var(--text-muted);
            font-size: 18px;
            font-weight: 300;
        }

        .shortcut-hint {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 12px;
        }
        .kbd {
            display: inline-flex;
            padding: 3px 7px;
            background: var(--bg-card);
            border: 1px solid var(--border-light);
            border-radius: 5px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            box-shadow: var(--shadow-sm);
        }

        .toast {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--text-main);
            color: var(--text-inverse);
            padding: 12px 20px;
            border-radius: var(--radius-md);
            font-size: 12px;
            font-weight: 500;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: all var(--transition-normal);
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 90%;
            text-align: center;
        }
        .toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        .toast.error { background: var(--danger); }
    `;

    const Core = {
        getTopicId: () => window.location.href.match(/\/topic\/(\d+)/)?.[1],

        parseThinkingContent(text) {
            if (!text) return { thinking: '', content: '' };

            let thinkingParts = [];
            let mainContent = text;

            const thinkingPatterns = [
                /<think>([\s\S]*?)<\/think>/gi,
                /<thinking>([\s\S]*?)<\/thinking>/gi,
                /<reason>([\s\S]*?)<\/reason>/gi,
                /<reasoning>([\s\S]*?)<\/reasoning>/gi,
                /<reflection>([\s\S]*?)<\/reflection>/gi,
                /<inner_thought>([\s\S]*?)<\/inner_thought>/gi,
                /<think>([\s\S]*?)<\\think>/gi,
                /<thinking>([\s\S]*?)<\\thinking>/gi,
                /<\|think\|>([\s\S]*?)<\|\/think\|>/gi,
                /<\|thinking\|>([\s\S]*?)<\|\/thinking\|>/gi,
                /\[think\]([\s\S]*?)\[\/think\]/gi,
                /\[thinking\]([\s\S]*?)\[\/thinking\]/gi,
            ];

            for (const pattern of thinkingPatterns) {
                pattern.lastIndex = 0;
                let match;
                while ((match = pattern.exec(mainContent)) !== null) {
                    const thinkContent = match[1].trim();
                    if (thinkContent) {
                        thinkingParts.push(thinkContent);
                    }
                    mainContent = mainContent.replace(match[0], '');
                    pattern.lastIndex = 0;
                }
            }

            const unclosedPatterns = [
                { start: /<think>/i, end: /<\/think>|<\\think>/i, tag: '<think>' },
                { start: /<thinking>/i, end: /<\/thinking>|<\\thinking>/i, tag: '<thinking>' },
                { start: /<\|think\|>/i, end: /<\|\/think\|>/i, tag: '<|think|>' },
            ];

            for (const { start, end, tag } of unclosedPatterns) {
                const startMatch = mainContent.match(start);
                if (startMatch && !end.test(mainContent)) {
                    const startIdx = mainContent.indexOf(startMatch[0]);
                    const thinkContent = mainContent.slice(startIdx + startMatch[0].length).trim();
                    if (thinkContent) {
                        thinkingParts.push(thinkContent + ' ⏳');
                        mainContent = mainContent.slice(0, startIdx);
                    }
                    break;
                }
            }

            return {
                thinking: thinkingParts.join('\n\n'),
                content: mainContent.trim()
            };
        },

        renderWithThinking(text, isStreaming = false, keepExpanded = false) {
            const { thinking, content } = this.parseThinkingContent(text);
            const arrowIcon = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`;

            let html = '';

            if (thinking) {
                const charCount = thinking.length;
                const streamingClass = isStreaming ? ' streaming' : '';
                const expandedClass = keepExpanded ? ' expanded' : '';
                const statusText = isStreaming ? '思考中...' : `${charCount} 字`;
                const lines = thinking.split('\n').filter(l => l.trim());
                const previewLines = lines.slice(-4).join('\n');
                const previewText = previewLines.length > 150
                    ? '...' + previewLines.slice(-150)
                    : previewLines;
                const thinkingHtml = DOMPurify.sanitize(marked.parse(thinking));
                const previewHtml = DOMPurify.sanitize(marked.parse(previewText));

                html += `
                    <div class="thinking-block${streamingClass}${expandedClass}" data-thinking-block>
                        <div class="thinking-header" data-thinking-toggle>
                            <div class="thinking-header-left">
                                <div class="thinking-icon">🧠</div>
                                <span class="thinking-title">思考过程</span>
                                <span class="thinking-status">${statusText}</span>
                            </div>
                            <div class="thinking-toggle">${arrowIcon}</div>
                        </div>
                        <div class="thinking-preview">${previewHtml}</div>
                        <div class="thinking-content">
                            <div class="thinking-content-inner">${thinkingHtml}</div>
                        </div>
                    </div>
                `;
            }

            if (content) {
                html += DOMPurify.sanitize(marked.parse(content));
            }

            return html;
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        getReplyCount: () => {
            const el = document.querySelector('.timeline-replies');
            if (!el) return 0;
            const txt = el.textContent.trim();
            return parseInt(txt.includes('/') ? txt.split('/')[1] : txt) || 0;
        },

        async fetchDialogues(building, start, end) {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
    const opts = { headers: { 'x-csrf-token': csrf, 'x-requested-with': 'XMLHttpRequest' } };

    const idRes = await fetch(`https://linux.do/t/${building}/post_ids.json?post_number=0&limit=99999`, opts);
    const idData = await idRes.json();
    let pIds = idData.post_ids.slice(Math.max(0, start - 1), end);

    if (start <= 1) {
        const mainRes = await fetch(`https://linux.do/t/${building}.json`, opts);
        const mainData = await mainRes.json();
        const firstId = mainData.post_stream.posts[0].id;
        if (!pIds.includes(firstId)) pIds.unshift(firstId);
    }

    let text = "";
    // 用于存储所有帖子信息，方便查找回复目标
    const postsMap = new Map();

    for (let i = 0; i < pIds.length; i += 200) {
        const chunk = pIds.slice(i, i + 200);
        const q = chunk.map(id => `post_ids[]=${id}`).join('&');
        const res = await fetch(`https://linux.do/t/${building}/posts.json?${q}&include_suggested=false`, opts);
        const data = await res.json();

        // 先收集所有帖子信息到 Map 中
        data.post_stream.posts.forEach(p => {
            postsMap.set(p.post_number, {
                name: p.name || p.username,  // name 可能为空，fallback 到 username
                username: p.username,
                replyTo: p.reply_to_post_number,
                replyToUser: p.reply_to_user  // 包含被回复者信息
            });
        });

        // 格式化输出
        text += data.post_stream.posts.map(p => {
            let content = p.cooked;

            // 1. 先全局处理媒体元素（图片、附件、Emoji），确保引用内外一致
            // 图片：优先href (original)，fallback data-download-href full URL，fallback img src original
            content = content.replace(/<div class="lightbox-wrapper">\s*<a class="lightbox" href="([^"]+)"(?:\s+data-download-href="([^"]+)")?[^>]*title="([^"]*)"[^>]*>[\s\S]*?<\/a>\s*<\/div>/gi, (match, hrefUrl, downloadHref, title) => {
                let imgUrl = hrefUrl || `https://linux.do${downloadHref || ''}`;
                const filename = title || '图片';
                return `\n[图片: ${filename}](${imgUrl})\n`;
            });

            // 附件
            content = content.replace(/<a class="attachment" href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, (match, url, name) => {
                return `\n[附件: ${name.trim()}](${url})\n`;
            });

            // Emoji：保留alt文本
            content = content.replace(/<img[^>]+class="emoji[^>]*alt="([^"]*)"[^>]*>/gi, '$1 ');

            // 2. 处理引用块：提取并清理blockquote内容
            content = content.replace(/<aside class="quote(?:-modified)?[^>]*>[\s\S]*?<blockquote>([\s\S]*?)<\/blockquote>[\s\S]*?<\/aside>/gi, (match, quoteInner) => {
                // quoteInner 已全局处理媒体，只需去除剩余标签
                let cleanQuote = quoteInner.replace(/<[^>]+>/g, '').trim();
                return `\n[引用]\n${cleanQuote}\n[/引用]\n`;
            });

            // 3. 去除所有剩余HTML标签
            content = content.replace(/<[^>]+>/g, '').trim();

            // 当前用户信息：name（username）
            const userName = p.name || p.username;
            const userPart = `${userName}（${p.username}）`;

            // 构建回复部分（如果存在）
            let replyPart = '';
            if (p.reply_to_post_number && p.reply_to_user) {
                const replyToName = p.reply_to_user.name || p.reply_to_user.username;
                const replyToUsername = p.reply_to_user.username;
                replyPart = `-回复[${p.reply_to_post_number}楼] ${replyToName}（${replyToUsername}）`;
            }

            // 最终格式：[楼层号] 用户名（用户id）-回复[楼层号] 用户名（用户id）:内容
            return `[${p.post_number}楼] ${userPart}${replyPart}:\n${content}`;
        }).join('\n\n');
    }
    return text;
},

        async streamChat(messages, onChunk, onDone, onError) {
            const key = GM_getValue('apiKey', '');
            const url = GM_getValue('apiUrl', 'https://api.openai.com/v1/chat/completions');
            const model = GM_getValue('model', 'deepseek-chat');
            const useStream = GM_getValue('useStream', true);

            if (!key) return onError("未配置 API Key，请先在设置中配置");

            try {
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                    body: JSON.stringify({ model, messages, stream: useStream })
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

                if (useStream) {
                    const reader = resp.body.getReader();
                    const decoder = new TextDecoder();
                    let reasoningBuffer = '';
                    let contentStarted = false;
                    let thinkTagSent = false;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const lines = decoder.decode(value, { stream: true }).split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                                try {
                                    const json = JSON.parse(line.slice(6));
                                    const delta = json.choices?.[0]?.delta;
                                    if (delta?.reasoning_content) {
                                        if (!thinkTagSent) {
                                            onChunk('<think>');
                                            thinkTagSent = true;
                                        }
                                        onChunk(delta.reasoning_content);
                                        reasoningBuffer += delta.reasoning_content;
                                    }
                                    if (delta?.content) {
                                        if (thinkTagSent && !contentStarted) {
                                            onChunk('</think>');
                                            contentStarted = true;
                                        }
                                        onChunk(delta.content);
                                    }
                                } catch(e){}
                            }
                        }
                    }
                    if (thinkTagSent && !contentStarted) {
                        onChunk('</think>');
                    }
                } else {
                    const data = await resp.json();
                    const message = data.choices?.[0]?.message;
                    let fullContent = '';
                    if (message?.reasoning_content) {
                        fullContent += `<think>${message.reasoning_content}</think>`;
                    }
                    if (message?.content) {
                        fullContent += message.content;
                    }

                    if (fullContent) onChunk(fullContent);
                }
                onDone();
            } catch (e) { onError(e.message); }
        }
    };

    class AppUI {
        constructor() {
            this.host = document.createElement('div');
            this.host.id = 'ld-summary-pro';
            document.body.appendChild(this.host);
            this.shadow = this.host.attachShadow({ mode: 'open' });

            this.isOpen = false;
            this.btnPos = GM_getValue('btnPos', { side: 'right', top: '66.67%' });
            this.side = this.btnPos.side;
            this.sidebarWidth = GM_getValue('sidebarWidth', 420);
            this.isDarkTheme = GM_getValue('isDarkTheme', false);
            this.chatHistory = [];
            this.postContent = '';
            this.lastSummary = '';
            this.isGenerating = false;
            this.currentTab = 'summary';
            this.userMessageCount = 0;
            this.userScrolledUp = false;
            this.isProgrammaticScroll = false;

            this.init();
        }

        init() {
            const style = document.createElement('style');
            style.textContent = STYLES;
            this.shadow.appendChild(style);
            this.render();
            this.restoreState();
            this.bindEvents();
            this.bindKeyboardShortcuts();
        }

        Q(s) { return this.shadow.querySelector(s); }

        render() {
            const arrowLeft = `<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
            const arrowRight = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>`;
            const sendIcon = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
            const arrowUpIcon = `<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`;
            const arrowDownIcon = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`;

            this.shadow.innerHTML += `
                <!-- 悬浮按钮 -->
                <div id="toggle-btn" title="拖动改变位置，点击展开/关闭 (Ctrl+Shift+S)">${arrowLeft}</div>

                <!-- 侧边栏 -->
                <div class="sidebar-panel" id="sidebar">
                    <div class="resize-handle" id="resizer"></div>

                    <!-- Toast 通知 - 在侧边栏内 -->
                    <div class="toast" id="toast"></div>

                    <!-- Header -->
                    <div class="header">
                        <div class="header-title">
                            <div class="header-title-icon">🧠</div>
                            智能总结
                        </div>
                        <div class="header-actions">
                            <button class="icon-btn" id="btn-focus" data-tooltip="聚焦模式">🎯</button>
                            <button class="icon-btn" id="btn-theme" data-tooltip="切换主题">🌙</button>
                            <button class="icon-btn" id="btn-close" data-tooltip="关闭">✕</button>
                        </div>
                    </div>

                    <!-- Tab 导航 -->
                    <div class="tab-bar">
                        <div class="tab-item active" data-tab="summary"><span>📝 总结</span></div>
                        <div class="tab-item" data-tab="chat"><span>💬 对话</span></div>
                        <div class="tab-item" data-tab="settings"><span>⚙️ 设置</span></div>
                    </div>

                    <!-- 内容区 -->
                    <div class="content-area">

                        <!-- 总结页面 -->
                        <div id="page-summary" class="view-page active">
                            <div class="form-group">
                                <div class="range-header">
                                    <label class="form-label" style="margin:0;">楼层范围</label>
                                    <div class="range-buttons">
                                        <button class="btn-xs" id="range-all">全部</button>
                                        <button class="btn-xs" id="range-recent">最近<span id="recent-count">50</span></button>
                                    </div>
                                </div>
                                <div class="range-inputs">
                                    <input type="number" id="inp-start" placeholder="起始楼层" min="1">
                                    <span class="range-separator">→</span>
                                    <input type="number" id="inp-end" placeholder="结束楼层" min="1">
                                </div>
                            </div>

                            <button class="btn" id="btn-summary">
                                <div class="spinner"></div>
                                <span class="btn-text">✨ 开始智能总结</span>
                            </button>

                            <div id="summary-result" class="result-box empty">
                                <div class="tip-text">
                                    <span class="tip-icon">🤖</span>
                                    点击「开始智能总结」后，<br>AI 将分析帖子内容并生成摘要<br><br>
                                    💡 总结完成后可切换到<strong>「对话」</strong>继续追问
                                </div>
                            </div>

                            <div class="shortcut-hint">
                                <span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">S</span> 快速打开
                            </div>
                        </div>

                        <!-- 对话页面 -->
                        <div id="page-chat" class="view-page">
                            <div class="chat-container">
                                <!-- 工具栏 -->
                                <div class="chat-toolbar">
                                    <div class="chat-toolbar-title">
                                        对话记录
                                        <span class="msg-count" id="msg-count">0</span>
                                    </div>
                                    <button class="btn-clear" id="btn-clear-chat" title="清空对话">
                                        🗑️ 清空
                                    </button>
                                </div>

                                <!-- 消息区域 -->
                                <div class="chat-messages-wrapper">
                                    <!-- 滚动到顶部按钮 -->
                                    <div class="scroll-buttons top-area">
                                        <button class="scroll-btn" id="btn-scroll-top" title="滚动到顶部">
                                            ${arrowUpIcon}
                                        </button>
                                    </div>

                                    <div class="chat-messages" id="chat-messages">
                                        <div id="chat-list" class="chat-list"></div>
                                        <div id="chat-empty" class="tip-text">
                                            <span class="tip-icon">💬</span>
                                            请先在<strong>「总结」</strong>页面生成内容摘要，<br>然后即可基于上下文进行对话
                                        </div>
                                    </div>

                                    <!-- 滚动到底部按钮 -->
                                    <div class="scroll-buttons bottom-area">
                                        <button class="scroll-btn" id="btn-scroll-bottom" title="滚动到底部">
                                            ${arrowDownIcon}
                                        </button>
                                    </div>
                                </div>

                                <!-- 输入区域 -->
                                <div class="chat-input-area">
                                    <div class="chat-input-row">
                                        <textarea id="chat-input" class="chat-input" placeholder="输入你的问题... (Enter 发送)" rows="1"></textarea>
                                        <button class="send-btn" id="btn-send" title="发送消息">${sendIcon}</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 设置页面 -->
                        <div id="page-settings" class="view-page settings-page">
                            <div class="settings-group">
                                <div class="settings-group-title">API 配置</div>
                                <div class="setting-item">
                                    <label class="setting-label">API 地址</label>
                                    <input type="text" id="cfg-url" placeholder="https://api.openai.com/v1/chat/completions">
                                </div>
                                <div class="setting-item">
                                    <label class="setting-label">API Key</label>
                                    <input type="password" id="cfg-key" placeholder="sk-...">
                                </div>
                                <div class="setting-item">
                                    <label class="setting-label">模型名称</label>
                                    <input type="text" id="cfg-model" placeholder="deepseek-chat">
                                </div>
                            </div>

                            <div class="settings-group">
                                <div class="settings-group-title">提示词配置</div>
                                <div class="setting-item">
                                    <label class="setting-label">总结提示词</label>
                                    <div class="setting-desc">用于生成帖子摘要时的系统指令</div>
                                    <textarea id="cfg-prompt-sum" rows="4"></textarea>
                                </div>
                                <div class="setting-item">
                                    <label class="setting-label">对话提示词</label>
                                    <div class="setting-desc">用于后续追问时的系统指令</div>
                                    <textarea id="cfg-prompt-chat" rows="4"></textarea>
                                </div>
                            </div>

                            <div class="settings-group">
                                <div class="settings-group-title">高级设置</div>
                                <div class="setting-item setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">快捷楼层数</label>
                                        <div class="setting-desc">"最近N楼"按钮的楼层数量</div>
                                    </div>
                                    <input type="number" id="cfg-recent-floors" min="10" max="500" style="width:80px; text-align:center; padding:8px 12px;">
                                </div>
                                <div class="setting-item setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">流式输出</label>
                                        <div class="setting-desc">开启后内容会逐字显示，关闭则等待完成后一次性显示</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="cfg-stream" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item setting-item-row">
                                    <div class="setting-info">
                                        <label class="setting-label">自动滚动</label>
                                        <div class="setting-desc">生成内容时自动滚动到最新位置（正文和思考内容）</div>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="cfg-autoscroll" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <button class="btn" id="btn-save">💾 保存设置</button>
                        </div>

                    </div>
                </div>
            `;
        }

        restoreState() {
            this.host.style.setProperty('--sidebar-width', `${this.sidebarWidth}px`);

            const btn = this.Q('#toggle-btn');
            btn.style.top = this.btnPos.top;
            this.applySideState();
            if (this.isDarkTheme) {
                this.host.classList.add('dark-theme');
                this.Q('#btn-theme').textContent = '☀️';
            }

            this.Q('#cfg-url').value = GM_getValue('apiUrl', 'https://api.deepseek.com/v1/chat/completions');
            this.Q('#cfg-key').value = GM_getValue('apiKey', '');
            this.Q('#cfg-model').value = GM_getValue('model', 'deepseek-chat');
            this.Q('#cfg-prompt-sum').value = GM_getValue('prompt_sum', '请总结以下论坛帖子内容。使用 Markdown 格式，条理清晰，重点突出主要观点、争议点和结论。适当使用标题、列表和引用来组织内容。');
            this.Q('#cfg-prompt-chat').value = GM_getValue('prompt_chat', '你是一个帖子阅读助手。基于上文中的帖子内容，回答用户的问题。回答要准确、简洁，必要时引用原文。');
            const recentFloors = GM_getValue('recentFloors', 50);
            this.Q('#cfg-recent-floors').value = recentFloors;
            this.Q('#recent-count').textContent = recentFloors;
            this.Q('#cfg-stream').checked = GM_getValue('useStream', true);
            this.Q('#cfg-autoscroll').checked = GM_getValue('autoScroll', true);
        }

        applySideState() {
            const btn = this.Q('#toggle-btn');
            const sidebar = this.Q('#sidebar');
            const resizer = this.Q('#resizer');
            const arrowLeft = `<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
            const arrowRight = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>`;

            btn.style.left = '';
            btn.style.right = '';

            if (this.side === 'left') {
                sidebar.className = 'sidebar-panel panel-left' + (this.isOpen ? ' open' : '');
                resizer.className = 'resize-handle handle-left';
                btn.className = 'btn-snap-left' + (this.isOpen ? ' arrow-flip' : '');
                btn.innerHTML = arrowRight;
            } else {
                sidebar.className = 'sidebar-panel panel-right' + (this.isOpen ? ' open' : '');
                resizer.className = 'resize-handle handle-right';
                btn.className = 'btn-snap-right' + (this.isOpen ? ' arrow-flip' : '');
                btn.innerHTML = arrowLeft;
            }

            this.updateButtonPosition();
        }

        updateButtonPosition(useTransition = true) {
            const btn = this.Q('#toggle-btn');

            if (!useTransition) {
                btn.style.transition = 'none';
            } else {
                btn.style.transition = '';
            }

            if (this.side === 'left') {
                btn.style.right = 'auto';
                btn.style.left = this.isOpen ? `${this.sidebarWidth}px` : '0';
            } else {
                btn.style.left = 'auto';
                btn.style.right = this.isOpen ? `${this.sidebarWidth}px` : '0';
            }

            if (!useTransition) {
                btn.offsetHeight;
                requestAnimationFrame(() => {
                    btn.style.transition = '';
                });
            }
        }

        bindEvents() {
            const btn = this.Q('#toggle-btn');

            this.shadow.addEventListener('click', (e) => {
                const toggle = e.target.closest('[data-thinking-toggle]');
                if (toggle) {
                    const block = toggle.closest('[data-thinking-block]');
                    if (block) {
                        block.classList.toggle('expanded');
                    }
                }
            });

            let isDrag = false, hasMoved = false, startX, startY, startRect;

            btn.addEventListener('mousedown', (e) => {
                isDrag = true;
                hasMoved = false;
                startX = e.clientX;
                startY = e.clientY;
                startRect = btn.getBoundingClientRect();

                if (!this.isOpen) {
                    btn.style.transition = 'none';
                }
                btn.style.cursor = 'grabbing';
                e.preventDefault();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDrag) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved = true;

                if (!this.isOpen && hasMoved) {
                    btn.style.left = `${startRect.left + dx}px`;
                    btn.style.top = `${startRect.top + dy}px`;
                    btn.style.right = 'auto';
                    btn.className = 'btn-floating';
                }
            });

            window.addEventListener('mouseup', (e) => {
                if (!isDrag) return;
                isDrag = false;
                btn.style.cursor = 'grab';
                btn.style.transition = '';

                if (hasMoved && !this.isOpen) {
                    const winW = window.innerWidth;
                    const btnRect = btn.getBoundingClientRect();
                    const centerX = btnRect.left + btnRect.width / 2;

                    this.side = centerX < winW / 2 ? 'left' : 'right';

                    let newTop = btnRect.top;
                    if (newTop < 10) newTop = 10;
                    if (newTop > window.innerHeight - 60) newTop = window.innerHeight - 60;

                    this.btnPos = { side: this.side, top: `${newTop}px` };
                    GM_setValue('btnPos', this.btnPos);

                    btn.style.top = `${newTop}px`;
                    this.applySideState();
                } else if (!hasMoved) {
                    this.toggleSidebar();
                }
            });

            this.Q('#btn-close').onclick = () => this.toggleSidebar();
            this.Q('#btn-focus').onclick = () => this.toggleFocusMode();
            this.Q('#btn-theme').onclick = () => this.toggleTheme();

            this.shadow.querySelectorAll('.tab-item').forEach(tab => {
                tab.onclick = () => {
                    const tabName = tab.dataset.tab;
                    this.switchTab(tabName);
                };
            });

            let isResizing = false;
            this.Q('#resizer').addEventListener('mousedown', (e) => {
                isResizing = true;
                document.body.style.cursor = 'col-resize';
                this.Q('#sidebar').style.transition = 'none';
                document.body.style.transition = 'none';
                e.preventDefault();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                let newW = this.side === 'right' ? (window.innerWidth - e.clientX) : e.clientX;
                if (newW > 320 && newW < 700) {
                    this.sidebarWidth = newW;
                    this.host.style.setProperty('--sidebar-width', `${newW}px`);
                    if (this.isOpen) {
                        this.squeezeBody(true);
                        this.updateButtonPosition(false);
                    }
                }
            });

            window.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = '';
                    this.Q('#sidebar').style.transition = '';
                    document.body.style.transition = 'margin 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
                    GM_setValue('sidebarWidth', this.sidebarWidth);
                }
            });

            this.Q('#range-all').onclick = () => this.setRange('all');
            this.Q('#range-recent').onclick = () => this.setRange('recent');
            this.Q('#btn-summary').onclick = () => this.doSummary();
            this.Q('#btn-send').onclick = () => this.doChat();

            this.Q('#chat-input').onkeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.doChat();
                }
            };

            this.Q('#chat-input').addEventListener('input', (e) => {
                const el = e.target;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 140) + 'px';
            });

            this.Q('#btn-clear-chat').onclick = () => this.clearChat();

            this.Q('#btn-scroll-top').onclick = () => this.scrollToTop();
            this.Q('#btn-scroll-bottom').onclick = () => this.forceScrollToBottom();

            const chatMessages = this.Q('#chat-messages');
            let lastScrollTop = 0;
            chatMessages.addEventListener('scroll', () => {
                const currentScrollTop = chatMessages.scrollTop;
                const scrollHeight = chatMessages.scrollHeight;
                const clientHeight = chatMessages.clientHeight;
                const isNearBottom = scrollHeight - currentScrollTop - clientHeight < 80;
                if (this.isGenerating && !this.isProgrammaticScroll) {
                    if (currentScrollTop < lastScrollTop - 10) {
                        this.userScrolledUp = true;
                    } else if (isNearBottom) {
                        this.userScrolledUp = false;
                    }
                }
                lastScrollTop = currentScrollTop;
                this.updateScrollButtons();
            });

            this.Q('#btn-save').onclick = () => {
                GM_setValue('apiUrl', this.Q('#cfg-url').value.trim());
                GM_setValue('apiKey', this.Q('#cfg-key').value.trim());
                GM_setValue('model', this.Q('#cfg-model').value.trim());
                GM_setValue('prompt_sum', this.Q('#cfg-prompt-sum').value);
                GM_setValue('prompt_chat', this.Q('#cfg-prompt-chat').value);
                const recentFloors = parseInt(this.Q('#cfg-recent-floors').value) || 50;
                GM_setValue('recentFloors', Math.max(10, Math.min(500, recentFloors)));
                this.Q('#recent-count').textContent = GM_getValue('recentFloors', 50);
                GM_setValue('useStream', this.Q('#cfg-stream').checked);
                GM_setValue('autoScroll', this.Q('#cfg-autoscroll').checked);
                this.showToast('设置已保存', 'success');
                this.switchTab('summary');
            };
        }

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    this.toggleSidebar();
                }
                if (e.key === 'Escape' && this.isOpen) {
                    this.toggleSidebar();
                }
            });

            // 聚焦模式鼠标位置监听
            const sidebar = this.Q('#sidebar');
            sidebar.addEventListener('mousemove', (e) => {
                if (!this.host.classList.contains('summary-focus-mode')) return;
                
                // 获取鼠标相对于侧边栏的Y坐标
                const rect = sidebar.getBoundingClientRect();
                const mouseY = e.clientY - rect.top;
                
                // 不同的显示和隐藏阈值，避免频繁闪烁
                const SHOW_THRESHOLD = 30;  // 顶部30px触发显示
                const HIDE_THRESHOLD = 400;  // 超过400px才隐藏（按钮位置）
                
                const isShowing = this.host.classList.contains('show-top-ui');
                
                if (!isShowing && mouseY < SHOW_THRESHOLD) {
                    // 鼠标移到顶部时显示
                    this.host.classList.add('show-top-ui');
                } else if (isShowing && mouseY >= HIDE_THRESHOLD) {
                    // 鼠标移出到按钮位置才隐藏
                    this.host.classList.remove('show-top-ui');
                }
            });

            // 鼠标离开侧边栏时隐藏UI
            sidebar.addEventListener('mouseleave', () => {
                if (this.host.classList.contains('summary-focus-mode')) {
                    this.host.classList.remove('show-top-ui');
                }
            });
        }

        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            GM_setValue('isDarkTheme', this.isDarkTheme);

            if (this.isDarkTheme) {
                this.host.classList.add('dark-theme');
                this.Q('#btn-theme').textContent = '☀️';
            } else {
                this.host.classList.remove('dark-theme');
                this.Q('#btn-theme').textContent = '🌙';
            }
        }

        toggleFocusMode() {
            const isFocusMode = this.host.classList.contains('summary-focus-mode');
            
            if (isFocusMode) {
                // 退出聚焦模式
                this.host.classList.remove('summary-focus-mode');
                this.host.classList.remove('show-top-ui');
                this.Q('#btn-focus').textContent = '🎯';
                this.Q('#btn-focus').setAttribute('data-tooltip', '聚焦模式');
                this.showToast('已退出聚焦模式');
            } else {
                // 进入聚焦模式
                if (this.currentTab === 'summary' && this.lastSummary) {
                    this.host.classList.add('summary-focus-mode');
                    this.Q('#btn-focus').textContent = '🔙';
                    this.Q('#btn-focus').setAttribute('data-tooltip', '退出聚焦');
                    this.showToast('已进入聚焦模式');
                } else if (this.currentTab !== 'summary') {
                    this.showToast('请先切换到"总结"标签', 'error');
                } else {
                    this.showToast('请先生成总结内容', 'error');
                }
            }
        }

        showToast(message, type = '') {
            const toast = this.Q('#toast');
            toast.textContent = message;
            toast.className = 'toast' + (type ? ` ${type}` : '');

            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }

        copyToClipboard(text) {
            try {
                GM_setClipboard(text, 'text');
                return true;
            } catch (e) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            }
        }

        updateScrollButtons() {
            const chatMessages = this.Q('#chat-messages');
            const scrollTop = chatMessages.scrollTop;
            const scrollHeight = chatMessages.scrollHeight;
            const clientHeight = chatMessages.clientHeight;
            const distanceToBottom = scrollHeight - scrollTop - clientHeight;

            const btnTop = this.Q('#btn-scroll-top');
            const btnBottom = this.Q('#btn-scroll-bottom');

            if (scrollTop > 50) {
                btnTop.classList.add('visible');
            } else {
                btnTop.classList.remove('visible');
            }

            if (this.isGenerating && this.userScrolledUp) {
                btnBottom.classList.add('visible', 'generating');
            } else if (distanceToBottom > 50) {
                btnBottom.classList.add('visible');
                btnBottom.classList.remove('generating');
            } else {
                btnBottom.classList.remove('visible', 'generating');
            }
        }

        scrollToTop() {
            const chatMessages = this.Q('#chat-messages');
            chatMessages.scrollTo({ top: 0, behavior: 'smooth' });
        }

        scrollToBottom(force = false) {
            if (!force && !GM_getValue('autoScroll', true)) {
                this.updateScrollButtons();
                return;
            }
            if (!force && this.userScrolledUp) {
                this.updateScrollButtons();
                return;
            }
            const chatMessages = this.Q('#chat-messages');
            this.isProgrammaticScroll = true;
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(() => {
                    this.isProgrammaticScroll = false;
                    this.updateScrollButtons();
                }, 50);
            }, 0);
        }

        forceScrollToBottom() {
            this.userScrolledUp = false;
            const chatMessages = this.Q('#chat-messages');
            this.isProgrammaticScroll = true;
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(() => {
                    this.isProgrammaticScroll = false;
                    this.updateScrollButtons();
                }, 50);
            }, 0);
        }

        clearChat() {
            if (this.chatHistory.length === 0) return;

            if (confirm('确定要清空所有对话记录吗？\n（总结上下文将保留，可以继续提问）')) {
                if (this.chatHistory.length > 3) {
                    this.chatHistory = this.chatHistory.slice(0, 3);
                }
                this.Q('#chat-list').innerHTML = '';
                this.userMessageCount = 0;
                this.updateMessageCount();
                if (this.chatHistory.length <= 3) {
                    const emptyDiv = this.Q('#chat-empty');
                    emptyDiv.classList.remove('hidden');
                    emptyDiv.innerHTML = '<span class="tip-icon">💬</span>对话已清空<br>可以继续基于帖子内容提问';
                }

                this.showToast('对话已清空');
            }
        }

        updateMessageCount() {
            this.Q('#msg-count').textContent = this.userMessageCount;
        }

        toggleSidebar() {
            this.isOpen = !this.isOpen;
            const sidebar = this.Q('#sidebar');
            const btn = this.Q('#toggle-btn');

            if (this.isOpen) {
                sidebar.classList.add('open');
                btn.classList.add('arrow-flip');
                this.squeezeBody(true);
                this.initRangeInputs();
            } else {
                sidebar.classList.remove('open');
                btn.classList.remove('arrow-flip');
                this.squeezeBody(false);
                // 关闭侧边栏时退出聚焦模式
                this.host.classList.remove('summary-focus-mode');
                this.host.classList.remove('show-top-ui');
                // 同步更新按钮状态
                const focusBtn = this.Q('#btn-focus');
                if (focusBtn) {
                    focusBtn.textContent = '🎯';
                    focusBtn.setAttribute('data-tooltip', '聚焦模式');
                }
            }

            this.updateButtonPosition();
        }

        squeezeBody(active) {
            const body = document.body;
            body.style.transition = 'margin 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            if (!active) {
                body.style.marginLeft = '';
                body.style.marginRight = '';
            } else {
                if (this.side === 'left') {
                    body.style.marginLeft = `${this.sidebarWidth}px`;
                    body.style.marginRight = '';
                } else {
                    body.style.marginRight = `${this.sidebarWidth}px`;
                    body.style.marginLeft = '';
                }
            }
        }

        switchTab(tabName) {
            this.shadow.querySelectorAll('.tab-item').forEach(t => {
                t.classList.toggle('active', t.dataset.tab === tabName);
            });
            this.shadow.querySelectorAll('.view-page').forEach(p => {
                p.classList.toggle('active', p.id === `page-${tabName}`);
            });
            this.currentTab = tabName;
            // 切换到其他标签时退出聚焦模式
            if (tabName !== 'summary') {
                this.host.classList.remove('summary-focus-mode');
                this.host.classList.remove('show-top-ui');
                // 同步更新按钮状态
                const focusBtn = this.Q('#btn-focus');
                if (focusBtn) {
                    focusBtn.textContent = '🎯';
                    focusBtn.setAttribute('data-tooltip', '聚焦模式');
                }
            }
            if (tabName === 'chat') {
                setTimeout(() => this.updateScrollButtons(), 100);
            }
        }

        initRangeInputs() {
            const max = Core.getReplyCount();
            const start = this.Q('#inp-start');
            const end = this.Q('#inp-end');
            if (!start.value) start.value = 1;
            if (max && !end.value) end.value = max;
        }

        setRange(type) {
            const max = Core.getReplyCount();
            if (!max) return;
            this.Q('#inp-end').value = max;
            const recentFloors = GM_getValue('recentFloors', 50);
            this.Q('#inp-start').value = type === 'all' ? 1 : Math.max(1, max - recentFloors + 1);
        }

        setLoading(btnId, isLoading) {
            const btn = this.Q(btnId);
            this.isGenerating = isLoading;
            btn.disabled = isLoading;
            btn.classList.toggle('loading', isLoading);
            if (btnId === '#btn-send') {
                const input = this.Q('#chat-input');
                if (input) {
                    input.disabled = isLoading;
                    input.placeholder = isLoading ? '正在生成回复...' : '输入你的问题... (Enter 发送)';
                }
            }
        }

        async doSummary() {
            const tid = Core.getTopicId();
            const start = this.Q('#inp-start').value;
            const end = this.Q('#inp-end').value;

            if (!tid) return alert('未检测到帖子ID，请确保在帖子详情页');
            if (!start || !end || parseInt(start) > parseInt(end)) return alert('楼层范围无效');

            this.setLoading('#btn-summary', true);
            // 启用聚焦模式
            this.host.classList.add('summary-focus-mode');
            // 更新聚焦按钮状态
            const focusBtn = this.Q('#btn-focus');
            if (focusBtn) {
                focusBtn.textContent = '🔙';
                focusBtn.setAttribute('data-tooltip', '退出聚焦');
            }
            const resultBox = this.Q('#summary-result');
            resultBox.classList.remove('empty');
            resultBox.innerHTML = `
                <div style="color:var(--text-sec); display:flex; align-items:center; gap:10px;">
                    <div class="thinking">
                        <div class="thinking-dot"></div>
                        <div class="thinking-dot"></div>
                        <div class="thinking-dot"></div>
                    </div>
                    正在获取帖子内容...
                </div>
            `;

            try {
                const text = await Core.fetchDialogues(tid, parseInt(start), parseInt(end));
                if (!text) throw new Error('未获取到内容');

                this.postContent = text;

                resultBox.innerHTML = `
                    <div style="color:var(--text-sec); display:flex; align-items:center; gap:10px;">
                        <div class="thinking">
                            <div class="thinking-dot"></div>
                            <div class="thinking-dot"></div>
                            <div class="thinking-dot"></div>
                        </div>
                        AI 正在分析中...
                    </div>
                `;

                const sysPrompt = GM_getValue('prompt_sum', '');
                const messages = [
                    { role: 'system', content: sysPrompt },
                    { role: 'user', content: `帖子内容:\n${text}` }
                ];

                let aiText = '';
                await Core.streamChat(messages,
                    (chunk) => {
                        aiText += chunk;
                        const currentBlock = resultBox.querySelector('[data-thinking-block]');
                        const isExpanded = currentBlock?.classList.contains('expanded') || false;

                        resultBox.innerHTML = `
                            <div class="result-actions">
                                <button class="result-action-btn" id="btn-copy-summary">📋 复制</button>
                            </div>
                        ` + Core.renderWithThinking(aiText, true, isExpanded);
                        if (GM_getValue('autoScroll', true)) {
                            setTimeout(() => {
                                resultBox.scrollTop = resultBox.scrollHeight;
                                const thinkingInner = resultBox.querySelector('.thinking-content-inner');
                                if (thinkingInner && isExpanded) {
                                    thinkingInner.scrollTop = thinkingInner.scrollHeight;
                                }
                            }, 0);
                        }
                        const copyBtn = this.Q('#btn-copy-summary');
                        if (copyBtn) {
                            copyBtn.onclick = () => {
                                this.copyToClipboard(aiText);
                                copyBtn.classList.add('copied');
                                copyBtn.textContent = '✓ 已复制';
                                setTimeout(() => {
                                    copyBtn.classList.remove('copied');
                                    copyBtn.textContent = '📋 复制';
                                }, 2000);
                            };
                        }
                    },
                    () => {
                        this.setLoading('#btn-summary', false);
                        resultBox.innerHTML = `
                            <div class="result-actions">
                                <button class="result-action-btn" id="btn-copy-summary">📋 复制</button>
                            </div>
                        ` + Core.renderWithThinking(aiText, false);
                        const copyBtn = this.Q('#btn-copy-summary');
                        if (copyBtn) {
                            copyBtn.onclick = () => {
                                this.copyToClipboard(aiText);
                                copyBtn.classList.add('copied');
                                copyBtn.textContent = '✓ 已复制';
                                setTimeout(() => {
                                    copyBtn.classList.remove('copied');
                                    copyBtn.textContent = '📋 复制';
                                }, 2000);
                            };
                        }

                        this.lastSummary = aiText;
                        const chatPrompt = GM_getValue('prompt_chat', '');
                        this.chatHistory = [
                            { role: 'system', content: chatPrompt },
                            { role: 'user', content: `以下是帖子内容供你参考:\n${text}` },
                            { role: 'assistant', content: aiText }
                        ];
                        this.Q('#chat-list').innerHTML = '';
                        this.userMessageCount = 0;
                        this.updateMessageCount();
                        this.Q('#chat-empty').classList.remove('hidden');
                        this.Q('#chat-empty').innerHTML = '<span class="tip-icon">✅</span>总结已完成！<br>现在可以基于帖子内容进行对话';
                    },
                    (err) => {
                        resultBox.innerHTML = `<div style="color:var(--danger)">❌ 错误: ${err}</div>`;
                        this.setLoading('#btn-summary', false);
                        this.showToast('总结失败: ' + err, 'error');
                    }
                );

            } catch(e) {
                resultBox.innerHTML = `<div style="color:var(--danger)">❌ 错误: ${e.message}</div>`;
                this.setLoading('#btn-summary', false);
            }
        }

        async doChat() {
            if (this.isGenerating) return;
            if (this.chatHistory.length === 0) {
                return alert('请先在「总结」页面生成内容摘要');
            }

            const input = this.Q('#chat-input');
            const txt = input.value.trim();
            if (!txt) return;

            input.value = '';
            input.style.height = 'auto';
            this.Q('#chat-empty').classList.add('hidden');
            this.userScrolledUp = false;

            this.addBubble('user', txt);
            this.chatHistory.push({ role: 'user', content: txt });
            this.userMessageCount++;
            this.updateMessageCount();

            const msgDiv = this.addBubble('ai', '');
            msgDiv.innerHTML = `
                <div class="thinking">
                    <div class="thinking-dot"></div>
                    <div class="thinking-dot"></div>
                    <div class="thinking-dot"></div>
                </div>
            `;
            let aiText = '';

            this.setLoading('#btn-send', true);

            await Core.streamChat(this.chatHistory,
                (chunk) => {
                    aiText += chunk;
                    const currentBlock = msgDiv.querySelector('[data-thinking-block]');
                    const isExpanded = currentBlock?.classList.contains('expanded') || false;

                    msgDiv.innerHTML = Core.renderWithThinking(aiText, true, isExpanded);
                    if (GM_getValue('autoScroll', true) && isExpanded) {
                        setTimeout(() => {
                            const thinkingInner = msgDiv.querySelector('.thinking-content-inner');
                            if (thinkingInner) {
                                thinkingInner.scrollTop = thinkingInner.scrollHeight;
                            }
                        }, 0);
                    }
                    this.scrollToBottom();
                },
                () => {
                    msgDiv.innerHTML = Core.renderWithThinking(aiText, false);
                    this.chatHistory.push({ role: 'assistant', content: aiText });
                    this.setLoading('#btn-send', false);
                    this.userScrolledUp = false;
                    this.updateScrollButtons();
                },
                (err) => {
                    msgDiv.innerHTML += `<br><span style="color:var(--danger)">❌ ${err}</span>`;
                    this.setLoading('#btn-send', false);
                }
            );
        }

        addBubble(role, text) {
            const div = document.createElement('div');
            div.className = `bubble bubble-${role}`;
            div.innerHTML = role === 'user' ? text : Core.renderWithThinking(text);
            this.Q('#chat-list').appendChild(div);
            this.scrollToBottom();
            return div;
        }
    }

    window.addEventListener('load', () => new AppUI());

})();
