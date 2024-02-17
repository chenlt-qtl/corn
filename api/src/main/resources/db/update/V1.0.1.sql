

-- sys_data id改成数字

CREATE TABLE `sys_data_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `code` varchar(100) DEFAULT NULL COMMENT '编码',
  `value` text COMMENT '值',
  `create_by` varchar(32) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into sys_data_new(`name`,`code`,`value`,`create_time`,`create_by`,`update_time`,`update_by`)
select `name`,`code`,`value`,`create_time`,`create_by`,`update_time`,`update_by` from sys_data ;

drop table sys_data;
rename table sys_data_new to sys_data;

--增加历史记录名称
alter table note_info_history add column `title` varchar(200) after note_id;