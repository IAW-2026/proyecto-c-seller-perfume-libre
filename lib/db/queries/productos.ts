import 'server-only'

import { setTimeout } from 'timers/promises';  
import { Producto } from '../schemes';
import { sql } from './connect'

const productos: Producto[] = [
    {
        id: 0,
        stock: 10,
        titulo: "Aqua Di La Cotorre",
        precio: 25000.35,
        imagen: "/1.png"
    },
    {
        id: 1,
        stock: 5,
        titulo: "Milanel Aura Pura",
        precio: 15000.1,
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

// delay para mostrar el skeleton 
export async function ObtenerMisProductosQuery(userId: string): Promise<Producto[]> {
    await setTimeout(2000);
    return productos;
} 

export function EditarProductoQuery(id: number, titulo: string, precio: number, agregarStock: number) { 
    productos[id].titulo = titulo;
    productos[id].precio = precio;
    productos[id].stock += agregarStock;
}

export function PublicarProductoQuery(titulo: string, precio: number, stock: number, imagen: string) {
    const nuevoProducto = { titulo: titulo, precio: precio, stock: stock, imagen: imagen, id: productos.length };
    productos.push(nuevoProducto);
}