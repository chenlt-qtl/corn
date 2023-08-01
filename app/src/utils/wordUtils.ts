//分割单词
export interface DisplaySentence {
    id?: string;
    content?: string;
    mp3?: string;
    picture?: string;
    allWords: { text: string, isWord: boolean }[]
}

export const brReg = /[\n]+/; //匹配换行

export const timeIntervalReg = /^\[(\d{2}):(\d{2}\.\d{2})\](\[(\d{2}):(\d{2}\.\d{2})\])?/;//匹配mp3时间区间

/**
 * 
 * @param sentenceStrs 
 * @param type 0英语 1中文
 * @returns 
 */
export const splipSentences = (sentenceStrs: string[], type: number) => {
    const sentences: DisplaySentence[] = [];

    let patt = /([a-z|'|-]+)/ig;
    if (type) {
        patt = /([\u4e00-\u9fa5])/ig;
    }
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

//从歌词里提取时间
export const getMp3Time = (sentence: string) => {

    const matcher = sentence.match(timeIntervalReg);

    if (matcher) {
        const [a, startMin, startSecond, b, endMin, endSecond] = [...matcher];

        let startTime;
        let duration;

        if (startMin) {
            startTime = Number.parseInt(startMin) * 60 + Number.parseFloat(startSecond);

            if (endMin) {
                const endTime = Number.parseInt(endMin) * 60 + Number.parseFloat(endSecond);
                duration = endTime - startTime;
            }
        }
        return startTime + "," + duration
    }
}


let timer;
/**
 * 根据时间播放音频
 * @param player  播放器
 * @param startTimeStr  开始时间
 * @param endTimeStr 结束时间
 * @param rate 播放速度
 */
export const doPlay = (player, startTimeStr = "0", durationStr = "0", rate) => {

    console.log("times", startTimeStr, durationStr);

    //先重置
    clearTimeout(timer)
    player.pause();

    const startTime = parseInt(startTimeStr)//秒
    const duration = parseFloat(durationStr)//毫秒

    player.currentTime = startTime;
    player.playbackRate = rate;//速率

    player.play();

    if (duration) {

        const realDuration = duration / rate;
        console.log("duration", realDuration);

        timer = setTimeout(() => {
            player.pause();
        }, realDuration * 1000)
    }

}

