import { MouseEvent, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import config from "../lib/config";

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
      {}
    );
  }, [votes]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const navigate = useNavigate();

  const fetchSessions = async () => {
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
  };

  const fetchVotedSessions = async () => {
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
  };
  const handleVote = async (evt: MouseEvent<HTMLButtonElement>) => {
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
  };
  const undoVote = async (evt: MouseEvent<HTMLButtonElement>) => {
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
  };

  useEffect(() => {
    fetchSessions();
    fetchVotedSessions();
  }, [navigate]);

  return (
    <>
      {votes.length < config.maxVotesLimit && (
        <>
          <h3 className="text-3xl font-bold underline">Proposte</h3>
          <button onClick={fetchSessions} className="button">
            Aggiorna
          </button>
          <section className="container sessions-container">
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {sessions.map((session) => (
                <article key={session.id} className="article session-card">
                  <div className="article-content">
                    <h3 className="article-title">{session.title}</h3>
                    <p className="article-description">{session.description}</p>
                    {Object.hasOwn(votesID, session.id) ? (
                      <button
                        data-session_id={session.id}
                        data-vote_id={votesID[session.id]}
                        onClick={undoVote}
                        className="button vote vote-undo"
                      >
                        Undo
                      </button>
                    ) : (
                      <button
                        data-session_id={session.id}
                        onClick={handleVote}
                        className="button vote"
                      >
                        Vote
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </section>
        </>
      )}
      {votes.length > 0 && (
        <section className="container votes-container">
          <h3 className="text-3xl font-bold underline">La tua selezione</h3>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {votes.map((vote) => (
              <article key={vote.id} className="article vote-card">
                <h3>{vote.session_title}</h3>
                <button
                  data-session_id={vote.session_id}
                  data-vote_id={votesID[vote.session_id]}
                  onClick={undoVote}
                  className="button vote vote-undo"
                >
                  X
                </button>
              </article>
            ))}
          </section>
        </section>
      )}
    </>
  );
}
