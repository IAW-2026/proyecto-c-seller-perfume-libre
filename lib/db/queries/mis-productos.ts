import { sql } from './connect'; 

const productos: Producto[] = [
    {
        id: 0,
        stock: 10,
        titulo: "Aqua Di La Cotorre",
        precio: 25000,
        imagen: "/1.png"
    },
    {
        id: 1,
        stock: 5,
        titulo: "Milanel Aura Pura",
        precio: 15000,
        imagen: "/2.png"
    },
    {
        id: 2,
        stock: 2,
        titulo: "Lattaffa Yara Moi",
        precio: 120000,
        imagen: "/3.png"
    },
    {
        id: 3,
        stock: 10,
        titulo: "Aqua Di La Cotorre",
        precio: 25000,
        imagen: "/1.png"
    },
    {
        id: 4,
        stock: 5,
        titulo: "Milanel Aura Pura",
        precio: 15000,
        imagen: "/2.png"
    },
    {
        id: 5,
        stock: 2,
        titulo: "Lattaffa Yara Moi",
        precio: 120000,
        imagen: "/3.png"
    }

];

export interface Producto {
    id: number;
    stock: number;
    titulo: string;
    precio: number;
    imagen: string;
}

// delay para mostrar el skeleton
import { setTimeout } from 'timers/promises';   
export async function ObtenerMisProductos(userId: string): Promise<Producto[]> {
    await setTimeout(2000);
    return productos;
}