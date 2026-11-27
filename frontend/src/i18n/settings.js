const rows = [
  ["Preferencias del sistema", "System preferences", "Preferências do sistema"],
  ["Apariencia", "Appearance", "Aparência"],
  ["Experiencia visual", "Visual experience", "Experiência visual"],
  ["Tema de la aplicación", "Application theme", "Tema do aplicativo"],
  ["Oscuro", "Dark", "Escuro"],
  ["Claro", "Light", "Claro"],
  ["Sistema", "System", "Sistema"],
  ["Idioma", "Language", "Idioma"],
  ["Diseño actual de StudySync", "Current StudySync design", "Design atual do StudySync"],
  ["Fondo blanco y tonos suaves", "White background and soft colors", "Fundo branco e tons suaves"],
  ["Usar la configuración del equipo", "Use device settings", "Usar configurações do dispositivo"],
  ["Centro de alertas", "Alert center", "Central de alertas"],
  ["Correos electrónicos", "Emails", "E-mails"],
  ["Cursos y actividades", "Courses and activities", "Cursos e atividades"],
  ["Mensajes directos", "Direct messages", "Mensagens diretas"],
  ["Control de cuenta", "Account control", "Controle da conta"],
  ["Seguridad", "Security", "Segurança"],
  ["Privacidad", "Privacy", "Privacidade"],
  ["Información visible", "Visible information", "Informações visíveis"],
  ["Autenticación en dos pasos", "Two-factor authentication", "Autenticação em dois fatores"],
  ["Cambiar contraseña", "Change password", "Alterar senha"],
  ["Contraseña actual", "Current password", "Senha atual"],
  ["Nueva contraseña", "New password", "Nova senha"],
  ["Confirmar contraseña", "Confirm password", "Confirmar senha"],
  ["Visibilidad del perfil", "Profile visibility", "Visibilidade do perfil"],
  ["Perfil privado", "Private profile", "Perfil privado"],
  ["Visible para todos los usuarios", "Visible to all users", "Visível para todos os usuários"],
  ["Solo estudiantes vinculados", "Linked students only", "Somente estudantes vinculados"],
  ["Tus datos están protegidos", "Your data is protected", "Seus dados estão protegidos"],
  ["Guardar cambios", "Save changes", "Salvar alterações"],
  ["Guardando...", "Saving...", "Salvando..."]
];

export const settingsTranslations = {
  en: Object.fromEntries(rows.map(([es,en]) => [es,en])),
  pt: Object.fromEntries(rows.map(([es,en,pt]) => [es,pt]))
};
