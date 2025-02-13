import { MouseEvent, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
// import Accordion from "../components/accordion";

import config from "../lib/config";
import Accordion from "../components/accordion";

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
  const [user, setUser] = useState<{ firstName: string; lastName: string }>({
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    fetchSessions();
    fetchVotedSessions();
  }, [navigate]);

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

  const voteAccordionItems = useMemo(() => {
    return votes.map((vote) => ({
      id: vote.id,
      title: (
        <p className="text-[15px] text-gray-900 font-normal">
          {vote.session_title}
          <button
            data-session_id={vote.session_id}
            data-vote_id={vote.id}
            onClick={undoVote}
            className="button vote vote-undo my-2 ml-2"
          >
            Undo
          </button>
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
    }));
  }, [handleVote, sessions, undoVote, votesID]);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        message={`Ciao ${user.firstName}`}
        cta={`Vota i tuoi 3 preferiti per Roma '25`}
      />
      <div className="grid grid-cols-2 gap-1 mt-3">
        <Accordion title="Proposals" items={sessionAccordionItems} />
        <Accordion title="Favourites" items={voteAccordionItems} />
      </div>
      {/* 
      <main className="flex items-center justify-center">
        <div className="p-6 rounded-lg shadow">
          <div className="flex flex-col items-center justify-center py-4">
            {votes.length > 0 && (
              <section className="container votes-container py-10">
                <h4 className="text-2xl" style={{ margin: "1rem 0" }}>
                  La tua selezione:
                </h4>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {votes.map((vote) => (
                    <article
                      key={vote.id}
                      className="article vote-card d-block"
                      style={{
                        padding: "1rem",
                      }}
                    >
                      <span>{vote.title}</span>
                      <button
                        data-session_id={vote.session_id}
                        data-vote_id={votesID[vote.session_id]}
                        onClick={undoVote}
                        className="button vote vote-undo"
                        style={{
                          margin: "0 0.5rem",
                        }}
                      >
                        X
                      </button>
                    </article>
                  ))}
                </section>
              </section>
            )}
            {votes.length < config.maxVotesLimit && (
              <>
                <h4 className="text-2xl" style={{ margin: "1rem 0" }}>
                  Proposte:
                </h4>

                <section className="container sessions-container">
                  <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {sessions.map((session) => (
                      <article
                        key={session.id}
                        className="article session-card"
                      >
                        <div className="article-content">
                          <h4 className="article-title">{session.title}</h4>
                          <p className="article-description">
                            {session.description}
                          </p>
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
          </div>
        </div>
      </main> */}
    </div>
  );
}
