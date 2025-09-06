import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { Metadata } from "next";
import NotesPageClient from "@/app/notes/filter/[...slug]/Notes.client";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0] === "All" ? "All Notes" : slug[0];
  return {
    title: category,
    description: `Browse notes in the ${category} category.`,
    openGraph: {
      title: category,
      description: `Browse notes in the ${category} category.`,
      url: `https://08-zustand-liard.vercel.app/notes/filter/${slug}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: category,
        },
      ],
      type: "website",
    },
  };
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
