import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type TranslationResult = {
  finalText: string;
  backTranslation: string;
  terms: {
    source: string;
    target: string;
    explanation: string;
  }[];
  issues: {
    issue: string;
    confidence: '高' | '中' | '低';
    suggestion: string;
  }[];
};

// ==================== 学术韩语翻译专用 Prompt 配置 ====================

// Few-shot 真实例句 (中译韩)
export const ACADEMIC_FEW_SHOT = `
1. **社会科学/文化研究类**（被动语态 + 客观结果句）
   - 原文韩文：본 연구에서는 한국 사회정책 관련 문헌을 분석한 결과, 농촌진흥 정책의 시행 과정에서 문화적 적응 문제가 현저하게 존재하는 것으로 나타났다.
   - 直译版：이 연구는 한국 사회 정책 문헌 분석을 통해 농촌진흥 정책이 시행되는 과정에서 문화 적응 도전을 직면한다는 것을 발견했다.
   - 学术重构版：본 연구에서는 한국 사회정책 관련 문헌을 분석한 결과, 농촌진흥 정책의 시행 과정에서 문화적 적응 문제가 현저하게 존재하는 것으로 나타났다.

2. **艺术/特撮物类**（外来语音译 + 被动 + 学术连接）
   - 原文韩文：현대 예술 창작에서 디지털 미디어 기술은 인터랙티브 설치 작품 제작에 광범위하게 활용되고 있으며, 이는 포스트모더니즘 미학의 핵심적 특징을 나타내는 것으로 파악된다.
   - 直译版：현대 예술 창작에서 디지털 기술은 인터랙티브 장치에 널리 사용되고 있으며, 이는 포스트모던 미학의 핵심 특징을 보여준다.
   - 学术重构版：현대 예술 창작에서 디지털 미디어 기술은 인터랙티브 설치 작품 제작에 광범위하게 활용되고 있으며, 이는 포스트모더니즘 미학의 핵심적 특징을 나타내는 것으로 파악된다.

3. **研究结果常用模板**（~ 결과 ~으로 나타났다）
   - 原文韩文：~ 결과 ~으로 나타났다 / ~한 결과 ~이 밝혀졌다.
   - 直译版：분석 결과 문화적 문제가 발견되었다.
   - 学术重构版：분석 결과 문화적 적응 문제가 현저하게 존재하는 것으로 나타났다.

4. **特撮物研究专用句**（从第2篇论文提取）
   - 原文韩文：그러나 <레전드히어로 삼국전>의 결과물이 만들어지기까지는 많은 시행착오가 있었을 것이다.
   - 直译版：하지만 <레전드히어로 삼국전>의 결과물이 만들어지기까지 많은 시행착오가 있었다.
   - 学术重构版：그러나 <레전드히어로 삼국전>의 결과물이 만들어지기까지는 많은 시행착오가 있었을 것으로 사료된다.

5. **结论句式**（~으로 파악된다 / ~라고 할 수 있다）
   - 原文韩文：이러한 태도는 어린이 영화로서 가져야 할 교육적 가치이자 80년대 한국사회의 미래에 대한 긍정적 믿음이었다.
   - 直译版：이런 태도는 어린이 영화로서 교육적 가치이자 80년대 한국 사회 미래에 대한 긍정적 믿음이었다.
   - 学术重构版：이러한 태도는 어린이 영화로서 가져야 할 교육적 가치이자 1980년대 한국 사회의 미래에 대한 긍정적 믿음으로 파악된다.

6. **逻辑连接 + 被动**（从第3篇论文提取）
   - 原文韩文：이에 따라 앞으로 특촬물 제작에 임하는 인력들은 특촬물을 전담할 스턴트 배우의 양성, 특수 의상 및 소품의 디자인과 재질의 개선 등을 통해 제작 진행을 개선할 수 있을 것이다.
   - 直译版：따라서 앞으로 특촬물 제작하는 사람들은 스턴트 배우 양성, 특수 의상과 소품 개선 등을 통해 제작을 개선할 수 있을 것이다.
   - 学术重构版：이에 따라 앞으로 특촬물 제작에 임하는 인력들은 특촬물을 전담할 스턴트 배우의 양성, 특수 의상 및 소품의 디자인과 재질의 개선 등을 통해 제작 진행을 개선할 수 있을 것으로 사료된다.
`;

// Few-shot 真实例句 (韩译中)
export const KO_TO_ZH_FEW_SHOT = `
1. **社会科学类**
   - 原文韩文：본 연구에서는 한국 사회정책 관련 문헌을 분석한 결과, 농촌진흥 정책의 시행 과정에서 문화적 적응 문제가 현저하게 존재하는 것으로 나타났다.
   - 学术重构版：本研究通过对韩国社会政策相关文献的分析表明，在乡村振兴政策的实施过程中，显著存在文化适应问题。

2. **结论句式**
   - 原文韩文：이러한 태도는 어린이 영화로서 가져야 할 교육적 가치이자 1980년대 한국 사회의 미래에 대한 긍정적 믿음으로 파악된다.
   - 学术重构版：这种态度不仅是儿童电影应具备的教育价值，也被视为对20世纪80年代韩国社会未来的积极信念。
`;

