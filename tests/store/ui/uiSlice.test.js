import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice";



describe('pruebas en uiSlice', () => {

    test('debe regresar el estado por defecto', () => {
        
        expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false });
        // En caso de que se agreguen mas propiedades al initialState, se debe actualizar la prueba.
    });

    test('debe cambiar el isDateModalOpen correctamente', () => {

        let state = uiSlice.getInitialState();
        state = uiSlice.reducer( state, onOpenDateModal() );
        expect(state.isDateModalOpen).toBeTruthy();
        
        state = uiSlice.reducer( state, onCloseDateModal() );
        expect(state.isDateModalOpen).toBeFalsy();

    })
    
    


})
