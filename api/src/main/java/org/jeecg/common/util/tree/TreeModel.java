package org.jeecg.common.util.tree;

import java.util.ArrayList;
import java.util.List;

public abstract class TreeModel<T>{

    static final long serialVersionUID = 1L;

    private String key;

    private String title;

    private String parentId;

    private boolean isLeaf;

    private T model;

    public TreeModel() {}

    public TreeModel(T model) {
        this.model=model;
    }

    private List<TreeModel> children = new ArrayList<>();

    public boolean getIsLeaf() {
        return isLeaf;
    }

    public void setIsLeaf(boolean isleaf) {
         this.isLeaf = isleaf;
    }

    public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<TreeModel> getChildren() {
        return children;
    }

    public void setChildren(List<TreeModel> children) {
        if (children==null){
            this.isLeaf=true;
        }else {
            this.children = children;
        }
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public boolean isLeaf() {
        return isLeaf;
    }

    public void setLeaf(boolean leaf) {
        isLeaf = leaf;
    }

    public T getModel() {
        return model;
    }

    public void setModel(T model) {
        this.model = model;
    }
}
