export class Grado {
    id: string;
    nombreGrado: string;
    persId: string;
    persona: {
        id:string;
        nombre: string;
        apellido: string;
      };


    constructor(
        id: string = '',
        nombreGrado: string = '',
       
        persona: { id: string; nombre: string; apellido: string } = { id: '', nombre: '', apellido: '' }
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
