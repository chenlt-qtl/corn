export default {
    index: "/a/noteapp",
    routes: [
        {
            path: '/a',
            component: '@/layouts/HeaderLayout',
            desc: '有头部的',
            routes: [
                {
                    path: '/noteapp',
                    name: '笔记',
                    component: 'note',
                },
                {
                    path: '/word',
                    name: '英语',
                    component: './word/articleList',
                },
                {
                    path: '/word/:id',
                    component: './word/articleDetail',
                },
                {
                    path: '/splicMp3',
                    name: '切割',
                    component: './splicMp3',
                },
                {
                    path: '/wordChinese',
                    name: '语言天地',
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
                }

            ]
        },
        {
            path: '/b',
            component: '@/layouts/BlankLayout',
            desc: "没有头部的",
            routes: [
                {
                    path: '/play/cn/:id',
                    component: './game/play/cnGame',
                }]
        }
    ]

}