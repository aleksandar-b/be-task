import {Api, Media, Session, MediaContext} from "./api";
import axios, {Axios} from "axios";
import {HOST} from "./constants";

const client: Axios = axios;

const veriffApi: Api = {
        async session(sessionId: string): Promise<Session> {
            return client.get<Session>(`${HOST}/sessions/${sessionId}`).then(res => res.data);
        },
        async media(sessionId: string) {
            return client.get<Media[]>(`${HOST}/sessions/${sessionId}/media/`).then(res => res.data);
        },
        async mediaContext(sessionId: string) {
            return client.get<MediaContext[]>(`${HOST}/media-context/${sessionId}`).then(res => res.data);
        }
};

export default veriffApi;