"use client";

import { use } from "react";
import { useApi } from "@/lib/utils/useApi";
import { GET } from "@/app/api/search/[q]/route";

type SearchResults = Awaited<ReturnType<typeof GET>>;

export default function Home({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { q } = use(searchParams);

    const { data: { authors, songs, albums } = {} } = useApi<SearchResults>(`/api/search/${q}`);

    if (!q) {
        return <div>No Search query</div>;
    }
    if (songs?.length === 0 && albums?.length === 0 && authors?.length === 0) {
        return <div>No results</div>;
    }
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div>
                    <p>Songs</p>
                    <ul>
                        {songs?.map((song) => (
                            <li key={song.id}>
                                {song.name} - {song.album_name} - {song.author_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p>Albums</p>
                    <ul>
                        {albums?.map((album) => (
                            <li key={album.id}>
                                {album.name} - {album.author_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p>Authors</p>
                    <ul>
                        {authors?.map((author) => (
                            <li key={author.id}>{author.name}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
