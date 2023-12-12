export class Periodo {
    id: string;
    anioLecivo: string;
    estado: string;


    constructor(
        id: string = '',
        anioLectivo: string = '',
        estado: string = ''
    ) {
        this.id = id;
        this.anioLecivo = anioLectivo;
        this.estado = estado;

    }
}

export interface Periodo {
    id: string;
    anioLectivo: string;
    estado: string;
}
