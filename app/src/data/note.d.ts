import { ReactElement } from "react";

export interface NoteItem {
  id?: string;
  name?: string;
  text?: string;
  tag?: string;
  source?: string;
  parentId?: string;
  parentIds?: string;
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
  updateBy?: string;
  isLeaf?: boolean;
}

export interface NoteNode {
  key: string;
  parentIds: string;
  title: string | ReactElement;
  name: string;
  parentId: string;
  children: NoteNode[];
}

export interface NoteListParams {
  parentId: string;
}

export interface NoteHistory {
  id?: string;
  noteId?: string;
  title?: string;
  text?: string;
  createTime?: Date;
  createBy?: string;
}