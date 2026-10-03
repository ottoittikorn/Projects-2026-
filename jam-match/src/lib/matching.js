// The matching rules from the design canvas.
//
// Step A: hard filters. Both people must fit each other's preferences.
// Step B: ranking. Better fits are shown first.

const INACTIVE_AFTER_DAYS = 30;

// Age in whole years from a birth date like { day: 14, month: 5, year: 1997 }.
export function ageFromBirthDate({ day, month, year }, today = new Date()) {
  let age = today.getFullYear() - year;
  const hadBirthdayThisYear =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

// A person's level = their best instrument's level (0 = Beginner … 4 = Pro).
export function bestLevel(person) {
  return Math.max(...person.instruments.map((i) => i.level));
}

function sharedGenres(a, b) {
  return a.genres.filter((g) => b.genres.includes(g));
}

// 'any': genre doesn't matter. 'overlap': at least one genre in common.
// 'only': their main (first) genre must be one of mine.
function genresOk(mode, me, other, shared) {
  if (mode === 'any') return true;
  if (mode === 'only') return me.genres.includes(other.genres[0]);
  return shared.length > 0;
}

// Does `other` fit what `me` asked for?
function fitsPrefs(me, other, shared, distanceKm) {
  const p = me.prefs;
  const level = bestLevel(other);
  // Opt-in: also show older players above my age range who are happy to jam with learners.
  const olderMentor = p.learnFromOlder && other.age > p.ageMax && other.happyToTeach === true;
  const ageOk = (other.age >= p.ageMin && other.age <= p.ageMax) || olderMentor;
  const lookingFor = p.lookingFor || [];
  const playsWanted =
    lookingFor.length === 0 || other.instruments.some((i) => lookingFor.includes(i.name));
  return (
    playsWanted &&
    distanceKm <= p.maxDistanceKm &&
    ageOk &&
    level >= p.levelMin &&
    level <= p.levelMax &&
    genresOk(p.genreMode, me, other, shared)
  );
}

export function isMatchable(me, other) {
  if (other.lastActiveDays > INACTIVE_AFTER_DAYS) return false;
  const shared = sharedGenres(me, other);
  // Distance is the same both ways.
  return (
    fitsPrefs(me, other, shared, other.distanceKm) && fitsPrefs(other, me, shared, other.distanceKm)
  );
}

// Higher score = shown earlier.
export function score(me, other) {
  const levelGap = Math.abs(bestLevel(me) - bestLevel(other));
  const genres = sharedGenres(me, other).length;
  const artists = other.topArtists.filter((a) => me.topArtists.includes(a)).length;
  const myInstruments = me.instruments.map((i) => i.name);
  const complements = other.instruments.some((i) => !myInstruments.includes(i.name));
  return (
    genres * 3 + artists * 2 - levelGap * 2 - other.distanceKm / 5 + (complements ? 2 : 0)
  );
}

export function rankPeople(me, people) {
  return people
    .filter((p) => isMatchable(me, p))
    .sort((a, b) => score(me, b) - score(me, a));
}

export function sharedArtists(me, other) {
  return other.topArtists.filter((a) => me.topArtists.includes(a));
}

export { sharedGenres };
