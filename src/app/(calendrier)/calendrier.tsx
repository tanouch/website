"use client";

import { useClickAway } from "@uidotdev/usehooks";
import classNames from "classnames";
import { capitalize, intersection, sortBy, uniqBy } from "lodash-es";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactSlider from "react-slider";

import {
  addDays,
  format,
  getHours,
  parse,
  startOfDay,
  startOfHour,
  subDays,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { fr } from "date-fns/locale";

import { Movie } from "@/lib/types";
import {
  checkNotNull,
  floatHourToString,
  isTodayInParis,
  movie_info_containsFilteringTerm,
} from "@/lib/util";

import logo_square from "./logo_square.png";

async function getApiMovies(date: Date): Promise<Movie[]> {
  return (await fetch(`api/${format(date, "y-MM-dd")}`)).json();
}

export default function Calendrier() {
  const _ = useSearchParams();

  const today = useMemo(
    () => startOfDay(utcToZonedTime(new Date(), "Europe/Paris")),
    [],
  );

  const [date, setDate] = useState(today);

  const [movies, setMovies] = useState<Movie[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setMovies(await getApiMovies(today));
    })();
  }, [today]);

  const previousDate = useMemo(
    () => (isTodayInParis(date) ? undefined : subDays(date, 1)),
    [date],
  );
  const nextDate = useMemo(() => addDays(date, 1), [date]);

  const onPrevious = useCallback(async () => {
    setDate(checkNotNull(previousDate));
    setMovies(await getApiMovies(checkNotNull(previousDate)));
  }, [setDate, previousDate]);
  const onNext = useCallback(async () => {
    setDate(checkNotNull(nextDate));
    setMovies(await getApiMovies(nextDate));
  }, [setDate, nextDate]);

  return (
    <>
      <h3>
        <input
          type="button"
          id="date-backward"
          className="button"
          value="◄"
          style={{
            color: previousDate == null ? "var(--lightgrey)" : "var(--red",
          }}
          onClick={previousDate == null ? undefined : onPrevious}
        />
        <b>
          <span id="date-of-today">
            {capitalize(format(date, "EEEE d MMMM y", { locale: fr }))}
          </span>
        </b>
        <input
          type="button"
          id="date-forward"
          className="button"
          value="►"
          style={{ color: "var(--red)" }}
          onClick={onNext}
        />
      </h3>
      <p style={{ margin: "7px" }}></p>
      <FilterableMovies isToday={isTodayInParis(date)} movies={movies} />
    </>
  );
}

