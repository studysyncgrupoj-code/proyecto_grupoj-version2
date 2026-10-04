import type { BackendClient } from '../backend/client';

export class MockBackendClient implements BackendClient {
  users = {
    getMe: async () => ({
      id: 'test-user-001',
      name: 'Test User',
      email: 'test@example.com',
      image: null,
      role: 'student' as const,
      profile: {
        bio: {
          title: 'Estudiante',
          description: 'Perfil de prueba',
        },
        interests: ['programming', 'technology'],
      },
    }),
  };
}
