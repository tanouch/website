"use client";

import classNames from "classnames";
import { sortBy } from "lodash-es";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import RetroInput from "@/components/forms/retro-input";
import PageHeader from "@/components/layout/page-header";
import { Review } from "@/lib/types";
import {
  formatDDMMYYWithDots,
  isCoupDeCoeur,
  movie_info_containsFilteringTerm,
  safeDate,
} from "@/lib/util";

export default function CoupsDeCoeurPage() {
  const [filter, setFilter] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      setReviews(
        sortBy(
          (await (await fetch("/api/movies/all-reviewed")).json()).filter(
            isCoupDeCoeur,
          ),
          (review) => -safeDate(review.review_date).valueOf(),
        ),
      );
    })();
  }, []);

  const filteredReviews = useMemo(
    () =>
      filter === ""
        ? reviews
        : reviews.filter((review) =>
            movie_info_containsFilteringTerm(review, filter),
          ),
    [filter, reviews],
  );

  return (
    <div className="flex grow flex-col pb-4">
      <div className="flex pb-4">
        <PageHeader text="coups de coeur" />
      </div>
      <div className="flex flex-col gap-4 lg:gap-5">
        <div className="border-retro-gray text-retro-gray lg:bg-retro-green flex border-b py-4 text-xl/6 font-semibold uppercase lg:border-t lg:px-5 lg:text-3xl/6">
          archive des critiques
        </div>
        <div className="flex lg:pl-5">
          <RetroInput
            placeholder="recherche"
            value={filter}
            setValue={setFilter}
          />
        </div>
        <div className="flex grow flex-col pl-5">
          {filteredReviews.map((review) => (
            <div key={review.id} className="group flex">
              <div className="border-retro-gray flex border-r pr-2 lg:pr-5">
                <div
                  className={classNames(
                    "border-retro-gray text-retro-black group-odd:bg-retro-green w-[88px] grow gap-1 border-b px-1 py-2 font-medium group-first:border-t lg:px-3 lg:py-4 lg:text-lg/6 lg:group-odd:bg-white",
                  )}
                >
                  {formatDDMMYYWithDots(safeDate(review.review_date))}
                </div>
              </div>
              <div className="border-retro-gray flex grow pl-2 lg:pl-5">
                <div
                  className={classNames(
                    "border-retro-gray text-retro-black group-odd:bg-retro-green grow border-b px-1 py-2 font-medium uppercase group-first:border-t lg:px-3 lg:py-4 lg:text-lg/6 lg:group-odd:bg-white",
                  )}
                >
                  <Link href={`/archives/${review.id}`} className="underline">
                    {review.title}
                  </Link>{" "}
                  ({review.year}), {review.directors}
                </div>
              </div>
            </div>
          ))}
          <div className="flex h-40">
            <div className="border-retro-gray w-1/2 border-r pr-2"></div>
            <div className="w-1/2 pl-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
