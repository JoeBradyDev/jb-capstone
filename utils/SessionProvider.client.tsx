import moment from "moment";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useReducer,
} from "react";

export interface ISession {
  loggedIn: boolean;
  login: ((tokenExpiration: number) => void) | null;
  logout: (() => void) | null;
  refreshingToken: boolean;
  sessionEndDate: Date | null;
  sessionSuspended: boolean;
  startSession: (() => void) | null;
}

export interface IAction {
  type: string;
  payload?: {
    refreshingToken?: boolean;
    sessionEndDate?: Date;
  };
}

export interface IProtectedPageProps {
  children: React.ReactNode;
}

export interface ISessionProviderProps {
  children: React.ReactNode;
}

const initialState: ISession = {
  loggedIn: false,
  login: null,
  logout: null,
  refreshingToken: false,
  sessionEndDate: null,
  sessionSuspended: false,
  startSession: null,
};

const ACTION = {
  START_SESSION: "START_SESSION",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  SUSPEND_SESSION: "SUSPEND_SESSION",
  CLEANUP_SESSION: "CLEANUP_SESSION",
};

const SessionContext = React.createContext<ISession>(initialState);

const reducer = (state: ISession, action: IAction): ISession => {
  switch (action.type) {
    case ACTION.START_SESSION:
      return {
        ...initialState,
        sessionEndDate: action?.payload?.sessionEndDate ?? null,
      };
    case ACTION.SUSPEND_SESSION:
      return {
        ...state,
        sessionSuspended: true,
      };
    case ACTION.REFRESH_TOKEN:
      return {
        ...state,
        refreshingToken: true,
      };
    case ACTION.CLEANUP_SESSION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const useSession = () => {
  return useContext(SessionContext);
};

export const ProtectedPage: React.FC<IProtectedPageProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loggedIn === null) {
      setLoggedIn(Boolean(window.localStorage.getItem("loggedIn")));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn === false) {
      router.push("/login");
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return null;
  }

  return <>{children}</>;
};

const SessionProvider: React.FC<ISessionProviderProps> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { refreshingToken, sessionEndDate, sessionSuspended } = state;
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const logout = useCallback(() => {
    setLoggedIn(false);
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("loggedIn");
    dispatch({ type: ACTION.CLEANUP_SESSION });
    fetch("/api/logout");
    router.push("/login");
  }, [router, dispatch]);

  const refreshSessionToken = async () => {
    try {
      const response = await fetch("/api/refresh", { method: "POST" });
      const data = await response.json();
      if (!!data?.loggedIn && !!data?.tokenExpiration) {
        startSession(data.tokenExpiration);
      } else {
        logout();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!loggedIn) {
      return;
    }

    if (refreshingToken) {
      return;
    }

    const now = new Date();
    if (sessionSuspended && !!sessionEndDate && now >= sessionEndDate) {
      dispatch({
        type: ACTION.REFRESH_TOKEN,
      });
    }
  };

  const startSession = (tokenExpiration: number) => {
    let now = moment();
    let sessionEndDate = moment().add(tokenExpiration, "seconds").toDate();
    window.localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
    dispatch({
      type: ACTION.START_SESSION,
      payload: { sessionEndDate },
    });
  };

  const login = useCallback(
    (tokenExpiration: number) => {
      if (!loggedIn) {
        startSession(tokenExpiration);
        router.push("/");
      }
    },
    [loggedIn]
  );

  // Called if page reloaded
  useEffect(() => {
    if (!loggedIn) {
      const newLoggedIn = window.localStorage.getItem("loggedIn");
      setLoggedIn(Boolean(newLoggedIn));
    }
  });

  // Called after logging in before session suspended
  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    if (sessionSuspended) {
      return;
    }

    let timer = setInterval(() => {
      const now = new Date();
      if (!!sessionEndDate && now >= sessionEndDate) {
        dispatch({
          type: ACTION.SUSPEND_SESSION,
        });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loggedIn, sessionSuspended, sessionEndDate, dispatch]);

  // Called after logging in
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Called after mouse moves before refresh token expires
  useEffect(() => {
    if (refreshingToken) {
      refreshSessionToken();
    }
  }, [refreshingToken]);

  return (
    <>
      <SessionContext.Provider
        value={{ ...state, loggedIn: !!loggedIn, login, logout }}
      >
        {children}
      </SessionContext.Provider>
    </>
  );
};

export default SessionProvider;
