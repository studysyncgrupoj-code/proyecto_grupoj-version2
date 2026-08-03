import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "ESTUDIANTE",
    activo: true,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar usuario");
      }

      setMessage("Usuario registrado correctamente");

      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "ESTUDIANTE",
        activo: true,
      });
    } catch (error) {
      setMessage("No se pudo registrar el usuario");
    }
  };

  return (
    <MainLayout>
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-center">
            Crear cuenta
          </h1>

          <p className="text-slate-400 text-center mt-3">
            Únete a la comunidad de estudio colaborativo.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="text-sm text-slate-300">
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Apellido
              </label>

              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@email.com"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold py-3 rounded-xl transition"
            >
              Registrarse
            </button>

          </form>

          {message && (
            <p className="text-center text-cyan-400 text-sm mt-5">
              {message}
            </p>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-cyan-400 hover:underline">
              Inicia sesión
            </a>
          </p>

        </div>
      </section>
    </MainLayout>
  );
}

export default Register;