"use client";

export default function Top({
  name,
  top,
}: {
  name: React.ReactNode;
  top: React.ReactNode[][];
}) {
  return (
    <div
      style={{
        width: "min(95%, 330px)",
        backgroundColor: "var(--lightred)",
        border: "3px solid var(--red)",
        padding: "3px",
        margin: "1px",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    >
      <h3>{name}</h3>
      <ol style={{ paddingLeft: "25px", margin: "0", textAlign: "left" }}>
        {top.map((film, index) => (
          <li key={index}>
            <i>{film[0]}</i>, {film[1]}
          </li>
        ))}
      </ol>
    </div>
  );
}
