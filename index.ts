import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

type Feiertag = {
  datumId: number;
  kalenderId: string;
  datum: Date;
  wochentag: Wochentag;
  typ: string;
  text: string;
  datumErstelltAm: Date;
  datumGeandertAm: Date;
};
const enum Wochentag {
  MONTAG = "Montag",
  DIENSTAG = "Dienstag",
  MITTWOCH = "Mittwoch",
  DONNERSTAG = "Donnerstag",
  FREITAG = "Freitag",
  SAMSTAG = "Samstag",
  SONNTAG = "Sonntag",
}

const csvFilePath: string = path.resolve(__dirname, "feiertagskalender.csv");
const headers: string[] = [
  "datumId",
  "kalenderId",
  "datum",
  "wochentag",
  "typ",
  "text",
  "datumErstelltAm",
  "datumGeandertAm",
];
const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

parse(
  fileContent,
  {
    delimiter: ",",
    columns: headers,
    fromLine: 2,
    cast: (value: string, context) => {
      if (context.column === "datumId") {
        return parseInt(value);
      }
      if (
        context.column === "datum" ||
        context.column === "datumErstelltAm" ||
        context.column === "datumGeandertAm"
      ) {
        return new Date(value);
      }
      if (context.column === "wochentag") {
        return value as Wochentag;
      }
      return value;
    },
  },
  (error, result: Feiertag[]) => {
    if (error) {
      console.log(error);
    } else {
      const sortedFeiertage: Feiertag[] = result.sort(
        (a, b) => a.datumId - b.datumId
      );
      const feiertagePerYear = new Map<number, Feiertag[]>();
      for (const feiertag of sortedFeiertage) {
        const year: number = feiertag.datum.getFullYear();
        feiertagePerYear.set(year, [
          ...(feiertagePerYear.get(year) ?? []),
          feiertag,
        ]);
      }
      feiertagePerYear.forEach((year: Feiertag[], key: number) => {
        let namesOfnotRealFeiertage: string[] = year.filter(
          (feiertag: Feiertag) =>
            (feiertag.wochentag === Wochentag.SAMSTAG ||
            feiertag.wochentag === Wochentag.SONNTAG) && (feiertag.typ === "HF" || feiertag.typ === "A")
        ).map((feiertag: Feiertag) => feiertag.text);
        console.log(key, namesOfnotRealFeiertage, namesOfnotRealFeiertage.length);
      });
    }
  }
);
