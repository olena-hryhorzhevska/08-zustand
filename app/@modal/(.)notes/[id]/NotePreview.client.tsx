'use client';

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.client.module.css";

const NotePreviewClient = ({ noteId }: { noteId: string }) => {
  
    const { data, isLoading, error } = useQuery({
      queryKey: ["note", noteId],
      queryFn: () => fetchNoteById(noteId),
      refetchOnMount: false,
    });
  
  const router = useRouter();
  return (
    <Modal onClose={() => router.back()}>
      <div>
        {isLoading && <p>Loading, please wait...</p>}
        {error && !data && <p>Something went wrong.</p>}
        {data && (
          <>
            <button
              className={css.backBtn}
              type="button"
              onClick={() => {
                router.back();
              }}
            >
              Go Back
            </button>
            <div className={css.container}>
              <div className={css.item}>
                <div className={css.header}>
                  <h2>{data.title}</h2>
                </div>
                <p className={css.content}>{data.content}</p>
                <div className={css.wrapper}>
                  <p className={css.date}>{data.createdAt}</p>
                  <p className={css.tag}>{data.tag}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
