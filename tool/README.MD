# Batch 工具类

## 备份线上图片到本地硬盘
    - NoteContentServiceTest.backupImg
    - 注意：@ActiveProfiles("prod")
    - 此脚本在本地跑
    - 步骤：
        1. 线上数据库查note_content得到图片url
        2. 使用图片url,通过http://42.192.15.59/upload/+url获取到图片
        3. 保存到本地