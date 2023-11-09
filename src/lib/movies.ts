import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { unstable_cache } from "next/cache";
import "server-only";

import { format, hoursToSeconds } from "date-fns";

import { getFirebase } from "./firebase";
import { Movie } from "./types";
import { checkNotNull } from "./util";

export const getDayMovies = unstable_cache(
  async (date: Date) => {
    const { db } = getFirebase();
    const q = query(
      collection(db, "website-by-date-screenings"),
      where("date", "==", format(date, "Y_MM_dd")),
    );
    const docs: Movie[] = [];
    (await getDocs(q)).forEach((doc: any) => docs.push(...doc.data().movies));
    return docs;
  },
  ["day-movies"],
  { revalidate: hoursToSeconds(1) },
);

export const getMovies = unstable_cache(
  async () => {
    const { db } = getFirebase();
    const q = doc(db, "website-extra-docs", "all-movies");
    const querySnapshot = await getDoc(q);
    return checkNotNull(querySnapshot.data()).elements as Movie[];
  },
  ["all-movies"],
  { revalidate: hoursToSeconds(1) },
);
