--增加中文解释
alter table word_sentence add column `acceptation` varchar(200) after content;
