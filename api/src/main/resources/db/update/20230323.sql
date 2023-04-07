-- new note
CREATE TABLE `note_info_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) DEFAULT NULL,
  `content_id` bigint(20) DEFAULT NULL,
  `content_id_old` varchar(32) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `parent_id_old` varchar(32) DEFAULT NULL,
  `tag` varchar(200) DEFAULT NULL,
  `source` varchar(200) DEFAULT NULL,
  `is_leaf` int(11) DEFAULT '1',
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

insert into note_info_new(`id_old`,`content_id`,`name`,`parent_id_old`,`tag`,`source`,`is_leaf`,`create_time`,`create_by`,`update_time`,`update_by`,`status`)
select `id`,`content_id`,`name`,`parent_id`,`tag`,`source`,`is_leaf`,`create_time`,`create_by`,`update_time`,`update_by`,`status` from note_info ;

alter table note_info add column id_new bigint(20);
update note_info,note_info_new  set note_info.id_new = note_info_new.id where note_info_new.id_old = note_info.id;
update note_info_new,note_info set note_info_new.parent_id =  note_info.id_new where note_info.id = note_info_new.parent_id_old;

alter table note_info_new drop column id_old;
alter table note_info_new drop column parent_id_old;

update note_info set parent_id =0 where parent_id is null;


CREATE TABLE `note_content_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_old` varchar(32) NOT NULL,
  `text` longtext,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

insert into note_content_new(`id_old`,`text`,`create_time`,`create_by`,`update_time`,`update_by`)
select `id`,`text`,`create_time`,`create_by`,`update_time`,`update_by` from note_content ;
update note_info_new,note_content_new set note_info_new.content_id =  note_content_new.id where note_info_new.content_id_old = note_content_new.id_old;

alter table note_info_new drop column content_id_old;
alter table note_content_new drop column id_old;

DROP table note_info;
rename table note_info_new to note_info;

DROP table note_content;
rename table note_content_new to note_content;

CREATE TABLE `note_info_delete_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `note_id` bigint(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `tag` varchar(200) DEFAULT NULL,
  `source` varchar(200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP table note_info_delete;
rename table note_info_delete_new to note_info_delete;

CREATE TABLE `note_info_history_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `note_id` bigint(20) NOT NULL,
  `text` text,
  `create_by` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP table note_info_history;
rename table note_info_history_new to note_info_history;

DROP table note_open_keys;
DROP table note_open_history;

CREATE TABLE `note_favorite_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `note_ids` text,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP table note_favorite;
rename table note_favorite_new to note_favorite;

CREATE TABLE `note_open_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `open_note_ids` varchar(1000) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_by` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_by` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;