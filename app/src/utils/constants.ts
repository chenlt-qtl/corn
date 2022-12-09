//所有笔画
export const bihua = (() => ["ノ", "一", "丨", "フ", "丶"])();

export const cardItems = (() => [[
    { title: "认真吃饭", values: [1, -1] },
    { title: "挑食", values: [1, -1] },
    { title: "洗澡", values: [1, -1] },
    { title: "刷牙", values: [1, -1] },
    { title: "帮忙做家务", value: 3 },
    { title: "收拾玩具", values: [3, -3] },
    { title: "收拾书", value: 2 },
], [
    { title: "抄作业", values: [2, -2] },
    { title: "7点前完成作业", value: 10 },
    { title: "8点前完成作业", value: 5 },
    { title: "9点前完成作业", value: 2 },
    { title: "10点后完成作业", value: -10 },
    { title: "没完成作业前画画", value: -2 },
], [
    { title: "10点前睡觉", values: [5, -5] },
    { title: "睡前不说话", value: 5 },
]
])();

export const cardTabs = (() => [
    "习惯", "学习", "作息"
])();