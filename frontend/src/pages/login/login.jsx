import { useState } from 'react'
import './login.css'
import fondologin from '../../assets/img/fondo.png'

const countryOptions = [
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', dial: '+53', flag: '🇨🇺' },
  { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻' },
  { code: 'ES', name: 'España', dial: '+34', flag: '🇪🇸' },
  { code: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸' },
  { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳' },
  { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua', dial: '+505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá', dial: '+507', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪' },
  { code: 'PR', name: 'Puerto Rico', dial: '+1', flag: '🇵🇷' },
  { code: 'DO', name: 'República Dominicana', dial: '+1', flag: '🇩🇴' },
  { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪' },
  { code: 'DE', name: 'Alemania', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'Francia', dial: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧' },
  { code: 'IE', name: 'Irlanda', dial: '+353', flag: '🇮🇪' },
  { code: 'NL', name: 'Países Bajos', dial: '+31', flag: '🇳🇱' },
  { code: 'CH', name: 'Suiza', dial: '+41', flag: '🇨🇭' },
  { code: 'SE', name: 'Suecia', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Dinamarca', dial: '+45', flag: '🇩🇰' },
  { code: 'BE', name: 'Bélgica', dial: '+32', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', dial: '+43', flag: '🇦🇹' },
  { code: 'CA', name: 'Canadá', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'JP', name: 'Japón', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', dial: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'SG', name: 'Singapur', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malasia', dial: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Filipinas', dial: '+63', flag: '🇵🇭' },
  { code: 'TH', name: 'Tailandia', dial: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'ZA', name: 'Sudáfrica', dial: '+27', flag: '🇿🇦' },
  { code: 'KE', name: 'Kenia', dial: '+254', flag: '🇰🇪' },
  { code: 'EG', name: 'Egipto', dial: '+20', flag: '🇪🇬' },
  { code: 'MA', name: 'Marruecos', dial: '+212', flag: '🇲🇦' },
  { code: 'TR', name: 'Turquía', dial: '+90', flag: '🇹🇷' },
  { code: 'AE', name: 'Emiratos Árabes', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabia Saudita', dial: '+966', flag: '🇸🇦' },
]

export default function Login() {
  const [activeSection, setActiveSection] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ nombre: '', apellido: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(countryOptions.find((country) => country.code === 'CO') || countryOptions[0])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const user = await response.json()
      if (!user || !user.email) {
        throw new Error('Usuario no encontrado')
      }

      localStorage.setItem('user', JSON.stringify(user))
    setMessage('Inicio de sesión correcto')

    if (user.rol === 'ADMIN' || user.rol === 'PROFESOR') {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/salas'
    }
    } catch (error) {
      setMessage(error.message || 'No se pudo iniciar sesión')
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerData,
          rol: 'ESTUDIANTE',
          activo: true,
        }),
      })

      if (!response.ok) {
        throw new Error('No se pudo registrar')
      }

      setMessage('Usuario registrado correctamente')
      setActiveSection('login')
      setRegisterData({ nombre: '', apellido: '', email: '', password: '' })
    } catch (error) {
      setMessage(error.message || 'No se pudo registrar')
    }
  }

  const handleRecover = (e) => {
    e.preventDefault()
    setMessage('Correo de recuperación enviado')
    setActiveSection('login')
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-panel">
          <div className="login-panel-header">
            <div className="login-flag" />
            <div>
              <div className="login-title">LOGIN STUDYBEST</div>
              <div className="login-subtitle-text">TU LOGIN ESTA AQUÍ</div>
            </div>
          </div>

          {activeSection === 'login' && (
            <div className="login-section">
              <h1>bienvenidos</h1>
              <p className="login-copy">Gracias por iniciar sesión en tu cuenta:</p>
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <div className="login-form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu-nombre@ejemplo.com"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>

                <div className="login-form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="************"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>

                <div className="login-actions-row">
                  <label className="login-remember">
                    <input type="checkbox" /> Recuérdame
                  </label>
                  <button type="button" className="login-link-button" onClick={() => setActiveSection('recover')}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="login-form-group">
                  <label>NÚMERO DE CELULAR</label>
                  <div className="login-phone-row">
                    <select
                      className="login-country-code"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const nextCountry = countryOptions.find((country) => country.code === e.target.value)
                        if (nextCountry) {
                          setSelectedCountry(nextCountry)
                        }
                      }}
                      aria-label="Seleccionar país"
                    >
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name} ({country.dial})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="300 123 4567"
                      className="login-phone-input"
                      required
                    />
                  </div>
                </div>

                <div className="login-button-row">
                  <button type="submit" className="login-btn-primary">ENTRAR</button>
                  <button type="button" className="login-btn-secondary" onClick={() => setActiveSection('register')}>
                    REGISTRARSE
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'register' && (
            <div className="login-section">
              <h1>crear cuenta</h1>
              <p className="login-copy">Únete a nosotros completando tus datos:</p>
              <form className="login-form" onSubmit={handleRegisterSubmit}>
                <div className="login-form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Escribe tu nombre"
                    required
                    value={registerData.nombre}
                    onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                  />
                </div>
                <div className="login-form-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Escribe tu apellido"
                    required
                    value={registerData.apellido}
                    onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
                  />
                </div>
                <div className="login-form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu-email@ejemplo.com"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </div>
                <div className="login-form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Crea una clave"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
                <div className="login-button-row">
                  <button type="submit" className="login-btn-primary">REGISTRAR</button>
                  <button type="button" className="login-btn-secondary" onClick={() => setActiveSection('login')}>
                    VOLVER
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'recover' && (
            <div className="login-section">
              <h1>recuperar contraseña</h1>
              <p className="login-copy">Ingresa tu correo para recuperar tu cuenta:</p>
              <form className="login-form" onSubmit={handleRecover}>
                <div className="login-form-group">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="tu-email@ejemplo.com" required />
                </div>
                <div className="login-button-row">
                  <button type="submit" className="login-btn-primary">ENVIAR</button>
                  <button type="button" className="login-btn-secondary" onClick={() => setActiveSection('login')}>
                    VOLVER
                  </button>
                </div>
              </form>
            </div>
          )}

          {message && <p className="login-message">{message}</p>}
        </div>

        <div
          className="login-panel-image"
          style={{
            backgroundImage: `url(${fondologin})`,
          }}
        >
          <div className="login-image-badge">THE LOGIN STUDYBEST</div>
        </div>
      </div>
    </div>
  )
}
