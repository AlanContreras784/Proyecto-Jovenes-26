import Swal from "sweetalert2";

export function dispararSweetAlertBasico(title, text, icon, textBoton){
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showConfirmButton:true,
        showCancelButton:false,
        confirmButtonText: textBoton
        });
}

export  async function dispararSweetAlertTrueFalse(title, text, icon, textBoton) {

    const result= await Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor : '#3085d6', // azul por defecto
        cancelButtonColor :'#d33' ,   // rojo por defecto
        showConfirmButton: true,
        showCancelButton: true, // muestra botón cancelar
        confirmButtonText: textBoton,
        cancelButtonText: "Cancelar",
        allowOutsideClick: true, // permite cerrar haciendo clic afuera
        allowEscapeKey: true     // permite cerrar con Escape
    })
    return result.isConfirmed === true;

}

