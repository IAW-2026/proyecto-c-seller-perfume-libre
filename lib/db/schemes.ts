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