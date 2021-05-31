import React, { useEffect } from 'react';
import { connect, NoteState } from 'umi';
import NoteList from './NoteList'


const OpenNotes: React.FC<{}> = (props) => {

    useEffect(() => {
        props.dispatch({
            type: 'openNotes/queryOpenNote',
        })
    }, []);

    const removeOpenNote = (id: string) => {
        const { openedNotes } = props.openNotes;
        props.dispatch({
            type: 'openNotes/updateOpenNotes',
            payload: openedNotes.filter(item => item.id != id)
        })
        props.dispatch({
            type: 'note/refreshShowNote',
            payload: {text:' '}
        });
    }

    const loading = props.loading.effects["openNotes/queryOpenNote"];
    return (
        <NoteList loading={loading} remove={removeOpenNote} listData={props.openNotes.openedNotes} activeNoteId={props.note.showNote.id}></NoteList>
    );
}
export default connect(({ openNotes, note, loading }: { openNotes: OpenNoteState, note: NoteState, loading }) => (
    { openNotes, note, loading })
)(OpenNotes);
