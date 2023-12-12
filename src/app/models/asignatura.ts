export class Asignatura {
    id: string;
    nombreMateria: string;
    estado: string;
   
    constructor(
        id: string = '',
        nombreMateria: string = '',
        estado: string = ''
    ) {
        this.id = id;
        this.nombreMateria = nombreMateria;
        this.estado = estado
    }
}

export interface Asignatura {
    id: string;
    nombreMateria: string;
    estado: string;
}