export function FilterableMovies({
  movies,
  isToday,
}: {
  movies: Movie[] | undefined;
  isToday: boolean;
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = useCallback(
    () => setDropdownVisible(!dropdownVisible),
    [dropdownVisible, setDropdownVisible],
  );
  const listRef: MutableRefObject<HTMLDivElement> = useClickAway(() =>
    setDropdownVisible(false),
  );

  const [rg, setRg] = useState(true);
  const [rd, setRd] = useState(true);
  const [em, setEm] = useState(true);
  const onChangeRg = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRg(e.target.checked),
    [setRg],
  );
  const onChangeRd = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRd(e.target.checked),
    [setRd],
  );
  const onChangeEm = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEm(e.target.checked),
    [setEm],
  );

  const [filter, setFilter] = useState("");
  const onChangeFilter = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    [setFilter],
  );

  const todayMinHour = useMemo(
    () =>
      isToday
        ? getHours(startOfHour(utcToZonedTime(new Date(), "Europe/Paris")))
        : 0,
    [isToday],
  );

  const [minHour, setMinHour] = useState(todayMinHour);
  const [maxHour, setMaxHour] = useState(24);

  const onSliderChange = useCallback(
    (values: [min: number, max: number]) => {
      const [min, max] = values;
      setMinHour(min);
      setMaxHour(max);
    },
    [setMinHour, setMaxHour],
  );

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Slider minHour={minHour} maxHour={maxHour} onChange={onSliderChange} />
        <p style={{ margin: "7px" }}></p>
        <div id="wrap">
          <div
            ref={listRef}
            id="neighborhood-list"
            className={classNames("dropdown-check-list", {
              visible: dropdownVisible,
            })}
            tabIndex={100}
          >
            <span className="anchor" onClick={toggleDropdown}>
              Par quartiers
            </span>
            <ul className="items">
              <label className="checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="rg"
                  checked={rg}
                  onChange={onChangeRg}
                />{" "}
                Rive gauche
                <br />
              </label>
              <label className="checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="rd"
                  checked={rd}
                  onChange={onChangeRd}
                />{" "}
                Rive droite
                <br />
              </label>
              <label className="checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="em"
                  checked={em}
                  onChange={onChangeEm}
                />{" "}
                Extra-muros
                <br />
              </label>
            </ul>
          </div>
          &nbsp;
          <div className="filtering">
            <label htmlFor="filtering-box"></label>
            <input
              type="text"
              className="filtering-box"
              id="filtering-box"
              placeholder="Réalisateur, pays..."
              onChange={onChangeFilter}
            />
          </div>
        </div>
      </div>
      <p style={{ margin: "7px" }}></p>
      <div className="wrapper">
        <div className="profile">
          <table id="userdata" className="center">
            <thead>
              <tr>
                <th
                  style={{
                    width: "50%",
                    backgroundColor: "var(--red)",
                    color: "var(--white)",
                  }}
                >
                  <strong>Film</strong>
                </th>
                <th
                  style={{
                    width: "50%",
                    backgroundColor: "var(--red)",
                    color: "var(--white)",
                  }}
                >
                  <strong>Séances</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {movies == null ? (
                [...Array(20)].map((_, i) => (
                  <tr key={i}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))
              ) : (
                <Movies
                  movies={movies}
                  filter={filter}
                  minHour={minHour}
                  maxHour={maxHour}
                  quartiers={[
                    ...(rg ? ["rg"] : []),
                    ...(rd ? ["rd"] : []),
                    ...(em ? ["em"] : []),
                  ]}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function Movies({
  movies,
  quartiers,
  filter,
  minHour,
  maxHour,
}: {
  movies: Movie[];
  quartiers: string[];
  filter: string;
  minHour: number;
  maxHour: number;
}) {
  const moviesWithFilteredShowtimes = useMemo(
    () =>
      movies
        .map((movie) => ({
          ...movie,
          showtimes_theater: movie.showtimes_theater
            .map((theater) => ({
              ...theater,
              showtimes: theater.showtimes.filter(
                (showtime) => showtime >= minHour && showtime <= maxHour,
              ),
            }))
            .filter(
              (theater) =>
                theater.showtimes.length > 0 &&
                quartiers.includes(theater.location_2),
            ),
        }))
        .filter((movie) => movie.showtimes_theater.length > 0),
    [movies, minHour, maxHour, quartiers],
  );

  const filteredMovies = useMemo(
    () =>
      moviesWithFilteredShowtimes.filter(
        (movie) =>
          filter == "" || movie_info_containsFilteringTerm(movie, filter),
      ),
    [moviesWithFilteredShowtimes, filter],
  );

  return (
    <>
      {filteredMovies.length > 0 ? (
        sortBy(filteredMovies, (movie) => [
          movie.year,
          movie.directors,
          movie.title,
        ]).map((movie) => (
          <tr key={movie.id}>
            <td>
              <Link
                href={`/details?id=${movie.id}`}
                style={{ textDecoration: "none" }}
              >
                {movie?.category === "COUP DE CŒUR" ? (
                  <div className="logo_cdc">
                    <Image
                      src={logo_square}
                      width={20}
                      height={17}
                      alt="coup-de-coeur"
                    />
                  </div>
                ) : null}
                <b>{movie.title}</b>, {movie.directors} ({movie.year})
              </Link>
            </td>
            <td>
              {sortBy(
                uniqBy(
                  movie.showtimes_theater,
                  (showtime_theater) => showtime_theater.clean_name,
                ),
                (showtime_theater) => showtime_theater.clean_name,
              ).map((showtime_theater) => (
                <div key={showtime_theater.clean_name}>
                  {showtime_theater.clean_name} (
                  {showtime_theater.zipcode_clean}
                  ):{" "}
                  {sortBy(showtime_theater.showtimes)
                    .map((showtime) => {
                      return floatHourToString(showtime);
                    })
                    .join(", ")}
                </div>
              ))}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={2}>
            <b>
              {filter.length > 0
                ? "Aucun film ne correspond à cette recherche aujourd'hui."
                : "Aucun film ne joue à cette heure-ci aujourd'hui, regardez demain ?"}
            </b>
          </td>
        </tr>
      )}
    </>
  );
}

function Slider({
  minHour,
  maxHour,
  onChange,
}: {
  minHour: number;
  maxHour: number;
  onChange: (values: [min: number, max: number]) => void;
}) {
  return (
    <>
      <div>
        Séances entre{" "}
        <b style={{ color: "var(--red)", fontWeight: "bold" }}>
          {minHour}h et {maxHour}h
        </b>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReactSlider
          className="slider-range"
          value={[minHour, maxHour]}
          max={24}
          min={0}
          minDistance={1}
          onChange={onChange}
          thumbClassName="noUi-handle"
          trackClassName="slider-track"
        />
      </div>
    </>
  );
}
