import { getCanShowItems } from '../getCanShowItems';
import { add, sub, format } from 'date-fns';

describe('getCanShowItems', () => {
  it('folders with no location, belongs-to-users and dates', () => {
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: Date(),
        // endDate: Date(),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        // startDate: Date(),
        // endDate: Date(),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: Date(),
        // endDate: Date(),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 1, 2]);
  });
  it('folders with dates out of bound and no location, belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: Date(),
        // endDate: Date(),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        startDate: format(add(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: Date(),
        // endDate: Date(),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 2]);
  });
  it('folders with dates in bound and no location, belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 1, 2]);
  });
  it('folders with only start date in bound and no location, belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        // endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 1, 2]);
  });
  it('folders with only start date out of bound and no location, belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        startDate: format(add(now, { days: 1 }), 'yyyy-MM-dd'),
        // endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 2]);
  });
  it('folders with only end date in bound and no location, belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        // startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 1, 2]);
  });
  it('folders with only end date out of bound and no location, belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [],
        belongs_to_users: [],
        // startDate: format(add(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(sub(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 2]);
  });
  it('folders with date in bound  location, no belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [{ location: 'utah' }],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [{ location: 'utah' }],
        belongs_to_users: [],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com', 'utah').map(
        (item) => item.id
      )
    ).toEqual([0, 1, 2]);
  });
  it('folders with date in bound different location, no belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [{ location: 'idaho' }],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [{ location: 'utah' }],
        belongs_to_users: [],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com', 'utah').map(
        (item) => item.id
      )
    ).toEqual([1, 2]);
  });
  it('folders with date out of bound  location, no belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [{ location: 'utah' }],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [{ location: 'utah' }],
        belongs_to_users: [],
        startDate: format(add(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com', 'utah').map(
        (item) => item.id
      )
    ).toEqual([0, 2]);
  });
  it('folders with date in bound wrong location, no belongs-to-users', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [{ location: 'utah' }],
        belongs_to_users: [],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [{ location: 'idaho' }],
        belongs_to_users: [],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com', 'utah').map(
        (item) => item.id
      )
    ).toEqual([0, 2]);
  });
  it('folders with date in bound  belongs-to-users, no location', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        // location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        // location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 1, 2]);
  });
  it('folders with date in bound different belongs-to-users, no location', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        // location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        // location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'chang@gmail.com').map((item) => item.id)
    ).toEqual([2]);
  });
  it('folders with date out of bound  belongs-to-users, no location', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        // location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        // location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        startDate: format(add(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com').map((item) => item.id)
    ).toEqual([0, 2]);
  });
  it('folders with date in bound belongs-to-users, location', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com', 'utah').map(
        (item) => item.id
      )
    ).toEqual([0, 1, 2]);
  });
  it('folders with date in bound belongs-to-users, wrong location', () => {
    const now = new Date();
    const folders = [
      {
        id: 0,
        location: [{ location: 'utah' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        // startDate: now,
        // endDate: add(now, { days: 2 }),
      },
      {
        id: 1,
        location: [{ location: 'idaho' }],
        belongs_to_users: [{ email: 'melody@gmail.com' }],
        startDate: format(sub(now, { days: 1 }), 'yyyy-MM-dd'),
        endDate: format(add(now, { days: 2 }), 'yyyy-MM-dd'),
      },
      {
        id: 2,
        location: [],
        belongs_to_users: [],
        // startDate: sub(now, { days: 1 }),
        // endDate: add(now, { days: 2 }),
      },
    ];

    expect(
      getCanShowItems(folders, 'melody@gmail.com', 'utah').map(
        (item) => item.id
      )
    ).toEqual([0, 1, 2]);
  });
});
