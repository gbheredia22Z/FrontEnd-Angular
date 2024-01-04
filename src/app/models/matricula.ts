export class Matricula {

    id:string;
    estado:string;
    idPersona:string;
    idPeriodo:string;
    idGrado:string;
    persona:{
        nombre:string;
        apellido:string;

    };
    periodo:{
        anioLectivo:string;
    };
    grado:{
        nombreGrado:string;
    }

    constructor(
        id: string = '',
        estado: string= '',
        idPersona: string= '',
        idPeriodo: string= '',
        idGrado: string= '',
        persona: { nombre: string,apellido:string;}={ nombre: '',apellido:''},
        periodo: { anioLectivo: string }={ anioLectivo: ''},
        grado: { nombreGrado: string }={ nombreGrado: ''}
    ) {
        this.id = id;
        this.estado = estado;
        this.idPersona = idPersona;
        this.idPeriodo = idPeriodo;
        this.idGrado = idGrado;
        this.persona = persona;
        this.periodo = periodo;
        this.grado = grado;
    }

    
}
export interface Matricula {
    id: string;
    estado: string;
    idPersona: string;
    idPeriodo: string;
    idGrado: string;
    persona: {
        nombre: string;
        apellido: string;
    };
    periodo: {
        anioLectivo: string;
    };
    grado: {
        nombreGrado: string;
    };
}

