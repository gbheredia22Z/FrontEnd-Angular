export class PerCalificaciones {
    id: string;
    nombrePeriodo: string;
    estado: string;
  
    constructor(id: string = '', nombrePeriodo: string = '', estado: string = '') {
      this.id = id;
      this.nombrePeriodo = nombrePeriodo;
      this.estado = estado;
    }
  }
  