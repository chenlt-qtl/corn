alter table word_chinese  modify column jie_gou varchar(100);
alter table word_chinese add column short_acce varchar(100) after acceptation;