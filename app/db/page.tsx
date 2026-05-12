import { getComments, putComment } from '@/lib/db/queries/test';
import { revalidatePath } from 'next/cache';

async function uploadComment(data: FormData)
{
    'use server';

    await putComment(data.get("comment") as string);

    revalidatePath("/db");
}

export default async function Page()
{
    const comments = await getComments();

    console.log(comments, Array.isArray(comments));

    return (
        <main>
            <form action={uploadComment} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    name="comment"
                    placeholder="Escribe un comentario..."
                    required
                />
                <button> Agregar </button>
            </form>
            {comments.map((item) => (
                <h1 key={item.comment}>{item.comment}</h1>
            ))}
        </main>
    );
}