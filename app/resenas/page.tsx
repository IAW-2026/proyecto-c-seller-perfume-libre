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
        { resena: `despacha a tiempo`, puntaje: 5 },
        { resena: `tardo una semana en hacerme el perfume`, puntaje: 3 },
        { resena: `me llego el perfume equivocado`, puntaje: 1 }
    ];

    const resenasProductos = [
        { producto: `Hugo Boss`, resena: `dura poco el perfume, pero esta bueno`, puntaje: 3 },
        { producto: `Milanel Aura Pura`, resena: `no levanto ni una mina con esto`, puntaje: 2 },
        { producto: `Hugo Boss`, resena: `la que me atendio en el super me dijo que buen perfume`, puntaje: 4 }
    ];

    return <Resenas resenasProductos={resenasProductos} resenasVendedor={resenasVendedor}/>
}