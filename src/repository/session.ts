import {Media, MediaContext, Session} from "../API/api";
import veriffApi from "../API/veriff.sdk";

function isMatch(context: MediaContext, m: Media) {
    return context.mediaId === m.id;
}

function assign(result, mediaContexts) {
    return result.map(m => {
        const contextMap = {
            back: 'document-back',
            front: 'document-front'
        }
        const match = mediaContexts.find(mc =>  isMatch(mc, m));

        return {...m, probability: match ? match.probability : 0, context: contextMap[match.context]};
    });
}

export class SessionMedia {
    private operations: any[] = [];
    constructor(private readonly mediaContexts: MediaContext[], private readonly media: Media[]) {
    }

    private apply(operation) {
        this.operations.push(operation);
    }

    isBack() {
        this.apply((result) => result.filter(m => m.context === 'document-back'));
        return this;
    }

    isFront() {
        this.apply((result) => result.filter(m => m.context === 'document-front'));
        return this;
    }

    exceedsProbability(threshold: number) {
        this.apply((result) => result.filter(m => m.probability > threshold));
        return this;
    }

    sort(direction: "desc" | "asc" ) {
        this.apply((result) => {
            return result.sort((a,b) => {
                if(direction === 'desc') return b.probability - a.probability;
                return a.probability - b.probability;
            });
        });
        return this;
    }

    run() {
        const data = assign(this.media, this.mediaContexts);

        const result = this.operations.reduce((memo, next) => next(memo), data);

        this.operations = [];

        return result;
    }
}

export async function readSession(sessionId: string): Promise<Session> {
    const session = await veriffApi.session(sessionId);
    return session;
}

export async function getMediaForSession(sessionId: string): Promise<SessionMedia> {
    const [media, mediaContext] = await Promise.all([
        veriffApi.media(sessionId).catch(() => []),
        veriffApi.mediaContext(sessionId).catch(() => [])
    ]);

    return new SessionMedia(mediaContext, media);
}

export default {
    readSession,
    getMediaForSession
}