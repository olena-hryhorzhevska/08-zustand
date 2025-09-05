"use client";
import { useId } from "react";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createNote } from "@/lib/api";
import toast from "react-hot-toast";
import { NoteFormValues, Note, NoteTag, noteTags } from "../../types/note";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string().max(
    500,
    "Content is too long. Allowed 500 characters only"
  ),
  tag: Yup.mixed<NoteTag>()
    .oneOf(noteTags, "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const createNoteMutation = useMutation<Note, Error, NoteFormValues>({
    mutationFn: (newNote) => createNote(newNote),
    onSuccess: () => {
      clearDraft();
      router.push("/notes/filter/All");
      toast.success("Note created successfully");
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`${msg}`);
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    })
  }

  const handleCancel = () => {
    router.push("/notes/filter/All");
  };

  const handleSubmit = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as NoteFormValues;
    try {
      await OrderFormSchema.validate(values, { abortEarly: false });
      setErrors({});
      createNoteMutation.mutate(values);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const fieldId = useId();

  return (
    <form className={css.form} action={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating note..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
