import { MouseEvent, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import SocialShare from "../components/socialShare/";
// import Accordion from "../components/accordion";

import config from "../lib/config";
// import Accordion from "../components/accordion";
import AccordionThin from "../components/accordionThin";

interface Session {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Vote {
  id: string;
  session_id: string;
  user_id: string;
  session_title?: string;
  session_description?: string;
  deleted_at?: string | null;
}

const loginUrl = "/";

export default function Vote() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const votesID = useMemo(() => {
    return votes.reduce(
      (aggregate, vote) => ({ ...aggregate, [vote.session_id]: vote.id }),
      {},
    );
  }, [votes]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState<{ firstName: string; lastName: string }>({
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const fetchSessions = useCallback(async () => {
    const token = localStorage.getItem("cmrm25");
    if (!token) {
      navigate(loginUrl);
      return;
    }

    const response = await fetch(`${config.apiBaseUrl}/api/v1/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setSessions(data);
    }
  }, [navigate]);

  const fetchVotedSessions = useCallback(async () => {
    const token = localStorage.getItem("cmrm25");
    if (!token) {
      navigate(loginUrl);
      return;
    }

    const response = await fetch(`${config.apiBaseUrl}/api/v1/votes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setVotes(data);
    }
  }, [navigate]);
  const handleVote = useCallback(
    async (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      const { session_id } = {
        session_id: "",
        ...evt.currentTarget.dataset,
      };

      const token = localStorage.getItem("cmrm25");
      if (!token) {
        navigate(loginUrl);
        return;
      }
      const response = await fetch(`${config.apiBaseUrl}/api/v1/votes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id }),
      });
      if (response.ok) {
        fetchVotedSessions();
      } else {
        console.error("Failed to vote");
      }
    },
    [navigate, fetchVotedSessions],
  );
  const undoVote = useCallback(
    async (evt: MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault();
      const { session_id, vote_id } = {
        session_id: "",
        vote_id: "",
        ...evt.currentTarget.dataset,
      };

      const token = localStorage.getItem("cmrm25");
      if (!token) {
        navigate(loginUrl);
        return;
      }
      const response = await fetch(`${config.apiBaseUrl}/api/v1/votes`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id, vote_id }),
      });
      if (response.ok) {
        fetchVotedSessions();
      } else {
        console.error("Failed to undo vote");
      }
    },
    [navigate, fetchVotedSessions],
  );

  const voteAccordionItems = useMemo(() => {
    return votes.map((vote) => ({
      id: vote.id,
      title: (
        <p className="text-[15px] text-gray-900 font-normal">
          {vote.session_title}
        </p>
      ),
      description: vote.session_description,
      children: (
        <div className="article-content vote-content" key={vote.id}>
          <p className="article-description vote-description">
            {vote.session_description}
          </p>
        </div>
      ),
      buttons: [
        {
          text: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ),
          onClick: undoVote,
          data: { session_id: vote.session_id, vote_id: vote.id },
        },
        {
          text: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          ),
          onClick: () => {
            setActiveSession({
              id: vote.session_id,
              title: vote.session_title || "",
              description: vote.session_description || "",
              status: "active",
            });
            setModalOpen(true);
          },
          data: { session_id: vote.session_id },
        },
      ],
    }));
  }, [undoVote, votes]);
  const sessionAccordionItems = useMemo(() => {
    return sessions.map((session) => ({
      id: session.id,
      title: (
        <span className="text-[15px] text-gray-900 font-normal">
          {session.title}
        </span>
      ),
      description: session.description,
      children: (
        <div className="article-content" key={session.id}>
          <button
            data-session_id={session.id}
            data-session_title={session.title}
            data-session_description={session.description}
            onClick={() => {
              setActiveSession(session);
              setModalOpen(true);
            }}
            className="button vote vote-undo my-2"
          >
            Expand
          </button>
          <p className="article-description">{session.description}</p>

          {Object.hasOwn(votesID, session.id) ? (
            <button
              data-session_id={session.id}
              data-vote_id={votesID[session.id]}
              onClick={undoVote}
              className="button vote vote-undo my-2"
            >
              Undo
            </button>
          ) : (
            <button
              data-session_id={session.id}
              onClick={handleVote}
              className="button vote my-2"
            >
              Vote
            </button>
          )}
        </div>
      ),
      buttons: [
        {
          text: Object.hasOwn(votesID, session.id) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          ),
          onClick: (evt) => {
            if (Object.hasOwn(votesID, session.id)) {
              undoVote(evt);
            } else {
              handleVote(evt);
            }
          },
          data: { session_id: session.id, vote_id: votesID[session.id] },
        },
        {
          text: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          ),
          onClick: () => {
            setActiveSession(session);
            setModalOpen(true);
          },
          data: { session_id: session.id },
        },
      ],
    }));
  }, [handleVote, sessions, undoVote, votesID]);

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50	">
        <div
          className="bg-white rounded-lg shadow-lg p-6 max-w-[90%] md:max-w-[75%] lg:max-w-[60%] 2xl:max-w-[40%] w-full max-h-screen h-100 overflow-auto
 relative"
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &#x2715; {/* Close button */}
          </button>
          {children}
        </div>
      </div>
    );
  };
  const SessionModal = ({ isOpen, onClose }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-lg font-bold">{activeSession?.title}</h2>
        <p className="text-gray-600">{activeSession?.description}</p>
      </Modal>
    );
  };
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    fetchSessions();
    fetchVotedSessions();
  }, [fetchSessions, fetchVotedSessions]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        message={`Ciao ${user.firstName}, seleziona i tuoi ${config.maxVotesLimit} preferiti dalla shortlist per Roma '25`}
      />
      <div className="grid grid-cols-2 gap-1 mt-3 min-h-screen">
        {votes.length < config.maxVotesLimit ? (
          <AccordionThin title="Shortlist" items={sessionAccordionItems} />
        ) : (
          <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden p-6">
            <div className={`divide-y divide-gray-200 `}>
              <h3 className="text-lg pb-3">Complimenti</h3>
              <div className="py-4">
                La tua selezione è stata salvata con successo, rimuovi degli
                elementi se vuoi aggiungerne altri.
              </div>
              <div className="pt-2 pb-4">
                <SocialShare
                  shareUrl="https://conferences.codemotion.com/rome2025/it/home-ita/"
                  title="Codemotion Roma '25"
                  twitter={{
                    related: ["@CodemotionIT:Codemotion"],
                    hashtags: ["CodemotionRome"],
                  }}
                  facebook={{ hashtag: "CodemotionRome" }}
                />
              </div>
            </div>
          </div>
        )}
        <AccordionThin
          title={`La tua top ${config.maxVotesLimit}`}
          items={voteAccordionItems}
          fixed={true}
        />
      </div>
      <SessionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
