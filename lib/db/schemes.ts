export interface Producto {
    id: number;
    stock: number;
    titulo: string;
    precio: number;
    imagen: string;
}

export interface OrdenAPreparar {
    idOrdenAPreparar: number;
    idProducto: number;
    cantidad: number;
}