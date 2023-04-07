import { encryption, decrypt } from '@/utils/utils';
import { NoteItem } from './data'

/**
 * 
 * @param note 加密
 * @returns 
 */
export const encryptionNote = (note: NoteItem) => {
    const result = { ...note };
    result.name = encryption(note.name);
    result.text = encryption(note.text);
    result.parents = encryption(note.parents);
    return result;
}

/**
 * 
 * @param note 解密
 * @returns 
 */
export const decryptNote = (note: NoteItem) => {
    const result = { ...note };
    result.name = decrypt(note.name);
    result.text = decrypt(note.text);
    result.parents = decrypt(note.parents);
    return result;
}

export const changeUrl = (props, name, value, query=null) => {
    const { type, id } = props.match.params;


    let url = "/page/note";
    if (name == "type") {
        url += "/" + value;
        if (id) {
            url += "/" + id;
        }
    } else {
        url += "/" + type + "/" + value;
    }

    props.history.push({
        pathname: url,
        query: query || props.location.query,
    })

}