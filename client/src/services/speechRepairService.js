// Smart Speech Self-Correction & Stutter Repair Service
// Handles user hesitation, false starts (e.g. "tommo tomorrow" -> "tomorrow"), and contextual corrections.

export class SpeechRepairService {
  /**
   * Cleans stuttering, partial-word false starts, and immediate self-corrections.
   * Example: "I will go there tommo tomorrow" -> "I will go there tomorrow"
   * Example: "having too many urgent hearts are the same time" (with context "tasks") -> corrects "hearts" to "tasks"
   */
  static cleanAndRepairSpeech(rawText, contextualKeywords = []) {
    if (!rawText || typeof rawText !== 'string') {
      return { cleanedText: '', repairedWords: [] };
    }

    let text = rawText.trim();
    const repairedWords = [];

    // 1. Repair common false starts & partial word repetitions:
    // e.g. "tommo tomorrow", "to to tomorrow", "diff different", "impor important", "ex expensive"
    const words = text.split(/\s+/);
    const cleanedWords = [];

    for (let i = 0; i < words.length; i++) {
      const current = words[i];
      const next = words[i + 1];

      if (next) {
        const cleanCur = current.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanNext = next.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Case 1a: Exact duplicate word stutter (e.g. "the the", "I I", "to to")
        if (cleanCur && cleanCur === cleanNext) {
          repairedWords.push({
            original: `${current} ${next}`,
            corrected: next,
            type: 'stutter',
            explanation: `Lược bỏ từ lặp do nói vấp: "${current}"`
          });
          continue; // Skip the duplicated first word
        }

        // Case 1b: User started saying a word and immediately corrected it:
        // Prefix match: cleanCur is a prefix of cleanNext with length >= 2
        // e.g. "tommo" -> "tomorrow", "prob" -> "probably", "becau" -> "because"
        if (cleanCur.length >= 2 && cleanNext.length > cleanCur.length && cleanNext.startsWith(cleanCur.slice(0, 3))) {
          repairedWords.push({
            original: current,
            corrected: next,
            type: 'self-correction',
            explanation: `Tự sửa từ nói vấp dở dang: "${current}" ➔ "${next}"`
          });
          continue; // Replace current partial word with next full word
        }

        // Case 1c: Common phonetic/aborted starts
        if (this.isAbortedAttempt(cleanCur, cleanNext)) {
          repairedWords.push({
            original: current,
            corrected: next,
            type: 'self-correction',
            explanation: `Tự sửa từ dở dang: "${current}" ➔ "${next}"`
          });
          continue;
        }
      }

      cleanedWords.push(current);
    }

    let resultText = cleanedWords.join(' ');

    // 2. Phrase-level self-corrections:
    // Patterns like "X no Y", "X I mean Y", "X sorry Y"
    const correctionPhrases = [
      { regex: /\b([a-zA-Z]+)\s+(?:no|sorry|i mean)\s+([a-zA-Z]+)\b/gi, replacer: '$2' }
    ];

    correctionPhrases.forEach(cp => {
      const match = cp.regex.exec(resultText);
      if (match) {
        repairedWords.push({
          original: match[0],
          corrected: match[2],
          type: 'self-correction',
          explanation: `Nhận diện câu tự sửa: "${match[0]}" ➔ "${match[2]}"`
        });
        resultText = resultText.replace(cp.regex, cp.replacer);
      }
    });

    // 3. Contextual acoustic correction for English learners (e.g. STT heard "hearts" for "tasks" in work context)
    if (contextualKeywords && contextualKeywords.length > 0) {
      const contextReplacements = [
        { spoken: /\bhearts\b/gi, expected: 'tasks', context: ['urgent', 'work', 'stress', 'too many'] },
        { spoken: /\bare the same time\b/gi, expected: 'at the same time', context: ['same time'] },
        { spoken: /\bwok\b/gi, expected: 'work', context: ['hard', 'office', 'stress'] },
        { spoken: /\btink\b/gi, expected: 'think', context: ['i'] },
        { spoken: /\bcoffie\b/gi, expected: 'coffee', context: ['drink', 'cup'] }
      ];

      contextReplacements.forEach(cr => {
        if (cr.spoken.test(resultText)) {
          // Check if context applies
          const matchesContext = cr.context.some(c => resultText.toLowerCase().includes(c));
          if (matchesContext) {
            resultText = resultText.replace(cr.spoken, cr.expected);
            repairedWords.push({
              original: cr.spoken.source.replace(/\\b/g, ''),
              corrected: cr.expected,
              type: 'pronunciation-fix',
              explanation: `Chuẩn hóa phát âm/nhận diện: "${cr.spoken.source.replace(/\\b/g, '')}" ➔ "${cr.expected}"`
            });
          }
        }
      });
    }

    return {
      cleanedText: resultText.trim(),
      repairedWords
    };
  }

  /**
   * Checks if word1 is an aborted attempt at word2 (e.g. "tommo" vs "tomorrow")
   */
  static isAbortedAttempt(w1, w2) {
    if (!w1 || !w2 || w1.length < 2 || w2.length < 3) return false;
    // Common stumbles
    const stumbleMap = {
      'tommo': 'tomorrow',
      'tomor': 'tomorrow',
      'yesder': 'yesterday',
      'restra': 'restaurant',
      'comfor': 'comfortable',
      'becau': 'because',
      'diff': 'different',
      'impor': 'important'
    };
    if (stumbleMap[w1] === w2) return true;

    // Check letter overlap >= 60%
    if (w2.startsWith(w1.slice(0, 2)) && w1.length < w2.length) {
      let common = 0;
      for (let i = 0; i < w1.length; i++) {
        if (w1[i] === w2[i]) common++;
      }
      return common / w1.length >= 0.7;
    }

    return false;
  }
}

