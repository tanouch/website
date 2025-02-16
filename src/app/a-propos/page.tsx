import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TwoColumnPage } from "@/components/layout/page";
import PageHeader from "@/components/layout/page-header";
import {
  BodyCopy,
  SectionTitle,
  SousTitre1,
} from "@/components/typography/typography";

import coupDeCoeur from "../../assets/coup-de-coeur.png";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AProposPage() {
  return (
    <>
      <PageHeader text="à propos">
        <SousTitre1>qui sommes nous ?</SousTitre1>
      </PageHeader>
      <TwoColumnPage left={<Project />} right={<Team />} />
    </>
  );
}

function Project() {
  return (
    <>
      <div className="pb-20px">
        <BodyCopy>
          Le Rétro Projecteur est un média digital, en libre accès et à but non
          lucratif qui se donne pour mission de mettre en lumière la
          programmation en salle du cinéma de patrimoine. Croyant à
          l&apos;existence d&apos;un cinéma aussi résolument populaire que
          politique, le Rétro Projecteur s&apos;engage à promouvoir une
          programmation originale, indépendante et enrichissante.
        </BodyCopy>
      </div>
      <div>
        <SectionTitle>contactez-nous</SectionTitle>
        <div className="py-20px lg:border-b">
          <BodyCopy>
            Une séance manquante, une erreur sur le site, un projet à nous
            proposer&nbsp;?
            <br />
            Cinémas, producteurs, indépendants&nbsp;?{" "}
            <a
              href="mailto:contact@leretroprojecteur.com"
              className="underline"
            >
              Écrivez-nous&nbsp;!
            </a>
          </BodyCopy>
        </div>
      </div>
    </>
  );
}

const teamMembers: {
  name: string;
  role: string;
  socialsIntro?: string;
  socials: { name: string; link: string }[];
  films: { name: string; id: string }[];
}[] = [
  {
    name: "Nicolas Guetta-Jeanrenaud",
    role: "Rédacteur en chef",
    socials: [
      { name: "Twitter", link: "https://twitter.com/nicogj_" },
      { name: "Letterboxd", link: "https://letterboxd.com/nicogj/" },
    ],
    films: [
      { name: "Les Rendez-vous d'Anna", id: "rendez-anna-1978" },
      { name: "Some Like It Hot", id: "certains-aiment-chaud-1959" },
      { name: "Les Idiots", id: "les-idiots-1998" },
      { name: "Ma nuit chez Maud", id: "nuit-chez-maud-1969" },
    ],
  },
  {
    name: "Lionel Guetta-Jeanrenaud",
    role: "Rédacteur newsletter et site-web",
    socials: [
      { name: "Twitter", link: "https://twitter.com/liojeanrenaud" },
      { name: "Letterboxd", link: "https://letterboxd.com/lioguetta/" },
    ],
    films: [
      { name: "Les Parapluies de Cherbourg", id: "parapluies-cherbourg-1963" },
      {
        name: "Jeannette, l'enfance de Jeanne d'Arc",
        id: "jeannette-enfance-jeanne-arc-2017",
      },
      { name: "L'Atalante", id: "l-atalante-1934" },
      { name: "Marie-Antoinette", id: "marie-antoinette-2006" },
    ],
  },
  {
    name: "Ugo Tanielian",
    role: "Rédacteur et Technologiste",
    socials: [],
    films: [
      { name: "Il était une fois dans l'Ouest", id: "etait-fois-ouest-1968" },
      { name: "John McCabe", id: "john-mccabe-1971" },
      { name: "Voyage au bout de l'enfer", id: "voyage-bout-enfer-1978" },
      { name: "Nothing But a Man", id: "nothing-man-1964" },
    ],
  },
  {
    name: "Claire Malot",
    role: "Designer graphique",
    socialsIntro: "Retrouvez mon travail sur ",
    socials: [
      { name: "Instagram", link: "https://www.instagram.com/clairon.malot/" },
      { name: "mon portfolio", link: "https://clairemalot.com/" },
    ],
    films: [
      { name: "L'une chante, l'autre pas", id: "chante-autre-1977" },
      { name: "Conte d'été", id: "conte-d-ete-1996" },
      { name: "First Cow", id: "first-cow-2020" },
    ],
  },
  {
    name: "Jonathan Roitgrund",
    role: "Développeur",
    socials: [],
    films: [
      { name: "After Hours", id: "after-hours-1985" },
      { name: "Stranger than Paradise", id: "stranger-than-paradise-1984" },
      { name: "Ça tourne à Manhattan", id: "ca-tourne-manhattan-1995" },
    ],
  },
  {
    name: "Léonard Faugières",
    role: "Rédacteur, Partenariats",
    socials: [],
    films: [
      { name: "Nos années sauvages", id: "nos-annees-sauvages-1990" },
      { name: "Bleu", id: "trois-couleurs-bleu-1993" },
      { name: "Série Noire", id: "serie-noire-1979" },
      { name: "Nous avons gagné ce soir", id: "gagne-soir-1949" },
    ],
  },
  {
    name: "Elias Leinenweber",
    role: "Rédacteur",
    socials: [
      { name: "Letterboxd", link: "https://letterboxd.com/lynchfanclubvie/" },
    ],
    films: [
      { name: "My Darling Clementine", id: "la-poursuite-infernale-1946" },
      { name: "La Fureur de Vivre", id: "fureur-vivre-1955" },
      {
        name: "Docteur Jerry et Mister Love",
        id: "docteur-jerry-mister-love-1963",
      },
      { name: "Conte d'été", id: "conte-d-ete-1996" },
    ],
  },
];

function Team() {
  return (
    <>
      <SectionTitle>l&apos;équipe du rétro</SectionTitle>
      {teamMembers.map((teamMember) => (
        <div key={teamMember.name} className="border-b py-17px text-center">
          <BodyCopy>
            <div>{teamMember.name}</div>
            <div className="uppercase">{teamMember.role}</div>
            {teamMember.socials.length > 0 && (
              <div>
                {teamMember.socialsIntro != null
                  ? teamMember.socialsIntro
                  : "Retrouvez-moi sur "}
                {teamMember.socials.map((social, i) => [
                  i > 0 && " & ",
                  <a
                    key={social.name}
                    href={social.link}
                    className="underline"
                    target="_blank"
                  >
                    {social.name}
                  </a>,
                ])}
              </div>
            )}
            <Image
              className="mt-[-0.1875rem] inline-block h-21px w-auto w-auto pr-5px"
              alt="coup de coeur"
              src={coupDeCoeur}
            />{" "}
            {teamMember.films.map((film, i) => [
              i > 0 && ", ",
              <Link
                key={film.name}
                href={"/film/" + film.id}
                className="italic underline"
              >
                {film.name}
              </Link>,
            ])}
          </BodyCopy>
        </div>
      ))}
    </>
  );
}
