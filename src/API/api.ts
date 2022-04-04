type Guid = string;
type DetectedContext = "back" | "front" | "none";
type Context = "document-front" | "document-back";
type MimeType = "image/png";
type Probability = number;

export interface Session { id: Guid, status: string }

export interface Media {
    context: Context,
    id: Guid,
    mimeType: MimeType
}

export interface MediaContext {
    context: DetectedContext,
    id: Guid,
    mediaId: Guid,
    probability: Probability
}

export interface Api {
        session(sessionId): Promise<Session>;
        mediaContext(sessionId): Promise<MediaContext[]>;
        media(sessionId): Promise<Media[]>
}