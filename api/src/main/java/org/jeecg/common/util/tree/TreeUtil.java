package org.jeecg.common.util.tree;

import org.apache.commons.lang3.StringUtils;
import org.jeecg.modules.system.entity.SysDepart;
import org.jeecg.modules.system.model.DepartIdModel;
import org.jeecg.modules.system.model.SysDepartTreeModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TreeUtil {

    /**
     * queryTreeList的子方法 ====1=====
     * 该方法设置TreeModel的children
     */
    public static List wrapTreeDataToTreeList(List<? extends TreeModel> list,String parentId) {
        Map<String,TreeModel> allMap = new HashMap<>();
        List<TreeModel> result = new ArrayList<>();
        for(TreeModel model:list){
            allMap.put(model.getKey(),model);
            if(parentId.equals(model.getParentId())){
                result.add(model);
            }
        }
        findChildren(list, allMap);
        setEmptyChildrenAsNull(list);
        return result;
    }

    /**
     * queryTreeList的子方法 ====2=====
     * 该方法是找到并封装顶级父类的节点到TreeList集合
     */
    private static void findChildren(List<? extends TreeModel> recordList,
                                                         Map<String,TreeModel> allMap) {

        for (int i = 0; i < recordList.size(); i++) {
            TreeModel branch = recordList.get(i);
            if (StringUtils.isNotBlank(branch.getParentId())&&allMap.containsKey(branch.getParentId())) {
                TreeModel parent = allMap.get(branch.getParentId());
                parent.getChildren().add(branch);
            }
        }
    }

    /**
     * queryTreeList的子方法====3====
     *该方法是找到顶级父类下的所有子节点集合并封装到TreeList集合
     */
    private static void getGrandChildren(List<SysDepartTreeModel> treeList,List<SysDepartTreeModel> recordList,List<DepartIdModel> idList) {

        for (int i = 0; i < treeList.size(); i++) {
            SysDepartTreeModel model = treeList.get(i);
            DepartIdModel idModel = idList.get(i);
            for (int i1 = 0; i1 < recordList.size(); i1++) {
                SysDepartTreeModel m = recordList.get(i1);
                if (m.getParentId().equals(model.getId())) {
                    model.getChildren().add(m);
                    DepartIdModel dim = new DepartIdModel().convert(m);
                    idModel.getChildren().add(dim);
                }
            }
            getGrandChildren(treeList.get(i).getChildren(), recordList, idList.get(i).getChildren());
        }

    }
    

    /**
     * queryTreeList的子方法 ====4====
     * 该方法是将子节点为空的List集合设置为Null值
     */
    private static void setEmptyChildrenAsNull(List<? extends TreeModel> treeList) {

        for (int i = 0; i < treeList.size(); i++) {
            TreeModel model = treeList.get(i);
            if (model.getChildren().size() == 0) {
                model.setChildren(null);
                model.setLeaf(true);
            }else{
                setEmptyChildrenAsNull(model.getChildren());
                model.setLeaf(false);
            }
        }
    }
}
