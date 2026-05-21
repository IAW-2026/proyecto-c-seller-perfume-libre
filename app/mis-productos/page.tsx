import { ObtenerMisProductos } from '@/lib/db/db';
import ProductosCliente from './productos';

export default async function Page() {

    const productos = await ObtenerMisProductos("");

    return (
        <ProductosCliente productos={productos} />
    )
}