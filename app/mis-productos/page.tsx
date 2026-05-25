import { ObtenerMisProductos, ObtenerOrdenesAPreparar, ObtenerProductos } from '@/lib/db/db';
import ProductosCliente from './productos';

export default async function Page() {

    const productos = await ObtenerMisProductos("");

    const ordenes = await ObtenerOrdenesAPreparar("");
    const productosOrdenes = await ObtenerProductos(ordenes.map(orden => orden.idProducto));

    return (
        <ProductosCliente productos={productos} ordenes={ordenes} productosOrdenes={productosOrdenes} />
    )
}