import { ActionResponse, ObtenerMisProductos, ObtenerSubOrdenes, ObtenerProductos, ObtenerVendedor, ObtenerDomicilio, ObtenerCategoriasDeProductos, ObtenerProductosPorOrden } from '@/lib/db/db';
import ProductosCliente from './productos-cliente';
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { DomicilioInvalido, Producto } from '@/lib/db/schemes'
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

    const productosResult = await ObtenerMisProductos(1, 4);

    if (!productosResult.success)
        return error(productosResult.error!.description);

    const productos = productosResult.data!.productos;

    const productosCategoriasResult = await ObtenerCategoriasDeProductos(productos.map(p => p.producto_id));

    if (!productosCategoriasResult.success)
        return error(productosCategoriasResult.error!.description);

    const productosCategorias = productosCategoriasResult.data!;

    const productosPorOrdenResult = await ObtenerProductosPorOrden();

    if (!productosPorOrdenResult.success) {
        return error(productosPorOrdenResult.error!.description);
    }

    const productosPorOrden = productosPorOrdenResult.data!;

    return (
        <ProductosCliente
            productosIniciales={productos}
            forzarIngresarDireccion={forzarIngresarDireccion}
            domicilio={domicilio!}
            productosCategoriasIniciales={productosCategorias}
            productosPorOrden={productosPorOrden}
            cantidadPorPaginaInicial={productosResult.data!.pagination.limit}
            totalPages={productosResult.data!.pagination.totalPages }
        />
    )
}