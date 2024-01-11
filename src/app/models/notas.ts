export class Notas {
  id: string;
  personaId: number;
  actId: number;
  valor_nota: number;
  persona: {
    nombre: string;
    apellido: string;
  };
  actividades: {
    titulo: string;
    detalleActividad: string;
    asignatura: {
      id: number;
      nombreMateria: string;
    };
  };

  constructor(
    id: string = '',
    personaId: number = 0,
    actId: number = 0,
    valor_nota: number = 0,
    persona: { nombre: string; apellido: string } = { nombre: '', apellido: '' },
    actividades: {
      titulo: string;
      detalleActividad: string;
      asignatura: {
        id: number;
        nombreMateria: string;
      };
    } = { titulo: '', detalleActividad: '', asignatura: { id: 0, nombreMateria: '' } }
  ) {
    this.id = id;
    this.personaId = personaId;
    this.actId = actId;
    this.valor_nota = valor_nota;
    this.persona = persona;
    this.actividades = actividades;
    
  }
}
