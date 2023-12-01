"use client";

import clsx from "clsx";
import { size, sortBy, toPairs } from "lodash-es";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { isAfter, isEqual } from "date-fns";

import PageHeader from "@/components/layout/page-header";
import { MovieDetail, ShowtimesTheater } from "@/lib/types";
import {
  fetcher,
  floatHourToString,
  formatDDMMYYWithDots,
  getStartOfDayInParis,
  getStartOfTodayInParis,
  safeDate,
  splitIntoSubArrays,
} from "@/lib/util";

export default function ArchivesPage() {
  const { movieId } = useParams();

  const { data: movie } = useSWR<MovieDetail>(
    `/api/movies/by-id/${movieId}`,
    fetcher,
  );

  const screenings = useMemo(
    () =>
      toPairs(movie?.screenings ?? []).filter(
        ([date]) =>
          isAfter(getStartOfDayInParis(date), getStartOfTodayInParis()) ||
          isEqual(getStartOfDayInParis(date), getStartOfTodayInParis()),
      ),
    [movie],
  );

  return (
    <div className="mb-8 flex grow flex-col">
      <div className="flex pb-4">
        <PageHeader text="archives" />
      </div>
      {movie == null ? null : (
        <div className="flex flex-col">
          <div className="border-retro-gray text-retro-gray lg:bg-retro-green border-b pb-4 text-center text-xl/6 font-semibold uppercase lg:border-t lg:py-3 lg:pl-5 lg:text-left lg:text-3xl/8 lg:font-medium">
            <u className="underline">{movie.title}</u> ({movie.year}),{" "}
            {movie.directors}
          </div>
          <div className="flex flex-col lg:flex-row lg:pt-5">
            <div className="lg:border-retro-gray flex flex-col lg:w-1/2 lg:border-r lg:pb-40 lg:pr-5">
              {movie.image_file == null ? null : (
                <div className="flex pt-4 lg:pl-5 lg:pt-0">
                  {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="grow"
                      src={`data:image/png;base64,${movie.image_file}`}
                      alt="movie-screenshot"
                    />
                  }
                </div>
              )}
              {movie.review == null ? null : (
                <div
                  className="mb-8 pt-4 font-medium leading-6 lg:pb-14 lg:pl-5"
                  dangerouslySetInnerHTML={{ __html: movie.review }}
                ></div>
              )}
              <div
                className={clsx(
                  "text-retro-gray flex pb-8 text-xl/6 font-medium uppercase lg:pl-5",
                  { "mt-4": movie.review == null },
                )}
              >
                titre original : {movie.original_title}
                <br />
                {movie.duration == null
                  ? "Durée inconnue"
                  : `Durée ${Math.floor(
                      parseInt(movie.duration) / 60,
                    )} minutes`}
              </div>
            </div>
            <div className="flex flex-col lg:w-1/2 lg:pl-5">
              <div className="border-retro-gray bg-retro-green text-retro-gray flex border-y px-4 py-1 text-center text-xl/10 font-semibold uppercase lg:py-3 lg:text-2xl/6">
                prochaines scéances à paris
              </div>
              <div className="flex flex-col">
                {size(screenings) > 0 ? (
                  <div className="flex">
                    <Screenings screenings={screenings} />
                  </div>
                ) : (
                  <div className="border-retro-gray border-b py-4 text-center font-medium leading-3 lg:grow">
                    Pas de séances prévues pour le moment
                  </div>
                )}
                <div className="border-retro-gray mt-4 h-40 w-1/2 self-start border-r lg:hidden" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Screenings({
  screenings,
}: {
  screenings: [string, ShowtimesTheater[]][];
}) {
  const sortedByDateAndTheater = useMemo(
    () =>
      sortBy(screenings).map<[string, ShowtimesTheater[]]>(
        ([date, theaters]) => [
          date,
          sortBy(theaters, (theater) => theater.clean_name),
        ],
      ),
    [screenings],
  );

  return (
    <div className="flex grow flex-col">
      {sortedByDateAndTheater.map(([date, theaters]) => (
        <div
          key={date}
          className="border-retro-gray flex border-b py-4 font-medium leading-4"
        >
          <div className="shrink-0 pr-3">
            {formatDDMMYYWithDots(safeDate(date))}
          </div>
          <div className="flex grow flex-col gap-2">
            {theaters.map((theater) => (
              <div key={theater.clean_name} className="flex">
                <div className="grow">
                  {theater.clean_name} ({theater.zipcode_clean})
                </div>
                <div className="flex shrink-0 flex-col pl-3">
                  {splitIntoSubArrays(theater.showtimes, 3).map(
                    (showtimes, i) => (
                      <div
                        key={i}
                        className="flex flex-col lg:flex-row lg:justify-start"
                      >
                        {showtimes.map((showtime) => (
                          <div key={showtime} className="group flex">
                            {floatHourToString(showtime)}
                            <div className="hidden group-last:hidden lg:block">
                              &nbsp;•&nbsp;
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
