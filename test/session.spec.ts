import axios from 'axios';
import {SessionMedia} from "../src/repository/session";
import {Media, MediaContext} from "../src/API/api";

const mockMedia: Media[] =  [
    {
      id: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662',
      mimeType: 'image/png',
      context: 'document-front'
    },
    {
      id: '663ae1db-32b6-4a4e-a828-98e3e94ca11e',
      mimeType: 'image/png',
      context: 'document-back'
    },
    {
      id: '40f1e462-6db8-4313-ace3-83e4f5619c56',
      mimeType: 'image/png',
      context: 'document-back'
    },
    {
      id: 'a6c90b4f-ddfc-49eb-89ad-05b7f1274f96',
      mimeType: 'image/png',
      context: 'document-front'
    },
    {
      id: '40851916-3e86-45cd-b8ce-0e948a8a7751',
      mimeType: 'image/png',
      context: 'document-front'
    }
];

const mockMediaContext: MediaContext[] = [
    {
      id: 'a4338068-d99b-416b-9b2d-ee8eae906eea',
      mediaId: 'a6c90b4f-ddfc-49eb-89ad-05b7f1274f96',
      context: 'back',
      probability: 0.9739324
    },
    {
      id: '93d1a76b-b133-41cc-ae85-aa8b80d93f57',
      mediaId: '40f1e462-6db8-4313-ace3-83e4f5619c56',
      context: 'front',
      probability: 0.2931033
    },
    {
      id: '2277b909-f74e-4dc0-b152-328713948ec5',
      mediaId: '663ae1db-32b6-4a4e-a828-98e3e94ca11e',
      context: 'none',
      probability: 0.9253487
    },
    {
      id: '2277b909-f74e-4dc0-b152-328713948ec5',
      mediaId: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662',
      context: 'front',
      probability: 0.8734357
    },
    {
      id: '2277b909-f74e-4dc0-b152-328713948ec5',
      mediaId: '40851916-3e86-45cd-b8ce-0e948a8a7751',
      context: 'front',
      probability: 0.9264236
    }
];

describe('GET http://localhost:3000/api/sessions/:sessionId', () => {
  it('should return session with media', async () => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');
    expect(response.status).toEqual(200);
  });

  it('Group media by the context type', async () => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');

    expect(response.data).toMatchObject({
      front: expect.any(Array),
      back: expect.any(Array)
    })
  });

  it("should return only relevant and corrected media as a result", async () => {
    const sessionMedia = new SessionMedia(mockMediaContext, mockMedia);

    const front = sessionMedia.isFront().exceedsProbability(.2).run();

    expect(front.length).toBe(3);
  });

  it('irrelevant media must be filtered out', () => {
    const sessionMedia = new SessionMedia(mockMediaContext, mockMedia);

    const front = sessionMedia.isFront().exceedsProbability(.2).run();
    const back = sessionMedia.isBack().exceedsProbability(.2).run();

    expect(back.length).toBe(1);
    expect(front.length).toBe(3);
  });

  it('media list must be sorted by probability descending',() => {
      const sessionMedia = new SessionMedia(mockMediaContext, mockMedia);

      const front = sessionMedia.isFront().exceedsProbability(.2).run();

      const first = front[0];
      const second = front[1];
      const third = front[2];

      expect(first.probability).toBeGreaterThan(second.probability);
      expect(second.probability).toBeGreaterThan(third.probability);
  });
});