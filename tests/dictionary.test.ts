import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  dictionary,
  findDictionaryEntry,
  normalizeDictionaryTerm,
  suggestDictionaryEntries,
  validateDictionaryQuery,
} from '@/lib/dictionary';
import { GET } from '@/app/api/translate/route';

afterEach(() => vi.unstubAllGlobals());

describe('study dictionary', () => {
  it('contains at least sixty complete bilingual contextual entries with unique IDs', () => {
    expect(dictionary.length).toBeGreaterThanOrEqual(60);
    expect(new Set(dictionary.map((entry) => entry.id)).size).toBe(dictionary.length);
    for (const entry of dictionary) {
      expect(entry.definitionEn.length, entry.id).toBeGreaterThan(20);
      expect(entry.meaningAz.length, entry.id).toBeGreaterThan(2);
      expect(entry.explanationAz.length, entry.id).toBeGreaterThan(20);
      expect(entry.example.en.length, entry.id).toBeGreaterThan(15);
      expect(entry.example.az.length, entry.id).toBeGreaterThan(15);
    }
  });

  it('explains product-user onboarding in both languages rather than only giving a literal translation', () => {
    const entry = findDictionaryEntry(' USER ONBOARDING ');
    expect(entry?.id).toBe('onboarding');
    expect(entry?.context).toBe('Product experience');
    expect(entry?.definitionEn).toContain('first useful result');
    expect(entry?.explanationAz).toContain('qeydiyyat');
    expect(entry?.explanationAz).toContain('işçi');
    expect(entry?.example.en).toContain('first lesson');
    expect(entry?.example.az).toContain('ilk dərsi');
  });

  it('normalizes acronyms, plural aliases and multiword punctuation without guessing unknown meanings', () => {
    expect(normalizeDictionaryTerm('  Definition—of—Done  ')).toBe('definition of done');
    expect(findDictionaryEntry('DoD')?.id).toBe('definition-of-done');
    expect(findDictionaryEntry('requirements')?.id).toBe('requirement');
    expect(findDictionaryEntry('Work-in-progress')?.id).toBe('work-in-progress');
    expect(findDictionaryEntry('t2m')?.id).toBe('time-to-market');
    expect(findDictionaryEntry('a phrase this dictionary does not define')).toBeUndefined();
  });

  it('keeps commonly confused business-analysis concepts distinct', () => {
    const verification = findDictionaryEntry('verify');
    const validation = findDictionaryEntry('validate');
    expect(verification?.id).toBe('verification');
    expect(validation?.id).toBe('validation');
    expect(verification?.definitionEn).not.toBe(validation?.definitionEn);
    expect(findDictionaryEntry('design')?.definitionEn).toContain('how');
    expect(findDictionaryEntry('requirement')?.definitionEn).toContain('need');
    expect(suggestDictionaryEntries('sprint').every((entry) => entry.context === 'Scrum')).toBe(
      true,
    );
  });

  it('rejects URLs, control characters and oversized text while allowing a short English phrase', () => {
    for (const input of [
      '',
      'x'.repeat(101),
      'https://example.com',
      'www.example.com',
      'example.org',
      'word\nother',
      'word\u0000',
      '<script>',
      '123',
      null,
      {},
    ]) {
      expect(validateDictionaryQuery(input).valid, String(input)).toBe(false);
    }
    expect(validateDictionaryQuery('  work item age  ')).toEqual({
      valid: true,
      query: 'work item age',
    });
    expect(suggestDictionaryEntries('', 4)).toHaveLength(4);
    expect(suggestDictionaryEntries('no-matching-term')).toEqual([]);
  });
});

