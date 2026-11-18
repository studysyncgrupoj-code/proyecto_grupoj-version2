
import { useEffect, useRef, useState } from "react";

const JITSI_DOMAIN = "meet.jit.si";

let jitsiScriptPromise = null;

function loadJitsiScript() {
  if (window.JitsiMeetExternalAPI) {
    return Promise.resolve();
  }

  if (!jitsiScriptPromise) {
    jitsiScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://${JITSI_DOMAIN}/external_api.js`;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("No se pudo cargar Jitsi"));
      document.body.appendChild(script);
    }).catch((error) => {
      jitsiScriptPromise = null;
      throw error;
    });
  }

  return jitsiScriptPromise;
}

export default function JitsiMeeting({
  meetingUrl,
  displayName,
  onParticipantsChange,
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let api = null;

    async function initializeMeeting() {
      try {
        const url = new URL(meetingUrl);

        if (
          url.protocol !== "https:" ||
          url.hostname !== JITSI_DOMAIN
        ) {
          throw new Error("La dirección de Jitsi no es válida");
        }

        const roomName = url.pathname.split("/").filter(Boolean)[0];

        if (!roomName) {
          throw new Error("La sala no tiene un identificador válido");
        }

        await loadJitsiScript();

        if (cancelled || !containerRef.current) return;

        api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: 520,
          userInfo: {
            displayName: displayName || "Participante StudySync",
          },
        });


const updateParticipants = async () => {
  try {
    const participants = await api.getRoomsInfo();

    if (cancelled) return;

    const currentRoom = participants?.rooms?.find(
      (item) => item.isMainRoom
    );

    const connectedUsers = currentRoom?.participants || [];

    onParticipantsChange?.(
      connectedUsers.map((participant) => ({
        id: participant.id,
        name: participant.displayName || "Participante",
        initials: (participant.displayName || "P")
          .slice(0, 2)
          .toUpperCase(),
        status: "Conectado",
      }))
    );
  } catch (error) {
    console.error("Error consultando participantes de Jitsi:", error);
  }
};

api.addListener("videoConferenceJoined", updateParticipants);
api.addListener("participantJoined", updateParticipants);
api.addListener("participantLeft", ({ id }) => {
  onParticipantsChange?.((currentParticipants) =>
    currentParticipants.filter(
      (participant) => participant.id !== id
    )
  );
});



      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    initializeMeeting();

    return () => {
      cancelled = true;
      if (api) api.dispose();
    };
  }, [meetingUrl, displayName]);

  return (
    <article className="room-jitsi-card">
      <h2>Videoconferencia StudySync</h2>

      {error && <p role="alert">{error}</p>}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: 520,
          overflow: "hidden",
          borderRadius: 12,
        }}
      />
    </article>
  );
}

