import { ObtenerMisProductos, ObtenerOrdenesAPreparar, ObtenerProductos, ObtenerVendedor, ObtenerDomicilio, ObtenerCategoriasDeProductos } from '@/lib/db/db';
import ProductosCliente from './productos';
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { DomicilioInvalido } from '@/lib/db/schemes'

export default async function Page() {

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId)
        redirect("/sign-in");

    if (!user)
        redirect("/sign-in");

    const vendedor = await ObtenerVendedor();

    const forzarIngresarDireccion = vendedor.domicilio_id === null;

    let domicilio;
    if (forzarIngresarDireccion) {
        domicilio = DomicilioInvalido;
    }
    else {
        domicilio = await ObtenerDomicilio(vendedor.domicilio_id);
    }

    const productos = await ObtenerMisProductos();
    const productosCategorias = await ObtenerCategoriasDeProductos(productos.map(p => p.producto_id));

    const ordenes = await ObtenerOrdenesAPreparar("");
    const productosOrdenes = await ObtenerProductos(ordenes.map(orden => orden.idProducto));

    return (
        <ProductosCliente productos={productos} ordenes={ordenes} productosOrdenes={productosOrdenes} forzarIngresarDireccion={forzarIngresarDireccion} domicilio={domicilio!} productosCategorias = {productosCategorias} />
    )
}