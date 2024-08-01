import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { AppRouter } from '../../src/router/AppRouter';



jest.mock('../../src/hooks/useAuthStore');

describe('Pruebas en AppRouter', () => {

    const mockcheckAuthToken = jest.fn();
    beforeEach( () => jest.clearAllMocks() );
    
    test('debe mostrar la pantalla de carga y llamar checkAuthToken', () => {
        
        
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockcheckAuthToken
        });

        render( <AppRouter/> );
        expect( screen.getByText('Ingresando...') ).toBeTruthy();
        expect( mockcheckAuthToken ).toHaveBeenCalled();

    });
    

})
