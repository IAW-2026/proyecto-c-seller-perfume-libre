export type EstadoProducto = "activo" | "pausado" | "borrado";
export interface Producto {
    producto_id: number;
    vendedor_id: string;
    titulo: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: EstadoProducto;
    imagen: string;
}

export interface OrdenAPreparar {
    idOrdenAPreparar: number;
    idProducto: number;
    cantidad: number;
}

export interface Domicilio {
    domicilio_id: number;
    calle: string;
    ciudad: string;
    provincia: string;
    codigo_postal: number;
}
export const DomicilioInvalido : Domicilio = {
    domicilio_id: -1,
    calle: "",
    ciudad: "",
    provincia: "",
    codigo_postal: -1
};

export interface Vendedor {
    clerk_id: string;
    domicilio_id: number;
    nombre: string;
    apellido: string;
} 