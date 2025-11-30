import { Link, useLocation } from "react-router-dom"
import { Navbar, Container } from 'react-bootstrap'
import { UserButtonComp } from "@/components/buttonComp/user-buttonComp"
import { useAuth } from "@/context/AuthContext"



// Cambiamos la función para hacerla exportación por defecto
function MainNavBarComp({ }) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()


  console.log('MainNavBarComp - Debug:', {
    isAuthenticated,
    user
  })


  return (
    <Navbar style={{ backgroundColor: 'var(--primary)' }} className="shadow-sm sticky-top">
      <Container>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
          
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
              <img 
                src="/escudo.avif" 
                alt="DIMAR Escudo" 
                height="60" 
                className="d-inline-block"
              />
              <img 
                src="/letras.avif" 
                alt="DIMAR Letras" 
                height="60" 
                className="d-inline-block"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Navbar.Brand>
          </div>
          <div className="d-flex align-items-center" style={{ gap: '20px' }}>
            {isAuthenticated && <UserButtonComp role={user?.id_role} />}
          </div>
        </div>
      </Container>
    </Navbar>
  )
}

// Esta es la exportación por defecto que necesita lazy()
export default MainNavBarComp;

// También podemos mantener la exportación con nombre para compatibilidad con código existente
export { MainNavBarComp };
