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

export interface Categoria {
    categoria_id: number;
    producto_id: number;
    nombre: string;
}

export type EstadoSubOrden = "en_preparacion" | "preparado" | "retirado";
export interface SubOrden {
    suborden_id: number;
    vendedor_id: string;
    producto_id: number;
    tracking_id: number;
    orden_id: number;
    cantidad: number;
    precio: number;
    estado: EstadoSubOrden;
}