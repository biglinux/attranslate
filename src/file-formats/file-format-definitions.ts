import { TChangeSet, TSet } from "../core/core-definitions";
import { FlatJson } from "./flat-json/flat-json";
import { NestedJson } from "./nested-json/nested-json";

export interface WriteTFileArgs {
  path: string;
  tSet: TSet;
  changeSet: TChangeSet;
  manualReview: boolean;
  lng: string;
}

export interface ReadTFileArgs {
  path: string;
  lng: string;
  format: TFileType;
  keySearch: string;
  keyReplace: string;
}

export interface TFileFormat {
  writeTFile: (args: WriteTFileArgs) => void;
  readTFile: (args: ReadTFileArgs) => Promise<TSet>;
}

export type TFileType = keyof typeof fileFormatMap;

export function getTFileFormatList(): TFileType[] {
  return Object.keys(fileFormatMap) as TFileType[];
}

const fileFormatMap = {
  "flat-json": null,
  "nested-json": null,
  yaml: null,
  "android-xml": null,
  "ios-strings": null,
  "flutter-arb": null,
};

export async function instantiateTFileFormat(
  fileFormat: TFileType
): Promise<TFileFormat> {
  /**
   * To improve launch-performance, we import file-formats dynamically.
   */
  switch (fileFormat) {
    case "flat-json":
      return new FlatJson();
    case "nested-json":
      return new NestedJson();
    case "yaml":
      return new (await import("./yaml/yaml-generic")).YamlGeneric();
    case "flutter-arb":
      return new (await import("./flutter-arb/flutter-arb")).FlutterArb();
    case "android-xml":
      return new (await import("./android-xml/android-xml")).AndroidXml();
    case "ios-strings":
      return new (await import("./ios-strings/ios-strings")).IosStrings();
  }
}
