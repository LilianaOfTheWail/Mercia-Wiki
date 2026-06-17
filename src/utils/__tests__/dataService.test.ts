import { getArticleByName, getCategoryItems } from '../dataService'

describe('dataService', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn(((url: string) => {
      if (url === '/data-config/noble-houses.json') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            'noble-houses': [
              { name: 'House of Dawn', metadata: { status: 'Ruling house of Glowstowe' } }
            ]
          })
        } as any)
      }

      if (url === '/data-config/kingdoms.json') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            kingdoms: [
              {
                name: 'Glowstowe',
                list: [
                  { name: 'Duchy of Eaststead', metadata: { region: 'Glowstowe' } }
                ]
              }
            ]
          })
        } as any)
      }

      return Promise.resolve({ ok: false } as any)
    }) as unknown as typeof fetch)
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  it('loads noble houses through the alias and resolves nested kingdom entries', async () => {
    const nobleHouses = await getCategoryItems('nobility')
    const duchy = await getArticleByName('kingdoms', 'Duchy of Eaststead')

    expect(nobleHouses).toEqual([
      { name: 'House of Dawn', metadata: { status: 'Ruling house of Glowstowe' } }
    ])
    expect(duchy).toEqual({
      name: 'Duchy of Eaststead',
      metadata: { region: 'Glowstowe' }
    })
    expect(global.fetch).toHaveBeenCalledWith('/data-config/noble-houses.json')
    expect(global.fetch).toHaveBeenCalledWith('/data-config/kingdoms.json')
  })
})
