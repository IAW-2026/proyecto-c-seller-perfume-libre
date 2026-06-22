import { ActionResponse, ObtenerMisProductos, ObtenerSubOrdenes, ObtenerProductos, ObtenerVendedor, ObtenerDomicilio, ObtenerCategoriasDeProductos } from '@/lib/db/db';
import ProductosCliente from './productos-cliente';
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { DomicilioInvalido } from '@/lib/db/schemes'
import './error.css';
import 'next/navigation'

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

    // TOOO: reafactor logica

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId)
        redirect("/sign-in");

    if (!user)
        redirect("/sign-in");

    const vendedorResult = await ObtenerVendedor();

    if (!vendedorResult.success)
        return error(vendedorResult.error!.description);

    const vendedor = vendedorResult.data!;

    const forzarIngresarDireccion = vendedor.domicilio_id === null;

    let domicilio;
    if (forzarIngresarDireccion) {
        domicilio = DomicilioInvalido;
    }
    else {
        const domicilioResult = await ObtenerDomicilio(vendedor.domicilio_id);

        if (!domicilioResult.success)
            return error(domicilioResult.error!.description);

        domicilio = domicilioResult.data!;
    }

    const productosResult = await ObtenerMisProductos();

    if (!productosResult.success)
        return error(productosResult.error!.description);

    const productos = productosResult.data!;

    const productosCategoriasResult = await ObtenerCategoriasDeProductos(productos.map(p => p.producto_id));

    if (!productosCategoriasResult.success)
        return error(productosCategoriasResult.error!.description);

    const productosCategorias = productosCategoriasResult.data!;

    const subOrdenesResult = await ObtenerSubOrdenes();

    if (!subOrdenesResult.success)
        return error(subOrdenesResult.error!.description);

    const subOrdenes = subOrdenesResult.data!;

    const productosOrdenesResult = await ObtenerProductos(subOrdenes.map(subOrden => subOrden.producto_id));

    if (!productosOrdenesResult.success)
        return error(productosOrdenesResult.error!.description);

    const productosOrdenes = productosOrdenesResult.data!;

    return (
        <ProductosCliente productos={productos} ordenes={subOrdenes} productosOrdenes={productosOrdenes} forzarIngresarDireccion={forzarIngresarDireccion} domicilio={domicilio!} productosCategorias={productosCategorias} />
    )
}