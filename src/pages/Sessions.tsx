import React, { useState, useEffect, useMemo } from "react";
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

export default function Sessions() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const votesID = useMemo(() => {
    console.log("Calculates computed votes ...");

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
      navigate("/login");
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
      navigate("/login");
      return;
    }

    const response = await fetch(`${config.apiBaseUrl}/api/v1/votes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, response.ok);
    if (response.ok) {
      const data = await response.json();
      setVotes(data);
    }
  };
  const handleVote = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const { session_id } = {
      session_id: "",
      ...evt.currentTarget.dataset,
    };

    const token = localStorage.getItem("cmrm25");
    if (!token) {
      navigate("/login");
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
  const undoVote = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const { session_id, vote_id } = {
      session_id: "",
      vote_id: "",
      ...evt.currentTarget.dataset,
    };

    const token = localStorage.getItem("cmrm25");
    if (!token) {
      navigate("/login");
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
    <div className="sessions-main-container">
      <div className="sessions-container">
        <h1>Talk selezionati</h1>
        <ul className="votes-list">
          {votes.map((vote) => (
            <li key={vote.id} className="vote-card">
              <h3>{vote.session_title}</h3>
              <button
                data-session_id={vote.session_id}
                data-vote_id={votesID[vote.session_id]}
                onClick={undoVote}
                className="vote"
              >
                Undo
              </button>
            </li>
          ))}
        </ul>
      </div>
      {votes.length < config.maxVotesLimit && (
        <div className="sessions-container">
          <h1>Proposte</h1>
          <div className="sessions-grid">
            {sessions.map((session) => (
              <div key={session.id} className="session-card">
                <h2>{session.title}</h2>
                <p>{session.description}</p>
                {Object.hasOwn(votesID, session.id) ? (
                  <button
                    data-session_id={session.id}
                    data-vote_id={votesID[session.id]}
                    onClick={undoVote}
                    className="vote"
                  >
                    Undo
                  </button>
                ) : (
                  <button
                    data-session_id={session.id}
                    onClick={handleVote}
                    className="vote"
                  >
                    Vote
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={fetchSessions}>Refresh</button>
        </div>
      )}
    </div>
  );
}
