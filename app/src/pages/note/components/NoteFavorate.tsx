import React, { useEffect } from 'react';
import { connect } from 'umi';
import NoteList from './NoteList'


const NoteFavorate: React.FC<{}> = (props) => {

    useEffect(() => {
        props.dispatch({
            type: 'noteFavorite/query',
        })
    }, []);


    const loading = props.loading.effects["noteFavorite/query"];
    return (
        <NoteList loading={loading} listData={props.noteFavorite.notes} activeNoteId={props.note.showNote.id}></NoteList>
    );
}
export default connect(({ noteFavorite, note, loading }: { noteFavorite, note, loading }) => (
    { noteFavorite, note, loading })
)(NoteFavorate);
