//分割单词
export interface DisplaySentence {
    id?: string;
    content?: string;
    mp3?: string;
    picture?: string;
    allWords: { text: string, isWord: boolean }[]
}

export const brReg = /[\n]+/; //匹配换行

export const splipSentences = (sentenceStrs: string[]) => {
    const sentences: DisplaySentence[] = [];

    let patt = /([a-z|'|-]+)/ig;
    let r = null;
    return sentenceStrs.reduce((sentences, item) => {
        if (item) {
            const sentence: DisplaySentence = { allWords: [] };
            let index = 0;
            while (r = patt.exec(item)) {
                const word = r[0];
                if (r.index > index) {
                    sentence.allWords.push({ text: item.slice(index, r.index).trim(), isWord: false });
                }
                sentence.allWords.push({ text: word, isWord: true });
                index = r.index + word.length;
            }
            if (index < item.length) {
                sentence.allWords.push({ text: item.slice(index).trim(), isWord: false });
            }
            sentences.push(sentence);
        }
        return sentences;
    }, sentences);
}