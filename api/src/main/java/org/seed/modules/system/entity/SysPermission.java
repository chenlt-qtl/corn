package org.seed.modules.system.entity;

import java.io.Serializable;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.seed.common.aspect.annotation.Dict;

/**
 * <p>
 * 菜单权限表
 * </p>
 *
 * @author scott
 * @since 2018-12-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class SysPermission implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * id
	 */
	@TableId(type = IdType.UUID)
	private String id;

	/**
	 * 父id
	 */
	private String parentId;

	/**
	 * 菜单名称
	 */
	private String name;

	/**
	 * 菜单权限编码，例如：“sys:schedule:list,sys:schedule:info”,多个逗号隔开
	 */
	private String perms;

	/**
	 * 菜单图标
	 */
	private String icon;

	/**
	 * 组件
	 */
	private String component;
	
	/**
	 * 组件名字
	 */
	private String componentName;

	/**
	 * 路径
	 */
	private String url;
	/**
	 * 一级菜单跳转地址
	 */
	private String redirect;

	/**
	 * 菜单排序
	 */
	private Integer sortNo;

	/**
	 * 类型（0：一级菜单；1：子菜单 ；2：按钮权限）
	 */
	@Dict(dicCode = "menu_type")
	private Integer menuType;

	/**
	 * 是否叶子节点: 1:是  0:不是
	 */
	@TableField(value="is_leaf")
	private boolean leaf;
	
	/**
	 * 是否路由菜单: 0:不是  1:是（默认值1）
	 */
	@TableField(value="is_route")
	private boolean route;

	/**
	 * 描述
	 */
	private String description;

	/**
	 * 创建人
	 */
	private String createBy;

	/**
	 * 删除状态 0正常 1已删除
	 */
	private Integer delFlag;
	
	/**
	 * 是否隐藏路由菜单: 0否,1是（默认值0）
	 */
	private boolean hidden;

	/**
	 * 创建时间
	 */
	private Date createTime;

	/**
	 * 更新人
	 */
	private String updateBy;

	/**
	 * 更新时间
	 */
	private Date updateTime;
	
	/**alwaysShow*/
    private boolean alwaysShow;
}
