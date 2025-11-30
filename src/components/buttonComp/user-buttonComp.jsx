"use client"

import { useNavigate } from "react-router-dom"
import { Dropdown } from 'react-bootstrap'
import { useAuth } from "@/context/AuthContext"

export function UserButtonComp({ role = "usuario" }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Dropdown align="end">
      <Dropdown.Toggle 
        variant="light" 
        className="border-0 rounded-circle p-2 position-relative overflow-hidden" 
        id="user-menu"
        style={{
          transition: 'all 0.3s ease',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <i className="bi bi-person-fill text-primary" style={{ fontSize: '1.2rem' }}></i>
      </Dropdown.Toggle>
      
      <Dropdown.Menu 
        className="shadow-lg border-0" 
        style={{
          minWidth: '220px',
          borderRadius: '12px',
          padding: '0.5rem 0',
          marginTop: '8px'
        }}
      >
        <div className="px-3 py-2 border-bottom">
          <div className="fw-semibold" style={{ fontSize: '1rem' }}>
            {user?.name || "Usuario"}
          </div>
          <div className="text-muted small" style={{ fontSize: '0.85rem' }}>
            {user?.email || "usuario@dimar.mil.co"}
          </div>
        </div>
        <Dropdown.Item 
          disabled 
          className="text-muted small px-3 py-2"
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-shield-check me-2"></i>
          Rol: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || role.charAt(0).toUpperCase() + role.slice(1)}
        </Dropdown.Item>
        <Dropdown.Divider className="my-1" />
        <Dropdown.Item 
          className="text-danger px-3 py-2 d-flex align-items-center"
          onClick={handleLogout}
          style={{
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Cerrar Sesión
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

