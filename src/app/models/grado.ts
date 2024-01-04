export class Grado {
    id: string;
    nombreGrado: string;
    persId: string;
    persona: {
        nombre: string;
        apellido: string;
      };


    constructor(
        id: string = '',
        nombreGrado: string = '',
       
        persona: { nombre: string; apellido: string } = { nombre: '', apellido: '' }
    ) {
        this.id = id;
        this.nombreGrado = nombreGrado;
        
        this.persona = persona;

    }
}

export interface Periodo {
    id: string;
    nombreGrado: string;
    persId: string;
}
