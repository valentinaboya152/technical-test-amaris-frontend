"use client"

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Offcanvas, Nav } from 'react-bootstrap'
import { useAuth } from "@/context/AuthContext"
import {
  Menu,
  FlaskConical,
  TestTube,
  Beaker,
  IdCard,
  Network,
  Shield
} from 'lucide-react'

export function AdminSidebarComp() {
  const [show, setShow] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    console.log('AdminSidebar - Debug:', {
      show,
      location: location.pathname
    })
  }, [show, location])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const getMenuItems = (user) => {
    if (!user) {
      console.error('No se encontró al usuario autenticado');
      return [];
    }
    console.log('User object:', user);
    const userRole = user.id_role?.toLowerCase();
    const userArea = user.area?.toLowerCase();

    console.log('User role:', userRole);
    console.log('User area:', userArea);

    const menuItems = {
      personal: {
        path: '/admin/personal',
        label: 'Sección Personal',
        icon: <IdCard size={20} className="me-2" />
      },
      sitec: {
        path: '/admin/sitec',
        label: 'Sección Sitec',
        icon: <Network size={20} className="me-2" />
      },
      quimica: {
        path: '/siscipa/laboratorio-quimica-general',
        label: 'Sección Laboratorio Química',
        icon: <FlaskConical size={20} className="me-2" />
      },
      biologia: {
        path: '/siscipa/laboratorio-biologia-general',
        label: 'Sección Laboratorio Biología',
        icon: <TestTube size={20} className="me-2" />
      },
      microbiologia: {
        path: '/siscipa/laboratorio-microbiologia-general',
        label: 'Sección Laboratorio Microbiología',
        icon: <Beaker size={20} className="me-2" />
      },
      seguridad: {
        path: '/siscipa/vigilantes',
        label: 'Sección Seguridad',
        icon: <Shield size={20} className="me-2" />
      }
    };

    if (userRole === 'administrador') {
      if (userArea === 'sistema') {
        return Object.values(menuItems);
      }
      if (userArea === 'personal') {
        return [menuItems.personal];
      }
      if (['química', 'biología', 'microbiología'].includes(userArea)) {
        return [
          menuItems.quimica,
          menuItems.biologia,
          menuItems.microbiologia
        ];
      }
      if (userArea === 'seguridad') {
        return [
          menuItems.seguridad,
          menuItems.personal
        ];
      }
    }
    
    if (userRole === 'usuario') {
      if (userArea === 'química') return [menuItems.quimica];
      if (userArea === 'biología') return [menuItems.biologia];
      if (userArea === 'microbiología') return [menuItems.microbiologia];
      if (userArea === 'seguridad') return [menuItems.seguridad];
    }
    
    if (userRole === 'superusuario') {
      return Object.values(menuItems);
    }
    
    return [];
  };

  const menuItems = getMenuItems(user);

  return (
    <>
      <button 
        className="btn btn-link p-2 me-3" 
        onClick={handleShow}
        aria-label="Abrir menú"
        style={{ width: '40px', height: '40px', color: 'white' }}
      >
        <Menu size={20} />
      </button>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton style={{ backgroundColor: 'var(--primary)' }}>
          <Offcanvas.Title className="fs-5 fw-bold text-white">Panel de Administración</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column">
            {menuItems.map((item, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                className={`d-flex align-items-center py-3 px-3 ${
                  location.pathname === item.path ? 'active bg-light' : ''
                }`}
                onClick={handleClose}
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}