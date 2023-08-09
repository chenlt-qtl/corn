export default {
    index: "/page/note",
    routes: [
        {
            path: '/page',
            component: '@/layouts/HeaderLayout',
            desc: '有头部的',
            routes: [
                {
                    path: '/note',
                    name: '笔记',
                    component: './note',
                },
                {
                    path: '/word',
                    name: '英语',
                    component: './word',
                },
                {
                    path: '/article/list',
                    name: '英语',
                    component: './word/articleList',
                },
                {
                    path: '/article/:id',
                    name: '英语',
                    component: './word/articleDetail',
                },
                // {
                //     path: '/word/:id',
                //     component: './word/articleDetail',
                // },
                {
                    path: '/splicMp3',
                    name: '切割',
                    component: './splicMp3',
                },
                {
                    path: '/wordChinese',
                    name: '语文天地',
                    component: './wordChinese/articleList',
                },
                {
                    path: '/wordChinese/:id',
                    component: './wordChinese/articleDetail',
                },
                {
                    path: '/game',
                    name: '游戏管理',
                    component: './game/gameList',
                },
                {
                    path: '/play/list',
                    name: '游戏',
                    component: './game/play/list',
                }
                ,
                {
                    path: '/play/:id',
                    component: './game/play/levelList',
                }
                ,
                {
                    path: '/exam',
                    name: '例子',
                    component: './exam',
                },
                {
                    path: '/food',
                    component: './food',
                    name: '食谱',
                },
                {
                    path: '/card',
                    component: './card',
                    name: '卡片',
                }

            ]
        },
        {
            path: '/all',
            component: '@/layouts/BlankLayout',
            desc: "没有头部的",
            routes: [
                {
                    path: '/play/cn/:id',
                    component: './game/play/cnGame',
                },
                {
                    path: '/read/:menuIndex',
                    component: './read',
                },
                {
                    path: '/read',
                    component: './read',
                },
                {
                    path: '/game',
                    component: './Game',
                },
            ]
        }
    ]

}