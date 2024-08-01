import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../../src/store';
import { initialState, notAuthenticatedState } from '../fixtures/authState';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { Provider } from 'react-redux';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';




const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer

        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}



describe('Pruebas en useAuthStore', () => {

    beforeEach( () => localStorage.clear() );
    
    test('debe regresar los valores por defecto', () => {
        
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );
        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any( Function ),   
            startLogin: expect.any( Function ),  
            startLogout: expect.any( Function ),  
            startRegister: expect.any( Function ),  
        })

    });

    test('startLogin debe realizar el login correctamente', async() => {
        
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );
        
        await act( async() => {
            await result.current.startLogin( testUserCredentials );
        } );

        const { errorMessage, status, user } = result.current;
        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {  name: 'Test User', uid: '66a9813947f1b0b0d8789d41' } 
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );

    });

    test('El startLogin debe fallar en la autenticacion', async() => {
        
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );
        
        await act( async() => {
            await result.current.startLogin( { email: 'algo@ggogle.com', password: '789456' } );
        } );

        const { errorMessage, status, user } = result.current;
        expect( localStorage.getItem('token') ).toBe(null);
        expect( localStorage.getItem( 'token-init-date' ) ).toBe(null)
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        );
        

    });

    test('startRegister debe crear un usuario', async() => {

        const newUser = { email: 'algo@ggogle.com', password: '789456', name: 'Algo' }
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "66a9813947f1b0b0d8789d41",
                name: "Test User",
                token: "Algun-TOKEN"
            }
        });
        
        await act( async() => {
            await result.current.startRegister( newUser );
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '66a9813947f1b0b0d8789d41' }
        });

        spy.mockRestore();

    });

    test('El startRegister debe fallar en la creacion', async() => {
        
        
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        
        
        await act( async() => {
            await result.current.startRegister( testUserCredentials );
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Ese correo ya se encuentra registrado',
            status: 'not-authenticated',
            user: {}
        })

        

    });

    test('checkAuthToken debe de fallar si no hay token', async() => {
        
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        
        await act( async() => {
            await result.current.checkAuthToken();
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })

    });

    test('checkAuthToken debe autenticar el usuario si hay un token', async() => {
        
        const { data } = await calendarApi.post( '/auth', testUserCredentials );
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        
        await act( async() => {
             await result.current.checkAuthToken();
         } );
        

        const { errorMessage, status, user } = result.current;
        //console.log({ errorMessage, status, user })
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: undefined, uid: undefined }
        })
        

    });
    
    
    
    
    
    
    

})
