import { ObtenerMisProductos } from '@/lib/db/db';
import CardProducto from './card-producto';

export default async function Page() {

    const productos = await ObtenerMisProductos("");

    return (
        <div className="productosGrid">
            {productos.map((producto, index) => (
                <CardProducto
                    key={index}
                    producto={producto}
                />
            ))}
        </div>
    )
}