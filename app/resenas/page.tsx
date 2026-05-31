import Resenas from './resenas';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId)
        redirect("/sign-in");

    if (!user)
        redirect("/sign-in");

    //TODO: fetch de feedback

    const resenasVendedor = [
        { resena: `${crypto.randomUUID()}${crypto.randomUUID()}`, puntaje: 5 },
        { resena: `${crypto.randomUUID()}`, puntaje: 3 },
        { resena: `${crypto.randomUUID()}`, puntaje: 1 },
        { resena: `${crypto.randomUUID()}`, puntaje: 2 },
        { resena: `${crypto.randomUUID()}`, puntaje: 5 }
    ];

    const resenasProductos = [
        { producto: `${crypto.randomUUID()}${crypto.randomUUID()}`, resena: `${crypto.randomUUID()}`, puntaje: 3 },
        { producto: `${crypto.randomUUID()}`, resena: `${crypto.randomUUID()}`, puntaje: 2 },
        { producto: `${crypto.randomUUID()}`, resena: `${crypto.randomUUID()}`, puntaje: 1 },
        { producto: `${crypto.randomUUID()}`, resena: `${crypto.randomUUID()}`, puntaje: 4 },
        { producto: `${crypto.randomUUID()}`, resena: `${crypto.randomUUID()}`, puntaje: 5 }
    ];

    return <Resenas resenasProductos={resenasProductos} resenasVendedor={resenasVendedor}/>
}