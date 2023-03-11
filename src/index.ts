import * as fs from "fs";
import * as path from "path";
import { Callback, CastingFunction, Options, parse } from "csv-parse";
import { Wochentag } from "./wochentag";
import { Feiertag } from "./feiertag";
import { Headers } from "./headers";
import { drawChart } from "./bar-chart";

const csvFilePath: string = path.resolve(__dirname, "feiertagskalender.csv");
const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
const parserOptionsCastingFunction: CastingFunction = (value: string, context) => {
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
};
const parserOptions: Options = {
  delimiter: ",",
  columns: Headers,
  fromLine: 2,
  cast: parserOptionsCastingFunction
};
const parserCallback: Callback = (error, result: Feiertag[]) => {
  if (error) {
    console.error(error);
  } else {
    result.sort((a, b) => a.datumId - b.datumId);
    const feiertagePerYear = new Map<number, Feiertag[]>();
    for (const feiertag of result) {
      const year: number = feiertag.datum.getFullYear();
      feiertagePerYear.set(year, [
        ...(feiertagePerYear.get(year) ?? []),
        feiertag,
      ]);
    }
    let chartData: { [key: string]: number} = {};
    feiertagePerYear.forEach((year: Feiertag[], key: number) => {
      let namesOfnotRealFeiertage: string[] = year.filter(
        (feiertag: Feiertag) =>
          (feiertag.wochentag === Wochentag.SAMSTAG ||
            feiertag.wochentag === Wochentag.SONNTAG) && (feiertag.typ === "HF" || feiertag.typ === "A")
      ).map((feiertag: Feiertag) => feiertag.text);
      console.log(key, namesOfnotRealFeiertage, namesOfnotRealFeiertage.length);
      chartData[`${key}`] = namesOfnotRealFeiertage.length;
    });
    console.log(drawChart(chartData, {maxBarLength: 5} ));
  }
};

parse(
  fileContent,
  parserOptions,
  parserCallback
);

