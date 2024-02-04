export class Login {
    cedula: string;
    contrasena: string;

    constructor(
        cedula: string = '',
        contrasena: string = '',
    ) {
        this.cedula = cedula;
        this.contrasena = contrasena;
    }
}

export interface Login {
    cedula: string;
    contrasena: string;
}
