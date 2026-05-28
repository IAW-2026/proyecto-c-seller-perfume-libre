import 'server-only'

import { OrdenAPreparar } from '../schemes';

const ordenes: OrdenAPreparar[] = [
    {
        idOrdenAPreparar: 0,
        idProducto: 0,
        cantidad: 2
    },
    {
        idOrdenAPreparar: 1,
        idProducto: 1,
        cantidad: 1
    },
    {
        idOrdenAPreparar: 2,
        idProducto: 2,
        cantidad: 4
    },
    {
        idOrdenAPreparar: 3,
        idProducto: 3,
        cantidad: 2
    },
    {
        idOrdenAPreparar: 4,
        idProducto: 4,
        cantidad: 5
    },
    {
        idOrdenAPreparar: 5,
        idProducto: 5,
        cantidad: 1
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