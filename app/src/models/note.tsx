import { useState } from 'react';
import { queryTreeList, queryNoteById, modifyNote, addNote, queryOpenHistory, addOpenHistory } from '@/pages/note/service'
import { NoteItem } from '@/pages/note/data.d';

//根据ID查找节点
function findNodeById(tree: [], id: string) {
    // console.log(JSON.stringify(tree, null, 2));
    for (let item of tree) {
        if (item.key === id) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            const node = findNodeById(item.children, id);
            if (node) {
                return node;
            }
        }
    }
}

export default () => {

    const [openedNotes, setOpenedNotes] = useState<object[]>([]);
    const [showNote, setShowNote] = useState<NoteItem>({});//正在编辑的note
    const [noteLoading, setNoteLoading] = useState<boolean>(false);
    const [noteData, setNoteData] = useState<object[]>([]);
    const [treeData, setTreeData] = useState<object[]>([]);
    const [treeLoading, setTreeLoading] = useState<boolean>(false);
    const [showOpenNotes, setShowOpenNotes] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [parentId, setParentId] = useState<string>('');


    const queryOpenedNotes = () => {//加载历史记录
        queryOpenHistory().then(({ result }) => {
            setOpenedNotes(result);
        });
    }

    const updateOpenedNotes = (newOpendNotes: object[]) => {
        if (newOpendNotes.length >= 20) {
            newOpendNotes = newOpendNotes.splice(-20);
        }
        const openNoteIds = newOpendNotes.reduce((total: string[], item: NoteItem) => {
            total.push(item.id!);
            return total;
        }, []);
        addOpenHistory(openNoteIds.join(','));
        setOpenedNotes(newOpendNotes);
    }


    const queryTreeData = (parentId: string) => {
        setTreeLoading(true);
        setParentId(parentId);
        queryTreeList({ parentId }).then(({ result }) => {
            setNoteData(result);
            setTreeData(result);
            setTreeLoading(false);
        });
    };

    const onTabChange = (id: string) => {
        setShowNote({});
        if (id) {
            setShowOpenNotes(false);
            queryTreeData(id);
        } else {
            setShowOpenNotes(true);
        }
    }

    const removeOpenNote = (id: string) => {
        updateOpenedNotes(openedNotes.filter(note => note.id != id));
        if (showNote.id === id) {
            setShowNote({});
        }
    }

    const loadNote = ([selectId]: string[]) => {
        const note = openedNotes.find(item => {
            return item.id === selectId;
        });

        if (note) {
            setShowNote(note);
        } else {
            setNoteLoading(true);
            queryNoteById(selectId).then((res) => {
                if (res) {
                    const { result } = res;
                    if(!result.text){
                        result.text = ' ';
                    }
                    setShowNote(result);
                    updateOpenedNotes([result, ...openedNotes]);
                }
                setNoteLoading(false);
            })
        }
    }

    const handleEditNote = () => {
        if (showNote.parentId) {
            setNoteLoading(true);
            if (showNote.id) {
                modifyNote(showNote).then((res) => {
                    const newNoteData = [...noteData];
                    const newTreeData = [...treeData];

                    const noteNode = findNodeById(newNoteData, showNote.id);
                    if (noteNode) {
                        noteNode.title = showNote.name;
                        noteNode.name = showNote.name;
                        setNoteData(newNoteData)
                        setTreeData(newTreeData);
                    }
                    setNoteLoading(false);
                })
            } else {
                addNote(showNote).then((res) => {
                    if (res) {
                        const { result: note } = res;
                        setShowNote(note);

                        const treeNode = {
                            key: note.id,
                            parentIds: note.parentIds,
                            title: note.name,
                            name: note.name,
                            parentId: note.parentId,
                        }

                        if (showNote.parentId === parentId) {
                            setNoteData([...noteData, treeNode]);
                            setTreeData([...treeData, treeNode]);
                        } else {
                            const newNoteData = [...noteData];

                            const noteParent = findNodeById(newNoteData, showNote.parentId);
                            noteParent.children.push(treeNode);

                            setNoteData(newNoteData)
                            setTreeData([...treeData]);
                        }
                    }
                    setNoteLoading(false);
                })
            }
        }
    }

    return {
        openedNotes, removeOpenNote, showNote, setShowNote, onTabChange,
        loadNote, noteLoading, treeLoading, showOpenNotes, handleEditNote, treeData, setTreeData,
        queryOpenedNotes, noteData, searchValue, setSearchValue, parentId
    };
};