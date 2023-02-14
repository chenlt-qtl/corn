package org.seed.common.util.tree;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public abstract class TreeModel<T>{

    static final long serialVersionUID = 1L;

    private String key;

    private String title;

    private String name;

    private String parentId;

    private Boolean isLeaf;

    private T model;

    public TreeModel() {}

    public TreeModel(T model) {
        this.model=model;
    }

    private List<TreeModel> children = new ArrayList<>();

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

}