describe('dictionary route', () => {
  it('serves curated terms offline and rejects invalid input without contacting a provider', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const local = await GET(new Request('http://localhost/api/translate?q=onboarding'));
    expect((await local.json()).kind).toBe('curated');
    const invalid = await GET(
      new Request('http://localhost/api/translate?q=https%3A%2F%2Fexample.com'),
    );
    expect(invalid.status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('uses fixed public providers and labels online definitions and Azerbaijani text as machine translated', async () => {
    const fetcher = vi.fn(async (input: string | URL) => {
      const url = new URL(String(input));
      if (url.hostname === 'api.dictionaryapi.dev') {
        return Response.json([
          {
            word: 'serendipity',
            meanings: [
              {
                partOfSpeech: 'noun',
                definitions: [
                  {
                    definition: 'Finding something useful by chance.',
                    example: 'Finding the missing note was serendipity.',
                  },
                ],
              },
            ],
          },
        ]);
      }
      expect(url.hostname).toBe('api.mymemory.translated.net');
      expect(url.searchParams.get('langpair')).toBe('en|az');
      return Response.json({
        responseStatus: 200,
        responseData: { translatedText: `Tərcümə: ${url.searchParams.get('q')}` },
      });
    });
    vi.stubGlobal('fetch', fetcher);
    const response = await GET(new Request('http://localhost/api/translate?q=serendipity'));
    const body = await response.json();
    expect(body.kind).toBe('online');
    expect(body.machineTranslated).toBe(true);
    expect(body.definitionEn).toContain('by chance');
    expect(body.meaningAz).toContain('Tərcümə');
    expect(body.explanationAz).toContain('Finding something');
    expect(body.example.az).toContain('missing note');
    const firstCalls = fetcher.mock.calls.length;
    await GET(new Request('http://localhost/api/translate?q=serendipity'));
    expect(fetcher).toHaveBeenCalledTimes(firstCalls);
  });

  it('returns an honest unavailable result when both providers fail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network unavailable')));
    const response = await GET(
      new Request('http://localhost/api/translate?q=unfamiliar%20phrase%20xyz'),
    );
    const body = await response.json();
    expect(body.kind).toBe('not-found');
    expect(body.message).toContain('No reliable definition');
    expect(body.definitionEn).toBeUndefined();
    expect(body.explanationAz).toBeUndefined();
  });

  it('does not present translation quota errors as Azerbaijani explanations', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL) => {
        if (new URL(String(input)).hostname === 'api.dictionaryapi.dev')
          return Response.json([
            {
              word: 'ephemeral',
              meanings: [{ definitions: [{ definition: 'Lasting for a short time.' }] }],
            },
          ]);
        return Response.json({
          responseStatus: 403,
          responseData: {
            translatedText: 'MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS',
          },
        });
      }),
    );
    const response = await GET(new Request('http://localhost/api/translate?q=ephemeral'));
    const body = await response.json();
    expect(body.kind).toBe('online');
    expect(body.definitionEn).toContain('short time');
    expect(body.meaningAz).toBeNull();
    expect(body.explanationAz).toBeNull();
  });
});

describe('dictionary definition fallback', () => {
  it('uses an exact Datamuse match when the primary English dictionary is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL) => {
        const url = new URL(String(input));
        if (url.hostname === 'api.dictionaryapi.dev') return new Response('', { status: 403 });
        if (url.hostname === 'api.datamuse.com')
          return Response.json([
            { word: 'conundrum', defs: ['n\tA difficult problem or question.'] },
          ]);
        expect(url.hostname).toBe('api.mymemory.translated.net');
        return Response.json({
          responseStatus: 200,
          responseData: { translatedText: 'Çətin məsələ' },
        });
      }),
    );
    const response = await GET(new Request('http://localhost/api/translate?q=conundrum'));
    const body = await response.json();
    expect(body.kind).toBe('online');
    expect(body.definitionEn).toContain('difficult problem');
    expect(body.explanationAz).toBe('Çətin məsələ');
    expect(body.sources.some((s: { title: string }) => s.title === 'Datamuse definitions')).toBe(
      true,
    );
  });
  it('does not substitute a similar spelling for a missing term', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL) => {
        if (new URL(String(input)).hostname === 'api.datamuse.com')
          return Response.json([{ word: 'different', defs: ['n\tAn unrelated definition.'] }]);
        return new Response('', { status: 404 });
      }),
    );
    const response = await GET(
      new Request('http://localhost/api/translate?q=missingtechnicaltermxyz'),
    );
    const body = await response.json();
    expect(body.kind).toBe('not-found');
  });
});