// 4步Pipeline各节点专用 System Prompt (中译韩)
export const PIPELINE_PROMPTS = {
  Step1_Literal: `你是精准的韩中学术术语对齐专家。请对输入的文本进行初步直译，并提取核心学术词汇，强制使用标准韩文学术对应（如韩国学者常用表达）。`,
  Step2_Refine: `你是韩国KCI/RISS期刊审稿专家。请对初步翻译进行学术风格重构，使其完全符合韩国本土博士学位论文和期刊论文的写作规范。
【强制规则】：
1. 被动语态优先：大量使用被动表达（如 ~되었다, ~으로 분석되었다, ~이/가 밝혀졌다）。
2. 外来语词音译优先：所有外来概念必须使用韩国学术界标准音译。
3. 汉字词与正式学术词汇优先：使用正式学术用语，避免口语词。
4. 论文结构与专属句式映射：根据输入文本所属的论文章节，强制使用KCI标准句式。
5. 客观中立、无机器翻译味：去除任何“翻译体”痕迹，保持韩国学者自然的学术流畅度。
6. 排版与格式（清州大学博士学位论文标准）：严格参考标准学位论文的排版层级。如果原文包含标题层级，请强制转换为“제 1 장”（第1章）、“제 1 절”（第1节）、“1.”（小节）的层级格式。段落结构保持严谨，段首缩进，图表引用使用“<그림 1>”、“<표 1>”的格式。`,
  Step3_Disambiguate: `你是韩国学术论文歧义消除专家。请扫描重构后的韩文文本中的所有可能歧义词汇/句式，结合全文上下文进行消除，解决多义词、概念在韩语学术语境下的歧义。`,
  Step4_Polish: `你是资深韩国大学教授。请对文本进行最终润色，检查整体连贯性、段落过渡、学术 formality。并生成中/英回译（Back-translation）供用户验证准确性，整理术语表和潜在问题标注及修改建议。`
};

// 4步Pipeline各节点专用 System Prompt (韩译中)
export const PIPELINE_PROMPTS_KO_TO_ZH = {
  Step1_Literal: `你是精准的韩中学术术语对齐专家。请对输入的韩文文本进行初步直译为中文，并提取核心学术词汇，强制使用中国知网(CNKI)标准的中文学术对应词汇。`,
  Step2_Refine: `你是中国核心期刊(CSSCI)审稿专家。请对初步翻译的中文进行学术风格重构，使其完全符合中国本土硕博学位论文和核心期刊的写作规范。
【强制规则】：
1. 学术书面语优先：大量使用规范的中文学术表达（如“本研究表明”、“显著正相关”、“综上所述”、“旨在”）。避免口语化表达。
2. 句式结构优化：将韩文冗长的修饰语转化为符合中文阅读习惯的定语或状语，必要时进行拆句。
3. 专业术语准确：确保外来语和专业概念符合中国大陆学术界的通用译法。
4. 客观中立：保持学术研究的客观性，去除主观色彩浓厚的词汇。`,
  Step3_Disambiguate: `你是中韩双语学术论文歧义消除专家。请扫描重构后的中文文本中的所有可能歧义词汇/句式，结合韩文原文上下文进行消除，确保逻辑严密。`,
  Step4_Polish: `你是资深中国大学教授。请对文本进行最终润色，检查整体连贯性、段落过渡、学术规范性。并生成中/韩回译（Back-translation）供用户验证准确性，整理术语表和潜在问题标注及修改建议。`
};

export async function translateToAcademicKorean(text: string, domain: string, section: string, direction: 'zh-to-ko' | 'ko-to-zh' = 'zh-to-ko'): Promise<TranslationResult> {
  const prompts = direction === 'zh-to-ko' ? PIPELINE_PROMPTS : PIPELINE_PROMPTS_KO_TO_ZH;
  const fewShot = direction === 'zh-to-ko' ? ACADEMIC_FEW_SHOT : KO_TO_ZH_FEW_SHOT;
  const targetLang = direction === 'zh-to-ko' ? '韩文' : '中文';

  // Step 1: Literal Translation & Terminology
  const step1Res = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `【学科领域】：${domain}\n【论文章节】：${section}\n【原文文本】：\n${text}`,
    config: {
      systemInstruction: prompts.Step1_Literal,
    }
  });
  const step1Text = step1Res.text || '';

  // Step 2: Academic Style Refinement
  const step2Res = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `【Few-shot 示例参考】:\n${fewShot}\n\n【初步翻译结果】:\n${step1Text}`,
    config: {
      systemInstruction: prompts.Step2_Refine,
    }
  });
  const step2Text = step2Res.text || '';

  // Step 3: Disambiguation
  const step3Res = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `【原文文本】：\n${text}\n\n【重构后文本】：\n${step2Text}`,
    config: {
      systemInstruction: prompts.Step3_Disambiguate,
    }
  });
  const step3Text = step3Res.text || '';

  // Step 4: Final Polish & JSON Formatting
  const step4Res = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `【最终${targetLang}文本】：\n${step3Text}\n\n请输出最终的JSON格式结果。`,
    config: {
      systemInstruction: prompts.Step4_Polish,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          finalText: { type: Type.STRING, description: `最终可投稿级${targetLang}正文` },
          backTranslation: { type: Type.STRING, description: "对照回译" },
          terms: {
            type: Type.ARRAY,
            description: "术语表（原文 | 译文 | 说明）",
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING, description: "原文术语" },
                target: { type: Type.STRING, description: `目标语言学术术语` },
                explanation: { type: Type.STRING, description: "语境说明" }
              },
              required: ["source", "target", "explanation"]
            }
          },
          issues: {
            type: Type.ARRAY,
            description: "潜在问题标注 + 置信度 + 修改建议",
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING, description: "识别到的问题 / 歧义点" },
                confidence: { type: Type.STRING, enum: ["高", "中", "低"], description: "置信度" },
                suggestion: { type: Type.STRING, description: "修改建议 / 优化方案" }
              },
              required: ["issue", "confidence", "suggestion"]
            }
          }
        },
        required: ["finalText", "backTranslation", "terms", "issues"]
      }
    }
  });

  if (!step4Res.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(step4Res.text) as TranslationResult;
}

// Keep the old function name as an alias
export const translateAcademicText = translateToAcademicKorean;
