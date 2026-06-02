
interface Props {
    resena: string;
    puntaje: number;
}

export default function CardResenaVendedor({ puntaje, resena }: Props) {
    return (
        <div className="div_resena">
            <p>{`Reseña: ${resena}`}</p>
            <p>{`Puntaje: ${puntaje} / 5`}</p>
        </div>
    )
}