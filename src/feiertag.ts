import { Wochentag } from "./wochentag";

export type Feiertag = {
  datumId: number;
  kalenderId: string;
  datum: Date;
  wochentag: Wochentag;
  typ: string;
  text: string;
  datumErstelltAm: Date;
  datumGeandertAm: Date;
};