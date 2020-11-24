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
    const [tabId, setTabId] = useState<string>('');
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);


    const queryOpenedNotes = () => {//加载历史记录
        queryOpenHistory().then((res) => {
            if (res) {
                const { result } = res;
                setOpenedNotes(result);
            }
        });
    }

    const updateOpenedNotes = (newOpendNotes: object[]) => {
        if (newOpendNotes.length >= 20) {
            newOpendNotes = newOpendNotes.splice(0,20);
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
        setTabId(parentId);
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
                    if (!result.text) {
                        result.text = ' ';
                    }
                    setShowNote(result);
                    updateOpenedNotes([result, ...openedNotes]);
                }
                setNoteLoading(false);
            })
        }
    }

    const editNote = (note) => {
        if (note.parentId) {
            setNoteLoading(true);
            if (note.id) {
                modifyNote(note).then((res) => {
                    const newNoteData = [...noteData];
                    const newTreeData = [...treeData];

                    const noteNode = findNodeById(newNoteData, note.id);
                    if (noteNode) {
                        noteNode.title = note.name;
                        noteNode.name = note.name;
                        setNoteData(newNoteData)
                        setTreeData(newTreeData);
                    }
                    setNoteLoading(false);
                    updateOpenedNotes(openedNotes.map(item => {return (item.id === note.id)?note:item;}));
                })
            } else {
                addNote(note).then((res) => {
                    if (res) {
                        const { result: newNote } = res;
                        updateOpenedNotes([...openedNotes,newNote]);
                        !showNote.id&&setShowNote(newNote);

                        const treeNode = {
                            key: newNote.id,
                            parentIds: newNote.parentIds,
                            title: newNote.name,
                            name: newNote.name,
                            parentId: newNote.parentId,
                        }

                        if (note.parentId === tabId) {
                            setNoteData([...noteData, treeNode]);
                            setTreeData([...treeData, treeNode]);
                        } else {
                            const newNoteData = [...noteData];

                            const noteParent = findNodeById(newNoteData, note.parentId);
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
        loadNote, noteLoading, treeLoading, showOpenNotes, editNote, treeData, setTreeData,
        queryOpenedNotes, noteData, searchValue, setSearchValue, tabId,selectedKeys, setSelectedKeys
    };
};