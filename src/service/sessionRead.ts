import sessionRepo, {SessionMedia} from "../repository/session";
import {Session} from "../API/api";

interface SessionWithMedia {
    front: SessionMedia;
    back: SessionMedia;
    session: Session;
}

export async function sessionRead(sessionId): Promise<SessionWithMedia> {
        const session = await sessionRepo.readSession(sessionId);
        const media = await sessionRepo.getMediaForSession(sessionId);

        const front = media.isFront().exceedsProbability(.2).sort('desc').run();
        const back = media.isBack().exceedsProbability(.2).sort('desc').run();

        return {front, back, session};
}