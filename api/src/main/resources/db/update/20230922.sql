--学习模块改进
RENAME TABLE word TO word_english;
alter table word_article add column id_new bigint(20) NOT NULL;


--word_article_word_rel
CREATE TABLE `word_article_word_rel_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `article_id` bigint(20) NOT NULL,
  `word_id` bigint(20),
  `word_id_old` varchar(32) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into word_article_word_rel_new(  `id_old`, `article_id`, `word_id_old`, `status`, `create_time`, `create_by`, `update_time`, `update_by`)
select   `id`, `article_id`, `word_id`, `status`, `create_time`, `create_by`, `update_time`, `update_by` from word_article_word_rel ;

--sentence
CREATE TABLE `word_sentence_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `article_id` bigint(20) NOT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `acceptation` varchar(200) DEFAULT NULL,
  `idx` int(11) DEFAULT NULL,
  `picture` varchar(200) DEFAULT NULL,
  `mp3` varchar(200) DEFAULT NULL,
  `mp3_time` varchar(50) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into word_sentence_new( `id_old`,  `article_id`,  `content`,  `acceptation`,  `idx` ,  `picture`,  `mp3`,  `mp3_time`,  `status`,  `create_time`,  `create_by`,  `update_time`,  `update_by`)
select  `id` ,   `article_id`,  `content`,  `acceptation`,  `idx` ,  `picture`,  `mp3`,  `mp3_time`,  `status`,  `create_time`,  `create_by`,  `update_time`,  `update_by` from word_sentence ;

--word_english
CREATE TABLE `word_english_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `word_name` varchar(200) DEFAULT NULL,
  `ph_am` varchar(200) DEFAULT NULL,
  `acceptation` varchar(1000) DEFAULT NULL,
  `exchange` varchar(200) DEFAULT NULL,
  `parts` varchar(1000) DEFAULT NULL,
  `ph_an_mp3` varchar(1000) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into word_english_new( `id_old`,`word_name`,`ph_am`,`acceptation`,`exchange`,`parts`,`ph_an_mp3`,`status`,`create_time`,`create_by`,`update_time`,`update_by`)
select  `id`,`word_name`,`ph_am`,`acceptation`,`exchange`,`parts`,`ph_an_mp3`,`status`,`create_time`,`create_by`,`update_time`,`update_by` from word_english ;

--word_chinese
CREATE TABLE `word_chinese_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `word_name` varchar(10) DEFAULT NULL,
  `pin_yin` varchar(30) DEFAULT NULL,
  `bi_hua_shu` int(11) DEFAULT NULL,
  `bu_shou` varchar(10) DEFAULT NULL,
  `jie_gou` varchar(100) DEFAULT NULL,
  `bi_shun` varchar(100) DEFAULT NULL,
  `wubi` varchar(10) DEFAULT NULL,
  `english` varchar(200) DEFAULT NULL,
  `acceptation` varchar(500) DEFAULT NULL,
  `short_acce` varchar(100) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into word_chinese_new( `id_old`,`word_name`,`pin_yin`,`bi_hua_shu`,`bu_shou`,`jie_gou`,`bi_shun`,`wubi`,`english`,`acceptation`,`short_acce`,`status`,`create_time`,`create_by`,`update_time`,`update_by`)
select  `id`,`word_name`,`pin_yin`,`bi_hua_shu`,`bu_shou`,`jie_gou`,`bi_shun`,`wubi`,`english`,`acceptation`,`short_acce`,`status`,`create_time`,`create_by`,`update_time`,`update_by` from word_chinese ;

--word_chinese_explain
CREATE TABLE `word_chinese_explain_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `word_id` bigint(20) DEFAULT NULL,
  `word_id_old` varchar(32) DEFAULT NULL,
  `pin_yin` varchar(30) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert into word_chinese_explain_new(`id_old`,`word_id_old`,`pin_yin`,`content`,`status`,`create_time`,`create_by`,`update_time`,`update_by`
)select  `id`,`word_id`,`pin_yin`,`content`,`status`,`create_time`,`create_by`,`update_time`,`update_by` from word_chinese_explain ;

CREATE TABLE `word_iciba_sentence_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `word_id` bigint(20) ,
  `word_id_old` varchar(32) DEFAULT NULL,
  `orig` varchar(1000) DEFAULT NULL,
  `trans` varchar(1000) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into word_iciba_sentence_new(`id_old`,`word_id_old`,`orig`,`trans`,`status`,`create_time`,`create_by`,`update_time`,`update_by`)
select  `id`,`word_id`,`orig`,`trans`,`status`,`create_time`,`create_by`,`update_time`,`update_by` from word_iciba_sentence ;

CREATE TABLE `word_user_rel_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `user` varchar(100) DEFAULT NULL,
  `type` int(11) DEFAULT '0',
  `word_id` bigint(20),
  `word_id_old` varchar(32) DEFAULT NULL,
  `add_from` int(11) DEFAULT NULL,
  `familiarity` int(11) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into word_user_rel_new(`id_old`,`user`,`word_id_old`,`add_from`,`familiarity`,`status`,`create_time`,`create_by`,`update_time`,`update_by`)
select  `id`,`user`,`word_id`,`add_from`,`familiarity`,`status`,`create_time`,`create_by`,`update_time`,`update_by` from word_user_rel ;

--更新ID字段
update word_user_rel_new,word_english_new set word_user_rel_new.word_id=word_english_new.id where word_user_rel_new.word_id_old = word_english_new.id_old;
alter table word_user_rel_new drop column id_old;
alter table word_user_rel_new drop column word_id_old;
drop table word_user_rel;
rename table word_user_rel_new to word_user_rel;


update word_article_word_rel_new,word_english_new set word_article_word_rel_new.word_id=word_english_new.id where word_article_word_rel_new.word_id_old = word_english_new.id_old;
alter table word_article_word_rel_new drop column id_old;
alter table word_article_word_rel_new drop column word_id_old;
drop table word_article_word_rel;
rename table word_article_word_rel_new to word_article_word_rel;

alter table word_chinese_explain_new drop column id_old;
alter table word_chinese_explain_new drop column word_id_old;
drop table word_chinese_explain;
rename table word_chinese_explain_new to word_chinese_explain;

alter table word_sentence_new drop column id_old;
drop table word_sentence;
rename table word_sentence_new to word_sentence;


update word_iciba_sentence_new,word_chinese_new set word_iciba_sentence_new.word_id=word_chinese_new.id where word_iciba_sentence_new.word_id_old = word_chinese_new.id_old;
alter table word_iciba_sentence_new drop column id_old;
alter table word_iciba_sentence_new drop column word_id_old;
drop table word_iciba_sentence;
rename table word_iciba_sentence_new to word_iciba_sentence;

alter table word_chinese_new drop column id_old;
drop table word_chinese;
rename table word_chinese_new to word_chinese;

alter table word_english_new drop column id_old;
drop table word_english;
rename table word_english_new to word_english;