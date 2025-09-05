import axios from "axios";
import { Note, NoteFormValues } from "../types/note";
const myToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  name: string,
  page: number,
  perPage: number,
  tag?: string
): Promise<FetchNotesResponse> => {
  const url = `https://notehub-public.goit.study/api/notes`;
  const param = {
    headers: {
      Authorization: `Bearer ${myToken}`,
    },
      params: {
        search: name,
        page,
        perPage,
        tag: tag?.trim() || undefined
    },
  };
  const response = await axios.get<FetchNotesResponse>(url, param);
  return response.data;
};

export const createNote = async (note: NoteFormValues): Promise<Note> => {
  const url = `https://notehub-public.goit.study/api/notes`;
  const { data } = await axios.post<Note>(url, note, {
    headers: {
      Authorization: `Bearer ${myToken}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const url = `https://notehub-public.goit.study/api/notes/${id}`;
  const { data } = await axios.delete<Note>(url, {
    headers: {
      Authorization: `Bearer ${myToken}`,
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const url = `https://notehub-public.goit.study/api/notes/${id}`;
  const { data } = await axios.get<Note>(url, {
    headers: {
      Authorization: `Bearer ${myToken}`,
    },
  });
  return data;
};
