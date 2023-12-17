export class Grado {
    id: string;
    nombreGrado: string;
    persId: string;


    constructor(
        id: string = '',
        nombreGrado: string = '',
        persId: string = ''
    ) {
        this.id = id;
        this.nombreGrado = nombreGrado;
        this.persId = persId;

    }
}

export interface Periodo {
    id: string;
    nombreGrado: string;
    persId: string;
}
