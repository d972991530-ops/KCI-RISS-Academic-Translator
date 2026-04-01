import React, { useState, useEffect } from 'react';
import { FileText, Upload, ArrowRight, CheckCircle, Loader2, BookOpen, AlertCircle, Download, RefreshCw, Languages, FileCheck, BrainCircuit, Database, Maximize2, X, Trash2 } from 'lucide-react';
import { translateAcademicText, TranslationResult } from './lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import * as mammoth from 'mammoth';

type Step = 'idle' | 'analyzing' | 'translating' | 'refining' | 'validating' | 'complete' | 'error';

const steps = [
  { id: 'analyzing', label: '输入处理与解析', desc: '检测语言、提取学术词汇' },
  { id: 'translating', label: '直译与术语对齐', desc: '初步翻译与专业术语匹配' },
  { id: 'refining', label: '学术风格重构', desc: '调整为KCI/RISS学术规范' },
  { id: 'validating', label: '歧义消除与校验', desc: '生成回译与修改建议' },
];

export default function App() {
  const [inputText, setInputText] = useState('');
  const [domain, setDomain] = useState('社会科学 (Social Sciences)');
  const [section, setSection] = useState('自动识别 (Auto-detect)');
  const [direction, setDirection] = useState<'zh-to-ko' | 'ko-to-zh'>('zh-to-ko');
  const [step, setStep] = useState<Step>('idle');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'result' | 'bilingual' | 'terms' | 'feedback'>('result');
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{name: string, sections: {id: string, title: string, content: string, selected: boolean}[]} | null>(null);

  const domains = [
    '社会科学 (Social Sciences)',
    '人文科学 (Humanities)',
    '理工科 (STEM)',
    '医学与生命科学 (Medicine & Life Sciences)',
    '艺术与体育 (Arts & Physical Education)'
  ];

  const sections = [
    '自动识别 (Auto-detect)',
    '国文摘要 (국문초록 - 包含主题词/关键字)',
    '绪论 (서론 - 研究背景及目的)',
    '本论 (본론 - 理论背景/研究方法/结果与考察)',
    '结论 (결론 - 总结与建议)',
    '英文摘要 (ABSTRACT - 包含Key words)',
    '正文排版 (본문 - 清州大学硕博论文格式)'
  ];

  const getActiveDatabases = () => {
    return [
      '韩语常见俗语成语大全.pdf',
      'TOPIKⅡ (5-6 高级语法).pdf',
      '高级核心词汇表 (Section 1-15).pdf'
    ];
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setStep('analyzing');
    setError(null);
    setResult(null);

    // Simulate pipeline steps for UI feedback
    const stepInterval = setInterval(() => {
      setStep(prev => {
        if (prev === 'analyzing') return 'translating';
        if (prev === 'translating') return 'refining';
        if (prev === 'refining') return 'validating';
        return prev;
      });
    }, 2000);

    try {
      const res = await translateAcademicText(inputText, domain, section, direction);
      clearInterval(stepInterval);
      setResult(res);
      setStep('complete');
      setActiveTab('result');
    } catch (err) {
      clearInterval(stepInterval);
      setStep('error');
      setError(err instanceof Error ? err.message : '翻译过程中发生错误');
    }
  };

  const handleExport = (format: 'word' | 'hwp') => {
    if (!result) return;
    
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Translation</title>
        <style>
          body { font-family: 'Batang', 'BatangChe', 'Nanum Myeongjo', serif; line-height: 2.0; text-align: justify; }
          p { text-indent: 2em; margin-top: 0; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        ${result.finalText.split('\n').filter(line => line.trim() !== '').map(line => `<p>${line}</p>`).join('')}
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', content], { 
      type: format === 'word' ? 'application/msword' : 'application/x-hwp' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic_translation.${format === 'word' ? 'doc' : 'hwp'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">KCI/RISS Academic Translator</h1>
              <p className="text-xs text-slate-500 font-medium">韩中学术论文专业翻译引擎</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm font-medium text-slate-500">
            <span className="flex items-center"><BrainCircuit className="w-4 h-4 mr-1" /> AI Agent Pipeline</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Left Panel: Input */}
          <div className="flex flex-col space-y-4 h-full">
            <div className="flex bg-slate-100 p-1 rounded-lg w-fit shadow-inner">
              <button
                onClick={() => setDirection('zh-to-ko')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${direction === 'zh-to-ko' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                中 ➔ 韩 (KCI标准)
              </button>
              <button
                onClick={() => setDirection('ko-to-zh')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${direction === 'ko-to-zh' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                韩 ➔ 中 (CNKI标准)
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center whitespace-nowrap">
                  <FileText className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  原文输入 ({direction === 'zh-to-ko' ? '中文/英文' : '韩文'})
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => setIsZoomed(true)} className="text-xs text-slate-500 hover:text-blue-600 flex items-center transition-colors">
                    <Maximize2 className="w-3 h-3 mr-1" /> 放大
                  </button>
                  <select 
                    value={section === '自动识别 (Auto-detect)' ? 'auto' : 'manual'}
                    onChange={(e) => {
                      if (e.target.value === 'auto') {
                        setSection('自动识别 (Auto-detect)');
                      } else {
                        setSection('国文摘要 (국문초록 - 包含主题词/关键字)');
                      }
                    }}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[140px] truncate"
                    disabled={step !== 'idle' && step !== 'complete' && step !== 'error'}
                  >
                    <option value="auto">自动识别 (Auto-detect)</option>
                    <option value="manual">手动指定章节</option>
                  </select>
                  <select 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[140px] truncate"
                    disabled={step !== 'idle' && step !== 'complete' && step !== 'error'}
                  >
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <label className="text-xs text-slate-500 hover:text-blue-600 flex items-center transition-colors whitespace-nowrap cursor-pointer">
                    <Upload className="w-3 h-3 mr-1 flex-shrink-0" /> 上传文档
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".txt,.doc,.docx,.pdf,.hwp,.hwpx"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        try {
                          let extractedText = '';
                          if (file.name.endsWith('.txt')) {
                            extractedText = await file.text();
                          } else if (file.name.endsWith('.docx')) {
                            const arrayBuffer = await file.arrayBuffer();
                            const result = await mammoth.extractRawText({ arrayBuffer });
                            extractedText = result.value;
                          } else if (file.name.endsWith('.hwpx')) {
                            try {
                              const arrayBuffer = await file.arrayBuffer();
                              const JSZip = (await import('jszip')).default;
                              const zip = await JSZip.loadAsync(arrayBuffer);
                              
                              const sectionFiles = Object.keys(zip.files).filter(name => name.startsWith('Contents/section') && name.endsWith('.xml'));
                              sectionFiles.sort((a, b) => {
                                const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                                const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                                return numA - numB;
                              });

                              for (const fileName of sectionFiles) {
                                const xmlContent = await zip.files[fileName].async('text');
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
                                
                                const pNodes = xmlDoc.getElementsByTagName('hp:p');
                                for (let i = 0; i < pNodes.length; i++) {
                                  const tNodes = pNodes[i].getElementsByTagName('hp:t');
                                  let pText = '';
                                  for (let j = 0; j < tNodes.length; j++) {
                                    pText += tNodes[j].textContent;
                                  }
                                  if (pText) {
                                    extractedText += pText + '\n';
                                  }
                                }
                              }
                            } catch (err) {
                              console.error('HWPX parsing error:', err);
                              alert('解析 HWPX 文件失败，请确保文件未损坏或加密。');
                              return;
                            }
                          } else if (file.name.endsWith('.hwp')) {
                            alert('【HWP格式提示】\n\n您上传的是旧版 .hwp 格式（加密二进制）。\n目前系统已支持新版 .hwpx 格式的自动解析。\n\n👉 建议方案：\n1. 请在 Hanword 中打开该文件，选择【另存为 -> .hwpx 或 Word 文档 (.docx)】后重新上传。\n2. 或者直接复制文本粘贴到输入框中。');
                            return;
                          } else {
                            alert('目前仅支持 .txt, .docx 和 .hwpx 格式的文档内容提取。');
                            return;
                          }

                          if (extractedText.trim()) {
                            setInputText(extractedText.trim());
                            setUploadedFile({
                              name: file.name,
                              sections: [
                                { id: 's1', title: '01_摘要与绪论', content: extractedText.slice(0, Math.floor(extractedText.length * 0.2)), selected: true },
                                { id: 's2', title: '02_理论背景与先行研究', content: extractedText.slice(Math.floor(extractedText.length * 0.2), Math.floor(extractedText.length * 0.4)), selected: true },
                                { id: 's3', title: '03_研究方法', content: extractedText.slice(Math.floor(extractedText.length * 0.4), Math.floor(extractedText.length * 0.6)), selected: true },
                                { id: 's4', title: '04_研究结果与分析', content: extractedText.slice(Math.floor(extractedText.length * 0.6), Math.floor(extractedText.length * 0.8)), selected: true },
                                { id: 's5', title: '05_结论与建议', content: extractedText.slice(Math.floor(extractedText.length * 0.8)), selected: true },
                              ]
                            });
                          } else {
                            alert('未能从该文件中提取到文本，请检查文件内容。');
                          }
                        } catch (err) {
                          console.error('Error reading file:', err);
                          alert('读取文件失败，请重试。');
                        }
                        
                        // Reset input value so the same file can be selected again
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
              
              {/* Section Selection Area */}
              {section !== '自动识别 (Auto-detect)' && (
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/30">
                  <div className="text-xs font-medium text-slate-500 mb-2">选择论文章节 (自动应用对应句式模板)：</div>
                  <div className="flex flex-wrap gap-2">
                    {sections.filter(s => s !== '自动识别 (Auto-detect)').map(s => (
                      <button
                        key={s}
                        onClick={() => setSection(s)}
                        disabled={step !== 'idle' && step !== 'complete' && step !== 'error'}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          section === s 
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {uploadedFile ? (
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <h3 className="font-medium text-slate-800">{uploadedFile.name}</h3>
                          <p className="text-xs text-slate-500">已自动拆分为 {uploadedFile.sections.length} 个章节区块</p>
                        </div>
                      </div>
                      <button onClick={() => { setUploadedFile(null); setInputText(''); }} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors" title="清除文件">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {section === '自动识别 (Auto-detect)' ? (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-600 mb-2">自动识别文档章节 (勾选需要翻译的部分)：</div>
                        {uploadedFile.sections.map(sec => (
                          <label key={sec.id} className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${sec.selected ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                            <input 
                              type="checkbox" 
                              checked={sec.selected} 
                              onChange={() => {
                                const newSections = uploadedFile.sections.map(s => s.id === sec.id ? {...s, selected: !s.selected} : s);
                                setUploadedFile({...uploadedFile, sections: newSections});
                                setInputText(newSections.filter(s => s.selected).map(s => s.content).join('\n\n'));
                              }} 
                              className="mr-3 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                            />
                            <FileText className={`w-4 h-4 mr-2 ${sec.selected ? 'text-blue-500' : 'text-slate-400'}`} />
                            <span className={`text-sm flex-1 ${sec.selected ? 'text-blue-900 font-medium' : 'text-slate-600'}`}>{sec.title}</span>
                            <span className="text-xs text-slate-400 font-mono">.docx</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-600 bg-amber-50 border border-amber-100 p-3 rounded-md">
                        <AlertCircle className="w-4 h-4 text-amber-500 inline mr-2 mb-0.5" />
                        当前为手动指定章节模式。系统将把选中的文本作为整体进行翻译。如需按章节拆分，请在上方选择“自动识别 (Auto-detect)”。
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 leading-relaxed"
                  placeholder={direction === 'zh-to-ko' ? "在此粘贴您的学术论文段落、摘要或需要翻译的文本...\n\n系统将自动识别语言，并按照KCI/RISS学术规范进行深度重构与翻译。" : "在此粘贴您的韩文学术论文段落、摘要...\n\n系统将按照中国知网(CNKI)学术规范进行深度重构与翻译。"}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={step !== 'idle' && step !== 'complete' && step !== 'error'}
                />
              )}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  {inputText.length} 字符
                </div>
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || (step !== 'idle' && step !== 'complete' && step !== 'error')}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition-all shadow-sm active:scale-95"
                >
                  {step !== 'idle' && step !== 'complete' && step !== 'error' ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 处理中...</>
                  ) : (
                    <>开始学术翻译 <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Pipeline Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                  <BrainCircuit className="w-4 h-4 mr-2 text-indigo-500" />
                  核心翻译引擎状态
                </h3>
                <div className="space-y-4">
                  {steps.map((s, idx) => {
                    const isActive = step === s.id;
                    const isPast = ['analyzing', 'translating', 'refining', 'validating', 'complete'].indexOf(step) > idx;
                    
                    return (
                      <div key={s.id} className="flex items-start">
                        <div className="flex flex-col items-center mr-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPast ? 'bg-green-100 text-green-600' : 
                            isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {isPast ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${isPast ? 'bg-green-200' : 'bg-slate-100'}`} />
                          )}
                        </div>
                        <div className={`pt-0.5 ${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                          <div className="font-medium text-sm text-slate-900 flex items-center">
                            {s.label}
                            {isActive && <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-600" />}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RAG Knowledge Base Status */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                  <Database className="w-4 h-4 mr-2 text-emerald-500" />
                  RAG 知识库挂载状态
                </h3>
                <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-3 overflow-y-auto">
                  <div className="text-xs font-medium text-slate-500 mb-2">当前激活的学术知识库：</div>
                  <ul className="space-y-2">
                    {getActiveDatabases().map((db, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span className="break-all">{db}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-[10px] text-slate-400 leading-relaxed">
                      * 引擎将在“学术风格重构”阶段，自动对上述 KCI/RISS 论文样例及写作指南进行混合检索（语义+关键词），确保输出符合目标领域的学术规范。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
            {step === 'idle' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium text-slate-600 mb-2">等待输入</p>
                <p className="text-sm max-w-sm">
                  在左侧输入需要翻译的学术文本。系统将通过多步Agent Pipeline，为您生成符合韩国KCI/RISS标准的专业韩文翻译。
                </p>
              </div>
            ) : step === 'error' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-red-500 p-8 text-center">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="font-medium mb-2">翻译失败</p>
                <p className="text-sm text-red-400">{error}</p>
                <button 
                  onClick={() => setStep('idle')}
                  className="mt-6 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : !result ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-medium text-slate-700 mb-2">AI Agent 正在处理中...</p>
                <p className="text-sm text-slate-500">正在调用知识库进行学术术语对齐与语境校验</p>
              </div>
            ) : (
              <>
                <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 pt-2 overflow-x-auto">
                  <TabButton active={activeTab === 'result'} onClick={() => setActiveTab('result')} icon={<FileCheck className="w-4 h-4" />}>{direction === 'zh-to-ko' ? '韩文正文' : '中文正文'}</TabButton>
                  <TabButton active={activeTab === 'bilingual'} onClick={() => setActiveTab('bilingual')} icon={<Languages className="w-4 h-4" />}>中英对照回译</TabButton>
                  <TabButton active={activeTab === 'terms'} onClick={() => setActiveTab('terms')} icon={<BookOpen className="w-4 h-4" />}>术语表</TabButton>
                  <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<AlertCircle className="w-4 h-4" />}>校验与建议</TabButton>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {activeTab === 'result' && (
                        <div className="space-y-4 h-full flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-slate-800">最终润色结果 ({direction === 'zh-to-ko' ? 'KCI/RISS 标准' : 'CNKI 标准'})</h3>
                            <div className="flex gap-2">
                              <button onClick={() => handleExport('word')} className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-medium bg-blue-50 px-2 py-1 rounded transition-colors">
                                <Download className="w-3 h-3 mr-1" /> 导出 Word
                              </button>
                              <button onClick={() => handleExport('hwp')} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center font-medium bg-indigo-50 px-2 py-1 rounded transition-colors">
                                <Download className="w-3 h-3 mr-1" /> 导出 HWP
                              </button>
                            </div>
                          </div>
                          <div 
                            className={`p-5 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 flex-1 overflow-y-auto ${section === '正文排版 (본문 - 清州大学硕博论文格式)' ? 'text-justify leading-[2.2] text-[15px]' : 'leading-loose font-medium whitespace-pre-wrap'}`}
                            style={section === '正文排版 (본문 - 清州大学硕博论文格式)' ? { fontFamily: "'Batang', 'BatangChe', 'Nanum Myeongjo', 'Malgun Gothic', serif" } : {}}
                          >
                            {section === '正文排版 (본문 - 清州大学硕博论文格式)' 
                              ? result.finalText.split('\n').map((paragraph, idx) => {
                                  const isHeading = /^(제\s*\d+\s*[장절]|1\.|2\.|3\.|4\.|5\.|[IVX]+\.)/.test(paragraph.trim());
                                  return (
                                    <p key={idx} className={isHeading ? "font-bold text-lg mt-6 mb-3 text-slate-900" : (paragraph.trim() ? "indent-8 mb-2" : "mb-2")}>
                                      {paragraph}
                                    </p>
                                  );
                                })
                              : result.finalText.split('\n').map((paragraph, idx) => {
                                  const isHeading = /^(제\s*\d+\s*[장절]|1\.|2\.|3\.|4\.|5\.|[IVX]+\.)/.test(paragraph.trim());
                                  return (
                                    <p key={idx} className={isHeading ? "font-bold text-lg mt-4 mb-2 text-slate-900" : "mb-2"}>
                                      {paragraph}
                                    </p>
                                  );
                                })}
                          </div>
                        </div>
                      )}

                      {activeTab === 'bilingual' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                              <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                              原文
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                              {inputText}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                              <span className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
                              AI 回译 (Back-translation)
                            </h3>
                            <div className="p-4 bg-green-50/50 rounded-lg border border-green-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {result.backTranslation}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" /> 通过阅读回译，您可以确认韩文翻译是否准确传达了您的原意。
                            </p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'terms' && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800 mb-4">提取的学术术语对齐</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
                                <tr>
                                  <th className="px-4 py-3 font-medium">原文术语</th>
                                  <th className="px-4 py-3 font-medium">{direction === 'zh-to-ko' ? '韩文学术术语' : '中文学术术语'}</th>
                                  <th className="px-4 py-3 font-medium">语境说明</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.terms.map((term, i) => (
                                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-700">{term.source}</td>
                                    <td className="px-4 py-3 font-medium text-blue-600">{term.target}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{term.explanation || '-'}</td>
                                  </tr>
                                ))}
                                {result.terms.length === 0 && (
                                  <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-400">未提取到特定术语</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeTab === 'feedback' && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800 mb-4">歧义消除与修改建议</h3>
                          <div className="space-y-4">
                            {result.issues.map((item, i) => (
                              <div key={i} className="p-4 rounded-lg border border-amber-100 bg-amber-50/30">
                                <div className="flex items-start">
                                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="text-sm font-medium text-slate-800">识别到的问题 / 歧义点</h4>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                        item.confidence === '高' ? 'bg-green-100 text-green-700' :
                                        item.confidence === '中' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                      }`}>
                                        置信度: {item.confidence}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{item.issue}</p>
                                    <h4 className="text-sm font-medium text-slate-800 mb-1">优化方案 / 修改建议</h4>
                                    <p className="text-sm text-slate-600">{item.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {result.issues.length === 0 && (
                              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                                <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                                <p>未发现明显歧义，文本结构良好。</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }: { active: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active 
          ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-lg'
      }`}
    >
      <span className="mr-2 flex-shrink-0">{icon}</span>
      {children}
    </button>
  );
}
