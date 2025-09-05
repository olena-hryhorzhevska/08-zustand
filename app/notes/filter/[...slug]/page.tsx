import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesPageClient from "@/app/notes/filter/[...slug]/Notes.client";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const category = slug[0] === 'All' ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, category }],
    queryFn: () => fetchNotes("", 1, 12, category),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesPageClient category={category} />
      </HydrationBoundary>
    </div>
  );
}
