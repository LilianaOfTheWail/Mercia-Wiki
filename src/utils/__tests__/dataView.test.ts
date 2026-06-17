import { buildTableOfContents } from '../dataView'

describe('buildTableOfContents', () => {
    // Save the original global fetch to restore it after tests
    const originalFetch = global.fetch;

    beforeEach(() => {
        // Reset the mock before each test
        global.fetch = jest.fn();
    });

    afterAll(() => {
        // Restore original fetch
        global.fetch = originalFetch;
    });

    const mockData = {
        characters: [
            { name: 'Doc A', metadata: { tags: 'typescript, frontend', author: 'Alice', year: '2026' } },
            { name: 'Doc B', metadata: { tags: 'backend, go', author: 'Bob', year: '2025' } },
            { name: 'Doc C', metadata: { tags: 'typescript, backend', author: 'Charlie', year: '2026' } },
        ]
    };

    it('should return an empty array if the fetch request fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: [], shouldExclude: [] },
            dataFields: ['author']
        });
        expect(result).toEqual([]);
        expect(global.fetch).toHaveBeenCalledWith('/data-config/characters.json');
    });

    it('should return linkable names when no data fields are provided', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: [], shouldExclude: [] },
        });

        expect(result).toEqual([
            { name: 'Doc A', href: '/characters/doc-a' },
            { name: 'Doc B', href: '/characters/doc-b' },
            { name: 'Doc C', href: '/characters/doc-c' },
        ]);
    });

    it('should return all items with specific fields when filters are empty', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: [], shouldExclude: [] },
            dataFields: ['author', 'year']
        });

        expect(result).toEqual([
            { name: 'Doc A', href: '/characters/doc-a', metadata: { author: 'Alice', year: '2026' } },
            { name: 'Doc B', href: '/characters/doc-b', metadata: { author: 'Bob', year: '2025' } },
            { name: 'Doc C', href: '/characters/doc-c', metadata: { author: 'Charlie', year: '2026' } },
        ]);
    });

    it('should correctly include items based on shouldInclude tags', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: ['typescript'], shouldExclude: [] },
            dataFields: ['author']
        });

        // Should only return Doc A and Doc C
        expect(result).toEqual([
            { name: 'Doc A', href: '/characters/doc-a', metadata: { author: 'Alice' } },
            { name: 'Doc C', href: '/characters/doc-c', metadata: { author: 'Charlie' } },
        ]);
    });

    it('should correctly exclude items based on shouldExclude tags', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: [], shouldExclude: ['backend'] },
            dataFields: ['author']
        });

        // Should only return Doc A (Doc B and C have 'backend')
        expect(result).toEqual([
            { name: 'Doc A', href: '/characters/doc-a', metadata: { author: 'Alice' } },
        ]);
    });

    it('should handle complex filtering with both inclusions and exclusions', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: ['typescript'], shouldExclude: ['frontend'] },
            dataFields: ['author']
        });

        // Doc A and C have 'typescript', but Doc A is excluded due to 'frontend'. Only C remains.
        expect(result).toEqual([
            { name: 'Doc C', href: '/characters/doc-c', metadata: { author: 'Charlie' } },
        ]);
    });

    it('should ignore data fields that do not exist in the item metadata', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await buildTableOfContents({
            domain: 'characters',
            filters: { shouldInclude: ['go'], shouldExclude: [] },
            dataFields: ['author', 'nonExistentField']
        });

        expect(result).toEqual([
            { name: 'Doc B', href: '/characters/doc-b', metadata: { author: 'Bob' } }, // nonExistentField is omitted cleanly
        ]);
    });

    it('should load noble houses from the matching source file', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                'noble-houses': [
                    { name: 'House of Dawn', metadata: { status: 'Ruling house of Glowstowe' } },
                ]
            }),
        });

        const result = await buildTableOfContents({
            domain: 'noble-houses',
            filters: { shouldInclude: [], shouldExclude: [] },
            dataFields: ['status']
        });

        expect(result).toEqual([
            { name: 'House of Dawn', href: '/noble-houses/house-of-dawn', metadata: { status: 'Ruling house of Glowstowe' } },
        ]);
        expect(global.fetch).toHaveBeenCalledWith('/data-config/noble-houses.json');
    });
});
