'use client';

import css from "./Notes.client.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { useEffect, useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";

interface NotesPageClientProps {
  category: string | undefined;
}

export default function NotesPageClient({category}: NotesPageClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);
  const perPage = 12;


  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", {search: debouncedSearch, page, category}],
    queryFn: () => fetchNotes(debouncedSearch, page, perPage, category),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages || 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClose = (reason: "created" | "canceled") => {
    closeModal();
    if (reason === "created") {
      setPage(1);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} onSearchChange={setSearch} />
        {data && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      <Toaster position="top-center" reverseOrder={true} />
      {isModalOpen && (
        <Modal
          onClose={() => {
            handleClose("canceled");
          }}
        >
          <NoteForm onClose={handleClose} />
        </Modal>
      )}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data?.notes} />}
    </div>
  );
}
