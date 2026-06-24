import Resenas from './resenas';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ObtenerMisProductosIds, ObtenerResenasProductos } from '../../lib/db/actions';
function error(error: string) {
    return (
        <div className="errorDivFondo">

            <div className="errorDivPrincipal">

                <p>Ocurrió el siguiente error</p>
                <b>{error}</b>

            </div>

        </div>
    );
}

export default async function Page() {

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId)
        redirect("/sign-in");

    if (!user)
        redirect("/sign-in");

    const result = await ObtenerResenasProductos();

    if (!result.success)
        return error("Error al obtener informacion");

    const resenas = result.data!;

    return <Resenas resenas={resenas} />
}