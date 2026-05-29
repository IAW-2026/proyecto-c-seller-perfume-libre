import 'server-only'

import { OrdenAPreparar } from '../schemes';

const ordenes: OrdenAPreparar[] = [
    {
        idOrdenAPreparar: 0,
        idProducto: 4,
        cantidad: 2
    },
    {
        idOrdenAPreparar: 1,
        idProducto: 5,
        cantidad: 1
    },
    {
        idOrdenAPreparar: 2,
        idProducto: 6,
        cantidad: 5
    }
];

export async function ObtenerOrdenesAPrepararQuery(userId: string) : Promise<OrdenAPreparar[]> {
    return ordenes;
}

export async function OrdenAPrepararHechaQuery(ordenAPrepararId: number) {
    ordenes.splice(ordenAPrepararId, 1);

    for (let i = 0; i < ordenes.length; i++) {
        ordenes[i].idOrdenAPreparar = i;
    }
}