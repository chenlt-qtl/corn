alter table word_sentence add column `mp3_time` varchar(50) after mp3;

CREATE TABLE `read` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `article_id` bigint(20) DEFAULT NULL,
  `next_article_id` bigint(20) DEFAULT NULL,
  `position` varchar (200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- article Id 改成数字

CREATE TABLE `word_article_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) DEFAULT NULL,
  `type` int(11) DEFAULT '0',
  `picture` varchar(200) DEFAULT NULL,
  `mp3` varchar(200) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into word_article_new(`id_old`,`parent_id`,`parent_ids`,`type`,`picture`,`mp3`,`title`,`comment`,`status`,`create_time`,`create_by`,`update_time`,`update_by`)
select `id`,`parent_id`,`parent_ids`,`type`,`picture`,`mp3`,`title`,`comment`,`status`,`create_time`,`create_by`,`update_time`,`update_by` from word_article ;


alter table word_article add column id_new bigint(20);
update word_article,word_article_new  set word_article.id_new = word_article_new.id where word_article_new.id_old = word_article.id;

alter table word_article_new drop column id_old;

update word_sentence,word_article set word_sentence.article_id=word_article.id_new where word_sentence.article_id = word_article.id;

update word_article_word_rel,word_article set word_article_word_rel.article_id=word_article.id_new where word_article_word_rel.article_id = word_article.id;

drop table word_article;
rename table word_article_new to word_article;
