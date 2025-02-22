import { useEffect, useMemo, useState } from 'react';

type ValidatorFn = (value: any) => boolean;

export type FormValidations = {
    [key: string]: [ValidatorFn, string?];
  };

type FormCheckedValues = {
    [key: string]: string | null
  };


export const useForm = <T extends { [key: string]: any }>(
        initialForm: T,
        formValidations: FormValidations // Recibe las validaciones a aplicar
      ) => {

    const [formState, setFormState] = useState<T>(initialForm);
    const [formValidation, setFormValidation] = useState<FormCheckedValues>({});

    // vada vez que haya un cambio en el formulario (formState)
    // se volverá a ejecutar createValidators()
    useEffect(() => {
        createValidators();
      }, [formState]);
  
      // useEffect para refrescar el form si el initialForm cambia
      useEffect(() => {
        setFormState( initialForm );
      }, [initialForm])

    
    const isFormValid = useMemo( () => {

        // Si el formulario es inválido
        for (const formValue of Object.keys( formValidation )) {
            if ( formValidation[formValue] !== null ) return false;
        }

        // Si el formulario es valido
        return true;
        
    }, [ formValidation ]);

    const onInputChange = ({ target }: { target: HTMLInputElement }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        } as T);
        
    };

    const onResetForm = () => {
        setFormState(initialForm);
    };

    const createValidators = () => {
       
        const formCheckedValues: FormCheckedValues = {};

        for (const formField of Object.keys(formValidations)) {
            // Extraemos la función y el mensaje de error, aplicando el tipo adecuado.
            const [ fn, errorMessage = 'Este campo es requerido' ] = formValidations[formField];
            // Aquí se accede a formState con una clave string; formState debe tener una firma de índice.
            formCheckedValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;
          }

        setFormValidation( formCheckedValues );
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        //...formValidation,
        emailValid: formValidation.emailValid,
        passwordValid: formValidation.passwordValid,
        displayNameValid: formValidation.displayNameValid,
        isFormValid
    };
};