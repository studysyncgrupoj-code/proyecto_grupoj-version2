import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [], // TODO: Aquí agregaremos proveedores (Google, GitHub, Credenciales, etc.) más adelante.
});
