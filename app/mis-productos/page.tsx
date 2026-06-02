import { ObtenerMisProductos, ObtenerSubOrdenes, ObtenerProductos, ObtenerVendedor, ObtenerDomicilio, ObtenerCategoriasDeProductos } from '@/lib/db/db';
import ProductosCliente from './productos-cliente';
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

    const subOrdenes = await ObtenerSubOrdenes();
    const productosOrdenes = await ObtenerProductos(subOrdenes.map(subOrden => subOrden.producto_id));

    console.log(subOrdenes);
    console.log(productosOrdenes);

    return (
        <ProductosCliente productos={productos} ordenes={subOrdenes} productosOrdenes={productosOrdenes} forzarIngresarDireccion={forzarIngresarDireccion} domicilio={domicilio!} productosCategorias = {productosCategorias} />
    )
}