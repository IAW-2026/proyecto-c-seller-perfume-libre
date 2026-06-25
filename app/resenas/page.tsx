import Resenas from './resenas';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ObtenerMisProductos, ObtenerMisProductosIds, ObtenerResenasProducto, ObtenerResenasVendedor, ObtenerTodosMisProductos } from '../../lib/db/actions';
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

    const resultVendedor = await ObtenerResenasVendedor(1);

    if (!resultVendedor.success)
        return error("Error al obtener informacion");

    const resenasVendedor = resultVendedor.data!;

    const result = await ObtenerTodosMisProductos();

    if (!result.success)
        return error("Error al obtener informacion");

    const productos = result.data!;

    return <Resenas
        puntajePromedioVendedor={resenasVendedor.promedio}
        resenasVendedorInicial={resenasVendedor.resenas}
        totalPagesVendedor={resenasVendedor.pagination.totalPages}
        productos={productos}
    />
}