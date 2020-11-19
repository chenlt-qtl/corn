import React, { useState, useCallback } from 'react';
import { queryTreeList, queryNoteById, modifyNote,queryOpenHistory,addOpenHistory } from '@/pages/note/service'

export default () => {
    const [counter, setCounter] = useState(0);
    const increment = useCallback(() => setCounter((c) => c + 1), []);
    const decrement = useCallback(() => setCounter((c) => c - 1), []);

    const [openedNotes, setOpenedNotes] = useState<object[]>([]);
    const [showNote, setShowNote] = useState<object>({});//正在编辑的note
    const [noteLoading, setNoteLoading] = useState<boolean>(false);
    const [noteData, setNoteData] = useState<object[]>([]);
    const [treeData, setTreeData] = useState<object[]>([]);
    const [treeLoading, setTreeLoading] = useState<boolean>(false);
    const [showOpenNotes, setShowOpenNotes] = useState<boolean>(true);

    const queryOpenedNotes = ()=>{//加载历史记录
        queryOpenHistory().then(({ result }) => {
            setOpenedNotes(result);
        });
    }

    const updateOpenedNotes= (newOpendNotes:object[])=>{
        if(newOpendNotes.length>=20){
            newOpendNotes = newOpendNotes.splice(-20);
        }
        const openNoteIds = newOpendNotes.reduce((total:[],item)=>{
            total.push(item.id);
            return total;
        },[]);
        addOpenHistory(openNoteIds.join(','));
        setOpenedNotes(newOpendNotes);
    }


    const queryTreeData = (parentId: string) => {
        setTreeLoading(true);
        queryTreeList({ parentId }).then(({ result }) => {
            setNoteData(result);
            setTreeData(result);
            setTreeLoading(false);
        });
    };

    const onTabChange = (id: string) => {
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
            queryNoteById(selectId).then(({ result }) => {
                setShowNote(result);
                updateOpenedNotes([result, ...openedNotes]);
                setNoteLoading(false);
            })
        }
    }

    const handleModifyNote = () => {
        setNoteLoading(true);
        modifyNote(showNote).then(({ result }) => {
            setNoteLoading(false);
        })
    }

    return {
        openedNotes, removeOpenNote, showNote, setShowNote, onTabChange,
        loadNote, noteLoading, treeLoading, showOpenNotes, handleModifyNote,treeData,setTreeData,
        queryOpenedNotes,noteData
    };
};