import type { BackendClient } from '@/lib/backend/client';
import type { Session } from 'next-auth';

// TODO: bloquear queries/mutations del BFF según el rol del usuario.
// Caso conocido: `mySubscription` solo aplica a `student`. Un `teacher` o `admin`
// con token válido puede invocarla y recibe `null` (no es un leak, pero es
// comportamiento indefinido del contrato). Revisar el resto de queries y
// mutations del schema para cerrar los casos equivalentes.
export interface GraphQLContext {
  session: Session | null;
  backend: BackendClient;
}
